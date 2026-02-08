import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

import {
  doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { auth, db } from "./firebase.js";
import { setState } from "./ui.js";

export let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: user.displayName || user.email,
      chessElo: 1000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  }

  setState({ user });
});

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function register(email, password, name) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  if (name) await updateProfile(cred.user, { displayName: name });
}

export async function logout() {
  await signOut(auth);
}
