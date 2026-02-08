import { db } from "./firebase.js";
import { currentUser, onUser, requireAuth } from "./auth.js";
import { qs, toast } from "./ui.js";
import {
  doc, setDoc, serverTimestamp,
  collection, addDoc, getDocs, query, where, orderBy, limit, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let onlineUnsub = null;
let invitesUnsub = null;

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

async function setPresence(u, status){
  try{
    await setDoc(doc(db,"users", u.uid), {
      uid: u.uid,
      name: u.displayName || u.email || "Player",
      status,
      onlineAt: serverTimestamp()
    }, { merge:true });
  }catch{}
}

function renderPlayerList(host, users){
  host.innerHTML = "";
  users.forEach(u=>{
    const row = document.createElement("div");
    row.className = "card";
    row.innerHTML = `<div class="card-top">
      <div class="card-title">${escapeHtml(u.name || u.email || u.uid)}</div>
      <button class="btn btn-soft" type="button">Invite</button>
    </div>
    <div class="muted">${escapeHtml(u.uid)}</div>`;
    const btn = row.querySelector("button");
    btn.onclick = async ()=>{
      if (!requireAuth("account.html")) return;
      try{
        await addDoc(collection(db,"chess_invites"), {
          from: currentUser.uid,
          fromName: currentUser.displayName || currentUser.email || "Player",
          to: u.uid,
          game: (qs("invite-game")?.value || "chess"),
          createdAt: serverTimestamp(),
          status: "open"
        });
        toast("Invite", "Запрошення надіслано", "ok");
      }catch(e){
        toast("Invite", "Не вдалося", "danger");
      }
    };
    host.appendChild(row);
  });
  if (!users.length) host.innerHTML = `<p class="muted">No online players.</p>`;
}

function renderInvites(host, invites){
  host.innerHTML = "";
  invites.forEach(inv=>{
    const row = document.createElement("div");
    row.className = "card";
    row.innerHTML = `<div class="card-top">
      <div class="card-title">${escapeHtml(inv.fromName || "Player")}</div>
      <button class="btn btn-primary" type="button">Open</button>
    </div>
    <div class="muted">${escapeHtml(inv.game || "game")} • ${escapeHtml(inv.from || "")}</div>`;
    row.querySelector("button").onclick = ()=>{
      // For now: open chess modal/page
      toast("Invite", "Відкрий шахи (локально). Онлайн-матч можна додати наступним кроком.", "ok", 2600);
      const openChess = document.getElementById("chess-btn");
      openChess?.click();
    };
    host.appendChild(row);
  });
  if (!invites.length) host.innerHTML = `<p class="muted">No invites.</p>`;
}

export function initArena(){
  const onlineHost = qs("global-online") || qs("online-list");
  const invitesHost = qs("global-invites") || qs("invite-list");
  if (!onlineHost || !invitesHost) return; // not arena

  onUser(async (u)=>{
    if (!u) return;

    await setPresence(u, "online");
    window.addEventListener("beforeunload", ()=> setPresence(u, "offline"));

    // online players list
    onlineUnsub?.();
    const q1 = query(collection(db,"users"), where("status","==","online"), orderBy("onlineAt","desc"), limit(20));
    onlineUnsub = onSnapshot(q1, (snap)=>{
      const users = [];
      snap.forEach(d=>{
        const x = d.data();
        if (d.id === u.uid) return;
        users.push({ uid:d.id, ...x });
      });
      renderPlayerList(onlineHost, users);
    });

    // invites list (to me)
    invitesUnsub?.();
    const q2 = query(collection(db,"chess_invites"), where("to","==", u.uid), orderBy("createdAt","desc"), limit(20));
    invitesUnsub = onSnapshot(q2, (snap)=>{
      const inv = [];
      snap.forEach(d=> inv.push({ id:d.id, ...d.data() }));
      renderInvites(invitesHost, inv);
    });
  });
}
