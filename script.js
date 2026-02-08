import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getFirestore,
  doc, setDoc, getDoc, updateDoc,
  collection, addDoc, serverTimestamp,
  query, orderBy, limit, onSnapshot, getDocs
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* =========================
   0) Firebase config
   ========================= */
const firebaseConfig = {
  apiKey: "AIzaSyDqvImySFSGTUMWDkWFDYVrzvLZTulWmJg",
  authDomain: "discordwebsitebase.firebaseapp.com",
  projectId: "discordwebsitebase",
  storageBucket: "discordwebsitebase.firebasestorage.app",
  messagingSenderId: "717030253541",
  appId: "1:717030253541:web:6dcfc566cfff4dc61b450c",
  measurementId: "G-S7KL9BGQCY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, m => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[m]));

/* =========================
   1) Clock
   ========================= */
function startClock(){
  const el = $("time");
  if (!el) return;
  const tick = () => {
    const d = new Date();
    el.textContent = `${d.toLocaleTimeString()} • ${d.toLocaleDateString()}`;
  };
  tick();
  setInterval(tick, 1000);
}
startClock();

/* =========================
   2) Auth UI + modal
   ========================= */
let authMode = "login"; // login | signup
let currentUser = null;

function setAuthMessage(text, isErr=false){
  const el = $("auth-msg");
  if (!el) return;
  el.textContent = text || "";
  el.style.color = isErr ? "var(--danger)" : "var(--muted)";
}

function setAuthMode(mode){
  authMode = mode;
  const title = $("auth-title");
  const extra = $("signup-extra");
  const submit = $("submit-auth");
  const toggle = $("toggle-auth");

  if (title) title.textContent = (mode === "signup") ? "Sign up" : "Login";
  if (extra) extra.style.display = (mode === "signup") ? "" : "none";
  if (submit) submit.textContent = (mode === "signup") ? "Sign up" : "Log in";
  if (toggle) toggle.textContent = (mode === "signup") ? "Switch to Login" : "Switch to Sign up";
}

function openAuthModal(){
  const m = $("auth-modal");
  if (m) m.classList.remove("hidden");
}
function closeAuthModal(){
  const m = $("auth-modal");
  if (m) m.classList.add("hidden");
}

async function ensureUserDoc(user){
  // мінімальний профіль
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name: user.displayName || user.email || "Player",
    email: user.email || "",
    chessElo: 1000,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }, { merge: true });

  // дублюємо в leaderboards для простого рейтингу
  await setDoc(doc(db, "leaderboards", user.uid), {
    uid: user.uid,
    name: user.displayName || user.email || "Player",
    chessElo: 1000,
    updatedAt: serverTimestamp()
  }, { merge: true });
}

function updateAuthUI(){
  const logged = !!currentUser;
  const status = $("auth-status");
  const authOpen = $("auth-open");
  const logoutBtn = $("logout-btn");
  const profileOpen = $("profile-open");

  if (status){
    status.textContent = logged
      ? `Logged in as ${currentUser.displayName || currentUser.email}`
      : "Not logged in.";
  }
  if (authOpen) authOpen.style.display = logged ? "none" : "";
  if (logoutBtn) logoutBtn.disabled = !logged;
  if (profileOpen) profileOpen.disabled = !logged;

  // якщо відкрито модалку і залогінився — закрити
  if (logged) closeAuthModal();
}

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user) await ensureUserDoc(user);
  updateAuthUI();
  // для сторінок, що залежать від логіну
  initAccountPage();
  initDmUsers();
});

/* bind modal buttons */
document.addEventListener("click", async (e) => {
  const t = e.target;

  if (t.closest("#auth-open")) openAuthModal();
  if (t.closest("#auth-close")) closeAuthModal();

  if (t.closest("#toggle-auth")){
    setAuthMessage("");
    setAuthMode(authMode === "signup" ? "login" : "signup");
  }

  if (t.closest("#submit-auth")){
    const email = ($("email-input")?.value || "").trim();
    const pass = ($("pass-input")?.value || "").trim();
    const nick = ($("nick-input")?.value || "").trim();

    if (!email || !pass) return setAuthMessage("Fill email and password.", true);
    if (pass.length < 6) return setAuthMessage("Password must be at least 6 chars.", true);

    try{
      setAuthMessage("");
      if (authMode === "signup"){
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        if (nick) await updateProfile(cred.user, { displayName: nick });
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
    }catch(err){
      setAuthMessage(err?.code || "Auth error", true);
    }
  }

  if (t.closest("#logout-btn")){
    try{ await signOut(auth); }catch{}
  }
});

// Enter = submit
["email-input","pass-input","nick-input"].forEach(id=>{
  const el = $(id);
  if (!el) return;
  el.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
      e.preventDefault();
      $("submit-auth")?.click();
    }
  });
});

setAuthMode("login");

/* =========================
   3) Profile modal (view + edit)
   ========================= */
function openProfileModal(){
  const m = $("profile-modal");
  if (m) m.classList.remove("hidden");
}
function closeProfileModal(){
  const m = $("profile-modal");
  if (m) m.classList.add("hidden");
}

async function loadProfileToModal(){
  if (!currentUser) return;
  $("profile-uid") && ($("profile-uid").textContent = currentUser.uid);

  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};

  if ($("profile-name")) $("profile-name").value = data.name || (currentUser.displayName || currentUser.email || "Player");
  if ($("profile-elo")) $("profile-elo").value = (typeof data.chessElo === "number" ? data.chessElo : 1000);

  const msg = $("profile-msg");
  if (msg) msg.textContent = "";
}

document.addEventListener("click", async (e)=>{
  const t = e.target;
  if (t.closest("#profile-open")){
    if (!currentUser) return;
    await loadProfileToModal();
    openProfileModal();
  }
  if (t.closest("#profile-close")) closeProfileModal();

  if (t.closest("#profile-save")){
    if (!currentUser) return;
    const name = ($("profile-name")?.value || "").trim() || "Player";
    const elo = Number(($("profile-elo")?.value || "1000").trim());
    const safeElo = Number.isFinite(elo) && elo >= 0 ? Math.floor(elo) : 1000;

    await updateDoc(doc(db,"users",currentUser.uid), {
      name,
      chessElo: safeElo,
      updatedAt: serverTimestamp()
    });
    await updateDoc(doc(db,"leaderboards",currentUser.uid), {
      name,
      chessElo: safeElo,
      updatedAt: serverTimestamp()
    });

    const msg = $("profile-msg");
    if (msg) msg.textContent = "Saved.";
  }
});

/* =========================
   4) Account page
   ========================= */
async function initAccountPage(){
  const nameEl = $("account-name");
  const eloEl = $("account-elo");
  const saveBtn = $("account-save");
  const msg = $("account-msg");
  if (!nameEl || !eloEl || !saveBtn) return;

  if (!currentUser){
    saveBtn.disabled = true;
    if (msg) msg.textContent = "Login first.";
    return;
  }

  saveBtn.disabled = false;

  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);
  const data = snap.exists() ? snap.data() : {};

  nameEl.value = data.name || (currentUser.displayName || currentUser.email || "Player");
  eloEl.value = (typeof data.chessElo === "number" ? data.chessElo : 1000);
  if (msg) msg.textContent = "";

  saveBtn.onclick = async () => {
    const name = nameEl.value.trim() || "Player";
    const elo = Number(eloEl.value || "1000");
    const safeElo = Number.isFinite(elo) && elo >= 0 ? Math.floor(elo) : 1000;

    await updateDoc(doc(db,"users",currentUser.uid), {
      name,
      chessElo: safeElo,
      updatedAt: serverTimestamp()
    });
    await updateDoc(doc(db,"leaderboards",currentUser.uid), {
      name,
      chessElo: safeElo,
      updatedAt: serverTimestamp()
    });

    if (msg) msg.textContent = "Saved.";
  };
}

/* =========================
   5) Global chat
   ========================= */
function renderMsg({name, text, createdAt}){
  const when = createdAt?.toDate ? createdAt.toDate().toLocaleString() : "";
  return `
    <div class="msg">
      <div class="meta">
        <div>${esc(name || "Player")}</div>
        <div>${esc(when)}</div>
      </div>
      <div class="text">${esc(text || "")}</div>
    </div>
  `;
}

function initGlobalChat(){
  const list = $("chat-list");
  const input = $("chat-message");
  const send = $("chat-send");
  if (!list || !input || !send) return;

  const q = query(collection(db, "chat"), orderBy("createdAt","asc"), limit(200));
  onSnapshot(q, (snap)=>{
    const html = [];
    snap.forEach(d => html.push(renderMsg(d.data())));
    list.innerHTML = html.join("");
    list.scrollTop = list.scrollHeight;
  });

  async function doSend(){
    if (!currentUser) return alert("Login first");
    const text = input.value.trim();
    if (!text) return;
    await addDoc(collection(db, "chat"), {
      uid: currentUser.uid,
      name: currentUser.displayName || currentUser.email || "Player",
      text,
      createdAt: serverTimestamp()
    });
    input.value = "";
  }

  send.addEventListener("click", doSend);
  input.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
      e.preventDefault();
      doSend();
    }
  });
}
initGlobalChat();

/* =========================
   6) DM (без індексів): dm_threads/{threadId}/messages
   ========================= */
let currentThreadId = null;
let dmUnsub = null;

function threadId(a,b){
  return [a,b].sort().join("__");
}

async function initDmUsers(){
  const sel = $("dm-user");
  if (!sel) return;

  if (!currentUser){
    sel.innerHTML = `<option value="">Login first</option>`;
    return;
  }

  const snap = await getDocs(collection(db,"users"));
  const users = [];
  snap.forEach(d=>{
    if (d.id !== currentUser.uid){
      const u = d.data();
      users.push({ uid: d.id, name: u.name || u.email || d.id });
    }
  });

  users.sort((x,y)=> (x.name||"").localeCompare(y.name||""));
  sel.innerHTML = `<option value="">Select user</option>` + users.map(u =>
    `<option value="${esc(u.uid)}">${esc(u.name)}</option>`
  ).join("");
}

function initDm(){
  const list = $("dm-list");
  const input = $("dm-message");
  const send = $("dm-send");
  const openBtn = $("dm-open");
  const sel = $("dm-user");
  const uidInput = $("dm-uid");
  if (!list || !input || !send || !openBtn || !sel || !uidInput) return;

  function setThread(otherUid){
    if (!currentUser) return alert("Login first");
    if (!otherUid) return;

    currentThreadId = threadId(currentUser.uid, otherUid);

    if (dmUnsub) { dmUnsub(); dmUnsub = null; }
    list.innerHTML = "";

    const msgsRef = collection(db, "dm_threads", currentThreadId, "messages");
    const q = query(msgsRef, orderBy("createdAt","asc"), limit(300));
    dmUnsub = onSnapshot(q, (snap)=>{
      const html = [];
      snap.forEach(d => html.push(renderMsg(d.data())));
      list.innerHTML = html.join("");
      list.scrollTop = list.scrollHeight;
    });
  }

  openBtn.addEventListener("click", ()=>{
    const other = (uidInput.value || "").trim() || sel.value;
    setThread(other);
  });

  async function doSend(){
    if (!currentUser) return alert("Login first");
    if (!currentThreadId) return alert("Open thread first");
    const text = input.value.trim();
    if (!text) return;

    const msgsRef = collection(db, "dm_threads", currentThreadId, "messages");
    await addDoc(msgsRef, {
      uid: currentUser.uid,
      name: currentUser.displayName || currentUser.email || "Player",
      text,
      createdAt: serverTimestamp()
    });
    input.value = "";
  }

  send.addEventListener("click", doSend);
  input.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
      e.preventDefault();
      doSend();
    }
  });
}
initDm();

/* =========================
   7) Ranking
   ========================= */
function initRanking(){
  const box = $("leaderboard");
  if (!box) return;

  const q = query(collection(db, "leaderboards"), orderBy("chessElo","desc"), limit(50));
  onSnapshot(q, (snap)=>{
    const rows = [];
    rows.push(`<div class="table-row head"><div>#</div><div>Player</div><div>ELO</div></div>`);
    let i = 0;
    snap.forEach(d=>{
      i++;
      const r = d.data();
      rows.push(
        `<div class="table-row">
          <div>${i}</div>
          <div>${esc(r.name || r.uid || d.id)}</div>
          <div class="mono">${esc(String(r.chessElo ?? 1000))}</div>
        </div>`
      );
    });
    box.innerHTML = rows.join("");
  });
}
initRanking();

/* =========================
   8) Feedback
   ========================= */
function initFeedback(){
  const text = $("fb-text");
  const send = $("fb-send");
  const msg = $("fb-msg");
  if (!text || !send) return;

  send.addEventListener("click", async ()=>{
    const v = text.value.trim();
    if (!v) return;

    await addDoc(collection(db,"feedback"),{
      text: v,
      uid: currentUser?.uid || null,
      name: currentUser?.displayName || currentUser?.email || null,
      createdAt: serverTimestamp()
    });

    text.value = "";
    if (msg) msg.textContent = "Sent. Thanks!";
  });
}
initFeedback();

/* =========================
   9) Final safety
   ========================= */
window.addEventListener("error", (e)=>{
  // це допоможе тобі ловити помилки на GitHub Pages в консолі
  console.error("[Runtime error]", e.error || e.message);
});
