import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

function qs(id){ return document.getElementById(id); }

const authOpen = qs("auth-open");
const logoutBtn = qs("logout-btn");
const playBtns = document.querySelectorAll("#play-btn, #play-btn-2");
const protectedBtns = document.querySelectorAll(
  ".btn-game, .btn-primary, .btn-ghost"
);

function setEnabled(el, on){
  if (!el) return;
  el.disabled = !on;
  el.classList.toggle("disabled", !on);
}

onAuthStateChanged(auth, (user)=>{
  const logged = !!user;

  // Login / Logout buttons
  if (authOpen) authOpen.style.display = logged ? "none" : "";
  setEnabled(logoutBtn, logged);

  // Play buttons
  playBtns.forEach(btn => setEnabled(btn, true));

  // Everything that requires auth
  protectedBtns.forEach(btn => {
    if (btn.closest(".requires-auth")) {
      setEnabled(btn, logged);
    }
  });

  // Debug (можеш видалити)
  console.log("[UI] Auth state:", logged);
});
