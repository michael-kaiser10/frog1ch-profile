import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

export let currentUser = null;
function qs(id){ return document.getElementById(id); }

async function ensureUser(user){
  await setDoc(doc(db,"users",user.uid),{
    uid:user.uid,
    name:user.displayName || user.email || "Player",
    email:user.email || "",
    updatedAt: serverTimestamp()
  },{merge:true});
}

onAuthStateChanged(auth, async (user)=>{
  currentUser = user;
  if (user) await ensureUser(user);

  const status = qs("auth-status");
  if (status){
    status.textContent = user
      ? `Logged in as ${user.displayName || user.email}`
      : "Not logged in.";
  }
});

/* ===== MODAL ===== */
document.addEventListener("click",(e)=>{
  const modal = qs("auth-modal");
  if (!modal) return;

  if (e.target.closest("#auth-open")) modal.classList.remove("hidden");
  if (e.target.closest("#auth-close")) modal.classList.add("hidden");
});

/* ===== ACTIONS ===== */
document.addEventListener("click", async (e)=>{
  if (e.target.id === "submit-auth"){
    const email = qs("email-input")?.value.trim();
    const pass = qs("pass-input")?.value.trim();
    const confirm = qs("pass-confirm")?.value.trim();
    const nickRaw = qs("nick-input")?.value.trim();

    if (!email || !pass) return;

    try{
      if (confirm !== null && confirm !== ""){
        if (pass !== confirm) return alert("Passwords do not match");
        const cred = await createUserWithEmailAndPassword(auth,email,pass);
        const nick = nickRaw?.replace(/[^a-z0-9_]/gi,"").slice(0,20);
        if (nick) await updateProfile(cred.user,{displayName:nick});
      }else{
        await signInWithEmailAndPassword(auth,email,pass);
      }
      qs("auth-modal")?.classList.add("hidden");
    }catch(err){
      alert(err.code);
    }
  }

  if (e.target.id === "toggle-auth"){
    const c = qs("pass-confirm");
    const n = qs("nick-input");
    if (c && n){
      const show = c.style.display === "none";
      c.style.display = show ? "" : "none";
      n.style.display = show ? "" : "none";
    }
  }

  if (e.target.id === "logout-btn"){
    await signOut(auth);
  }
});
