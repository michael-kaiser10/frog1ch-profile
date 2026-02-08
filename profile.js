import { auth, db } from "./firebase.js";
import { currentUser, onUser } from "./auth.js";
import { qs, toast } from "./ui.js";
import { renderUserBadges } from "./badges.js";
import {
  doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

function getUidFromQuery(){
  const p = new URLSearchParams(location.search);
  return p.get("uid");
}

function fmtTime(sec){
  const s = Number(sec || 0);
  const m = Math.floor(s/60);
  const h = Math.floor(m/60);
  const mm = m % 60;
  if (h > 0) return `${h}h ${mm}m`;
  return `${m}m`;
}

async function loadUserDoc(uid){
  const snap = await getDoc(doc(db,"users", uid));
  return snap.exists() ? snap.data() : null;
}

async function loadStats(uid){
  const snap = await getDoc(doc(db,"leaderboards", uid));
  return snap.exists() ? snap.data() : null;
}

export async function initProfile(){
  const nameEl = qs("profile-name");
  const metaEl = qs("profile-meta");
  const bioEl = qs("bio-input");
  const nickEl = qs("nick-input");
  const saveBtn = qs("save-profile");
  const statTime = qs("stat-time");
  const statElo = qs("stat-elo");

  const viewUid = getUidFromQuery();
  onUser(async (u)=>{
    const uid = viewUid || u?.uid;
    if (!uid){
      location.href = "account.html";
      return;
    }

    // who is viewed
    const userDoc = await loadUserDoc(uid);
    const stats = await loadStats(uid);

    const displayName = userDoc?.name || (u && u.uid === uid ? (u.displayName || u.email) : "Player");
    if (nameEl) nameEl.textContent = displayName;
    if (metaEl) metaEl.textContent = userDoc?.email ? userDoc.email : (uid === u?.uid ? u?.email || "" : "");

    if (statTime) statTime.textContent = fmtTime(stats?.totalTime || 0);
    if (statElo) statElo.textContent = String(stats?.chessElo || 1000);

    // badges
    await renderUserBadges(uid, "badge-list");

    // editing only for own profile
    const canEdit = !!u && u.uid === uid;
    if (nickEl) nickEl.disabled = !canEdit;
    if (bioEl) bioEl.disabled = !canEdit;
    if (saveBtn) saveBtn.disabled = !canEdit;

    if (bioEl) bioEl.value = userDoc?.bio || "";
    if (nickEl) nickEl.value = canEdit ? (u.displayName || "") : (userDoc?.name || "");

    if (saveBtn && canEdit){
      saveBtn.onclick = async ()=>{
        const nick = (nickEl?.value || "").trim().replace(/[^a-z0-9_]/gi,"").slice(0,20);
        const bio = (bioEl?.value || "").trim().slice(0,160);

        try{
          if (nick){
            await updateProfile(auth.currentUser, { displayName: nick });
          }
          await setDoc(doc(db,"users", u.uid), {
            name: nick || (u.displayName || userDoc?.name || "Player"),
            bio,
            updatedAt: serverTimestamp()
          }, { merge:true });

          toast("Профіль", "Збережено", "ok");
          if (nameEl) nameEl.textContent = nick || nameEl.textContent;
        }catch(e){
          toast("Помилка", "Не вдалося зберегти", "danger");
        }
      };
    }
  });
}
