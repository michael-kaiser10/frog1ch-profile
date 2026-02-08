import { db } from "./firebase.js";
import { currentUser, onUser } from "./auth.js";
import { qs, toast } from "./ui.js";
import {
  collection, doc, getDocs, getDoc, setDoc, addDoc, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const ADMIN_UID = "GTWT222m9NRixYoFZBPJ6IfSN3j1";

function isAdmin(){ return !!currentUser && currentUser.uid === ADMIN_UID; }

function renderBadge(el, b){
  const d = document.createElement("div");
  d.className = "badge";
  const color = b.color || "#ffffff";
  d.style.borderColor = "rgba(255,255,255,.12)";
  d.style.background = "rgba(255,255,255,.04)";
  d.innerHTML = `<span style="font-size:14px">${b.icon || "🏅"}</span>
    <span>${escapeHtml(b.name || "Badge")}</span>
    ${b.desc ? `<small>${escapeHtml(b.desc)}</small>` : ""}`;
  d.title = b.desc || "";
  el.appendChild(d);

  // accent glow on hover
  d.onmouseenter = ()=> d.style.borderColor = color;
  d.onmouseleave = ()=> d.style.borderColor = "rgba(255,255,255,.12)";
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

export async function loadAllBadges(){
  const snap = await getDocs(query(collection(db,"badges"), orderBy("name")));
  const out = [];
  snap.forEach(d=> out.push({ id:d.id, ...d.data() }));
  return out;
}

export async function loadUserBadges(uid){
  const snap = await getDoc(doc(db,"user_badges", uid));
  const data = snap.exists() ? snap.data() : {};
  return Array.isArray(data.badges) ? data.badges : [];
}

export async function renderUserBadges(uid, targetId){
  const target = qs(targetId);
  if (!target) return;
  target.innerHTML = "";
  const badges = await loadUserBadges(uid);
  if (!badges.length){
    target.innerHTML = `<p class="muted">No medals yet.</p>`;
    return;
  }
  badges.forEach(b=> renderBadge(target, b));
}

async function adminInit(){
  const panel = qs("admin-panel");
  if (!panel) return;

  panel.classList.toggle("hidden", !isAdmin());
  if (!isAdmin()) return;

  // fill badge select
  const badgeSelect = qs("assign-badge");
  const userSelect = qs("assign-user");
  const all = await loadAllBadges();

  if (badgeSelect){
    badgeSelect.innerHTML = `<option value="">Select medal</option>` +
      all.map(b=>`<option value="${b.id}">${escapeHtml(b.name||b.id)}</option>`).join("");
  }

  // load users (basic list)
  if (userSelect){
    const usersSnap = await getDocs(query(collection(db,"users"), orderBy("name")));
    const users = [];
    usersSnap.forEach(d=> users.push({ id:d.id, ...d.data() }));
    userSelect.innerHTML = `<option value="">Select user</option>` +
      users.map(u=>`<option value="${u.id}">${escapeHtml(u.name||u.email||u.id)}</option>`).join("");
  }

  // create badge
  const createBtn = qs("badge-create");
  if (createBtn){
    createBtn.onclick = async ()=>{
      const name = (qs("badge-name")?.value || "").trim().slice(0,40);
      const icon = (qs("badge-icon")?.value || "").trim().slice(0,4) || "🏅";
      const color = (qs("badge-color")?.value || "").trim().slice(0,20) || "#e7c16f";
      const desc = (qs("badge-desc")?.value || "").trim().slice(0,60);

      if (!name) return toast("Помилка", "Введи назву медалі", "danger");
      try{
        await addDoc(collection(db,"badges"), {
          name, icon, color, desc,
          createdAt: serverTimestamp(),
          by: currentUser.uid
        });
        toast("Готово", "Медаль створена", "ok");
        location.reload();
      }catch(e){
        toast("Помилка", "Не вдалося створити", "danger");
      }
    };
  }

  // assign badge
  const assignBtn = qs("assign-badge-btn");
  if (assignBtn){
    assignBtn.onclick = async ()=>{
      const uid = (qs("assign-uid")?.value || "").trim() || (userSelect?.value || "");
      const badgeId = badgeSelect?.value || "";
      if (!uid) return toast("Помилка", "Вкажи UID/користувача", "danger");
      if (!badgeId) return toast("Помилка", "Обери медаль", "danger");

      try{
        const badgeDoc = await getDoc(doc(db,"badges", badgeId));
        if (!badgeDoc.exists()) return toast("Помилка", "Медалі не існує", "danger");
        const b = { id: badgeDoc.id, ...badgeDoc.data() };

        const ubRef = doc(db,"user_badges", uid);
        const ubSnap = await getDoc(ubRef);
        const badges = ubSnap.exists() && Array.isArray(ubSnap.data().badges) ? ubSnap.data().badges : [];

        // avoid duplicates by badge id
        const filtered = badges.filter(x => (x.id || x.name) !== b.id);
        filtered.push({ id:b.id, name:b.name, icon:b.icon, color:b.color, desc:b.desc });

        await setDoc(ubRef, { badges: filtered, updatedAt: serverTimestamp() }, { merge:true });
        toast("Готово", "Медаль видана", "ok");
      }catch(e){
        toast("Помилка", "Не вдалося видати", "danger");
      }
    };
  }
}

export function initBadgesPageHooks(){
  onUser(async ()=>{
    await adminInit();
  });
}
