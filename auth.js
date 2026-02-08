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

function qs(id){ return document.getElementById(id); }

async function ensureUserDoc(user){
  await setDoc(doc(db,"users", user.uid), {
    uid: user.uid,
    name: user.displayName || user.email || "Player",
    email: user.email || "",
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }, { merge:true });
}

onAuthStateChanged(auth, async (user)=>{
  if (user) await ensureUserDoc(user);
});

/* ✅ Модалка: працює на будь-якій сторінці */
document.addEventListener("click", (e)=>{
  const modal = qs("auth-modal");
  if (!modal) return;

  if (e.target.closest("#auth-open")) modal.classList.remove("hidden");
  if (e.target.closest("#auth-close")) modal.classList.add("hidden");
});

/* ✅ Дії */
document.addEventListener("click", async (e)=>{
  if (e.target.id === "submit-auth"){
    const email = (qs("email-input")?.value || "").trim();
    const pass = (qs("pass-input")?.value || "").trim();
    const confirm = (qs("pass-confirm")?.value || "").trim();
    const nickRaw = (qs("nick-input")?.value || "").trim();

    if (!email || !pass) return alert("Fill email + password");

    try{
      // якщо confirm поле видиме — signup, інакше login
      const confirmVisible = qs("pass-confirm") && qs("pass-confirm").style.display !== "none";

      if (confirmVisible){
        if (pass !== confirm) return alert("Passwords do not match");
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const nick = nickRaw.replace(/[^a-z0-9_]/gi,"").slice(0,20);
        if (nick) await updateProfile(cred.user, { displayName:nick });
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }

      qs("auth-modal")?.classList.add("hidden");
    }catch(err){
      alert(err.code || "Auth error");
    }
  }

  if (e.target.id === "toggle-auth"){
    const c = qs("pass-confirm");
    const n = qs("nick-input");
    if (!c || !n) return;

    const nowHidden = c.style.display === "none";
    c.style.display = nowHidden ? "" : "none";
    n.style.display = nowHidden ? "" : "none";
  }

  if (e.target.id === "logout-btn"){
    try{ await signOut(auth); }catch{}
  }
});

/* ✅ Enter submit у модалці */
["email-input","pass-input","pass-confirm","nick-input"].forEach(id=>{
  const el = qs(id);
  if (!el) return;
  el.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
      e.preventDefault();
      qs("submit-auth")?.click();
    }
  });
});
