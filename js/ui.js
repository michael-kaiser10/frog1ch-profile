import { login, register, logout } from "./auth.js";

let state = {
  user: null
};

export function setState(newState) {
  state = { ...state, ...newState };
  renderAuthUI();
}

function $(id) {
  return document.getElementById(id);
}

function renderAuthUI() {
  const status = $("auth-status");
  const loginBtn = $("auth-open");
  const logoutBtn = $("logout-btn");

  if (!status) return;

  if (state.user) {
    status.textContent = "Logged as " + (state.user.displayName || state.user.email);
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.disabled = false;
  } else {
    status.textContent = "Not logged in";
    if (loginBtn) loginBtn.style.display = "";
    if (logoutBtn) logoutBtn.disabled = true;
  }
}

/* ===== AUTH MODAL LOGIC ===== */
document.addEventListener("click", async (e) => {
  if (e.target.id === "submit-auth") {
    const email = $("email-input").value.trim();
    const pass = $("pass-input").value.trim();
    const nick = $("nick-input")?.value.trim();

    if (!email || !pass) return alert("Fill all fields");

    try {
      await login(email, pass);
    } catch {
      await register(email, pass, nick);
    }
  }

  if (e.target.id === "logout-btn") {
    await logout();
  }

  if (e.target.id === "auth-open") {
    $("auth-modal")?.classList.remove("hidden");
  }

  if (e.target.id === "auth-close") {
    $("auth-modal")?.classList.add("hidden");
  }
});
