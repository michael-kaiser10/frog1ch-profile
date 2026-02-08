export function qs(id){ return document.getElementById(id); }

export function setActiveNav(){
  const links = document.querySelectorAll(".rail-nav a");
  const here = location.pathname.split("/").pop() || "index.html";
  links.forEach(a=>{
    const p = a.getAttribute("href");
    if (p === here) a.classList.add("active");
  });
}

export function startClock(){
  const el = qs("time");
  if (!el) return;
  setInterval(()=>{
    const d = new Date();
    el.textContent = d.toLocaleTimeString() + " • " + d.toLocaleDateString();
  }, 1000);
}

export function mountToasts(){
  if (document.getElementById("toast-wrap")) return;
  const wrap = document.createElement("div");
  wrap.id = "toast-wrap";
  wrap.className = "toast-wrap";
  document.body.appendChild(wrap);
}

export function toast(title, message="", type="ok", ms=2600){
  mountToasts();
  const wrap = document.getElementById("toast-wrap");
  const t = document.createElement("div");
  t.className = `toast ${type}`;
  t.innerHTML = `<div>
    <strong>${escapeHtml(title)}</strong>
    ${message ? `<p>${escapeHtml(message)}</p>` : ``}
  </div>`;
  wrap.appendChild(t);
  setTimeout(()=>{ t.remove(); }, ms);
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}
