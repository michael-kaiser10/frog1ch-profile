import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

export function qs(id){ return document.getElementById(id); }

export function setActiveNav(){
  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".rail-nav a").forEach(a=>{
    const href = (a.getAttribute("href") || "").toLowerCase();
    a.classList.toggle("active", href === here);
  });
}

export function startClock(){
  const el = qs("time");
  if (!el) return;
  const tick = ()=>{
    const d = new Date();
    el.textContent = d.toLocaleTimeString() + " • " + d.toLocaleDateString();
  };
  tick();
  setInterval(tick, 1000);
}

function setEnabled(el, on){
  if (!el) return;
  el.disabled = !on;
  el.classList.toggle("disabled", !on);
}

/**
 * Автоматично:
 * - ховає Login/Register коли залогінений
 * - вмикає Log out коли залогінений
 * - оновлює auth-status текст
 */
export function bindAuthUI(){
  const authOpen = qs("auth-open");
  const logoutBtn = qs("logout-btn");
  const status = qs("auth-status");

  onAuthStateChanged(auth, (user)=>{
    const logged = !!user;

    if (authOpen) authOpen.style.display = logged ? "none" : "";
    setEnabled(logoutBtn, logged);

    if (status){
      status.textContent = logged
        ? `Logged in as ${user.displayName || user.email}`
        : "Not logged in.";
    }

    console.log("[UI] Auth:", logged, "path:", location.pathname);
  });
}
