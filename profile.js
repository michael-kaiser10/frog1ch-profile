import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { onAuthStateChanged, updateProfile } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const nameEl = document.getElementById("profile-name");
const emailEl = document.getElementById("profile-email");
const nickInput = document.getElementById("nick-input");
const bioInput = document.getElementById("bio-input");
const saveBtn = document.getElementById("save-profile");
const msg = document.getElementById("profile-msg");

const statTime = document.getElementById("stat-time");
const statElo = document.getElementById("stat-elo");
const badgeList = document.getElementById("badge-list");

let currentUser = null;

function showMsg(text, error = false) {
  msg.textContent = text;
  msg.style.color = error ? "#f87171" : "var(--muted)";
}

async function loadProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    bioInput.value = data.bio || "";
  }
}

async function loadStats(uid) {
  const ref = doc(db, "leaderboards", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const d = snap.data();
    statTime.textContent = Math.floor((d.totalTime || 0) / 60) + " min";
    statElo.textContent = d.chessElo || 1000;
  }
}

async function loadBadges(uid) {
  badgeList.innerHTML = "";

  const ref = doc(db, "user_badges", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) return;

  const badges = snap.data().badges || [];
  badges.forEach(b => {
    const div = document.createElement("div");
    div.className = "badge";
    div.textContent = b.icon + " " + b.name;
    badgeList.appendChild(div);
  });
}

saveBtn.onclick = async () => {
  if (!currentUser) return;

  const nick = nickInput.value.trim().replace(/[^a-z0-9_]/gi, "");
  const bio = bioInput.value.trim();

  try {
    if (nick) {
      await updateProfile(currentUser, { displayName: nick });
      nameEl.textContent = nick;
    }

    await setDoc(doc(db, "users", currentUser.uid), {
      bio
    }, { merge: true });

    showMsg("Profile saved");
  } catch (e) {
    showMsg("Save error", true);
  }
};

onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "account.html";
    return;
  }

  currentUser = user;
  nameEl.textContent = user.displayName || "Player";
  emailEl.textContent = user.email;
  nickInput.value = user.displayName || "";

  await loadProfile(user.uid);
  await loadStats(user.uid);
  await loadBadges(user.uid);
});
