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
import { qs, toast } from "./ui.js";

export let currentUser = null;

const ADMIN_UID = "GTWT222m9NRixYoFZBPJ6IfSN3j1";

function emailOk(email){ return /^[^@]+@[^@]+\.[^@]+$/.test(email); }

function getErr(code){
  const map = {
    "auth/invalid-email":"Невірний email.",
    "auth/user-not-found":"Користувача не знайдено.",
    "auth/wrong-password":"Невірний пароль.",
    "auth/email-already-in-use":"Email уже зайнятий.",
    "auth/weak-password":"Слабкий пароль (мін. 6)."
  };
  return map[code] || "Помилка авторизації.";
}

function setText(id, text){
  const el = qs(id);
  if (el) el.textContent = text;
}

function setAuthMsg(text="", isErr=false){
  const el = qs("auth-msg");
  if (!el) return;
  el.textContent = text;
  el.style.color = isErr ? "var(--danger)" : "var(--muted)";
}

function show(el){ if (el) el.classList.remove("hidden"); }
function hide(el){ if (el) el.classList.add("hidden"); }

let mode = "signup";

function syncAuthUI(){
  const logged = !!currentUser;
  const status = qs("auth-status");
  const openBtn = qs("auth-open");
  const logoutBtn = qs("logout-btn");

  if (status){
    status.textContent = logged
      ? `Logged in as ${currentUser.displayName || currentUser.email}`
      : "Not logged in.";
  }
  if (openBtn) openBtn.style.display = logged ? "none" : "";
  if (logoutBtn) logoutBtn.disabled = !logged;

  const passConfirm = qs("pass-confirm");
  const nick = qs("nick-input");
  const submit = qs("submit-auth");
  const toggle = qs("toggle-auth");

  if (passConfirm) passConfirm.style.display = mode === "signup" ? "" : "none";
  if (nick) nick.style.display = mode === "signup" ? "" : "none";
  if (submit) submit.textContent = mode === "signup" ? "Sign up" : "Log in";
  if (toggle) toggle.textContent = mode === "signup" ? "Switch to Login" : "Switch to Sign up";

  // admin visibility hint (optional)
  const adminHint = qs("admin-hint");
  if (adminHint) adminHint.textContent = logged && currentUser.uid === ADMIN_UID ? "Admin: ON" : "";
}

async function ensureUserDoc(user){
  const name = user.displayName || user.email || "Player";
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email: user.email || "",
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }, { merge:true });
}

export function requireAuth(redirectTo="account.html"){
  if (!currentUser){
    location.href = redirectTo;
    return false;
  }
  return true;
}

export function onUser(cb){
  onAuthStateChanged(auth, u=>{
    currentUser = u;
    syncAuthUI();
    cb?.(u);
  });
}

async function signup(){
  const email = (qs("email-input")?.value || "").trim();
  const pass = (qs("pass-input")?.value || "").trim();
  const confirm = (qs("pass-confirm")?.value || "").trim();
  const nickRaw = (qs("nick-input")?.value || "").trim();

  if (!emailOk(email)) return setAuthMsg("Введи валідний email.", true);
  if (pass.length < 6) return setAuthMsg("Пароль мінімум 6 символів.", true);
  if (pass !== confirm) return setAuthMsg("Паролі не співпадають.", true);

  const nick = nickRaw.replace(/[^a-z0-9_]/gi, "").slice(0,20);

  try{
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (nick) await updateProfile(cred.user, { displayName: nick });
    await ensureUserDoc(cred.user);
    setAuthMsg("Акаунт створено.");
    toast("Успіх", "Ти зареєстрований", "ok");
    hide(qs("auth-modal"));
  }catch(e){
    setAuthMsg(getErr(e.code), true);
  }
}

async function login(){
  const email = (qs("email-input")?.value || "").trim();
  const pass = (qs("pass-input")?.value || "").trim();
  if (!emailOk(email)) return setAuthMsg("Введи валідний email.", true);
  if (!pass) return setAuthMsg("Введи пароль.", true);

  try{
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    await ensureUserDoc(cred.user);
    setAuthMsg("Вхід виконано.");
    toast("Вхід", "Ти залогінився", "ok");
    hide(qs("auth-modal"));
  }catch(e){
    setAuthMsg(getErr(e.code), true);
  }
}

async function logout(){
  await signOut(auth);
  setAuthMsg("Вихід виконано.");
  toast("Вихід", "Ти вийшов з акаунта", "ok");
}

function wire(){
  const modal = qs("auth-modal");
  const openBtn = qs("auth-open");
  const closeBtn = qs("auth-close");
  const submit = qs("submit-auth");
  const toggle = qs("toggle-auth");
  const logoutBtn = qs("logout-btn");

  if (openBtn && modal) openBtn.onclick = ()=> show(modal);
  if (closeBtn && modal) closeBtn.onclick = ()=> hide(modal);

  if (submit){
    submit.onclick = ()=>{
      setAuthMsg("");
      mode === "signup" ? signup() : login();
    };
  }
  if (toggle){
    toggle.onclick = ()=>{
      mode = mode === "signup" ? "login" : "signup";
      setAuthMsg("");
      syncAuthUI();
    };
  }
  if (logoutBtn) logoutBtn.onclick = logout;

  // Enter to submit in auth modal
  ["email-input","pass-input","pass-confirm","nick-input"].forEach(id=>{
    const el = qs(id);
    if (!el) return;
    el.addEventListener("keydown", (e)=>{
      if (e.key === "Enter"){
        e.preventDefault();
        submit?.click();
      }
    });
  });

  syncAuthUI();
}

onAuthStateChanged(auth, async (u)=>{
  currentUser = u;
  if (u) await ensureUserDoc(u);
  syncAuthUI();
});

wire();
