import { db } from "./firebase.js";
import { currentUser } from "./auth.js";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

function qs(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m])); }

const chatList = qs("chat-list");
const chatInput = qs("chat-message");
const chatSend = qs("chat-send");

const dmList = qs("dm-list");
const dmInput = qs("dm-message");
const dmSend = qs("dm-send");
const dmUserSelect = qs("dm-user");
const dmUidInput = qs("dm-uid");
const dmOpen = qs("dm-load");

let currentThread = null;

/* ===== GLOBAL CHAT ===== */
if (chatList){
  const q = query(collection(db,"chat"), orderBy("createdAt","asc"));
  onSnapshot(q,(snap)=>{
    chatList.innerHTML = "";
    snap.forEach(d=>{
      const m = d.data();
      const div = document.createElement("div");
      div.className = "msg";
      div.innerHTML = `
        <div class="meta">
          <div class="who">${esc(m.name||"Player")}</div>
          <div class="when">${m.createdAt?.toDate?.().toLocaleString()||""}</div>
        </div>
        <div class="text">${esc(m.text||"")}</div>
      `;
      chatList.appendChild(div);
    });
    chatList.scrollTop = chatList.scrollHeight;
  });
}

async function sendGlobal(){
  if (!currentUser) return alert("Login first");
  const text = chatInput.value.trim();
  if (!text) return;
  await addDoc(collection(db,"chat"),{
    uid: currentUser.uid,
    name: currentUser.displayName || currentUser.email,
    text,
    createdAt: serverTimestamp()
  });
  chatInput.value = "";
}

chatSend?.addEventListener("click", sendGlobal);
chatInput?.addEventListener("keydown",(e)=>{
  if (e.key==="Enter"){ e.preventDefault(); sendGlobal(); }
});

/* ===== LOAD USERS FOR DM ===== */
async function loadUsers(){
  if (!dmUserSelect || !currentUser) return;
  const snap = await getDocs(collection(db,"users"));
  const users = [];
  snap.forEach(d=>{
    if (d.id !== currentUser.uid){
      users.push({ uid:d.id, ...d.data() });
    }
  });

  dmUserSelect.innerHTML =
    `<option value="">Select user</option>` +
    users.map(u=>`<option value="${u.uid}">${u.name||u.email||u.uid}</option>`).join("");
}

/* ===== OPEN DM ===== */
function makeThread(a,b){ return [a,b].sort().join("__"); }

dmOpen?.addEventListener("click", async ()=>{
  if (!currentUser) return alert("Login first");
  const uid = dmUidInput.value.trim() || dmUserSelect.value;
  if (!uid) return;
  currentThread = makeThread(currentUser.uid, uid);

  const q = query(collection(db,"dm_messages"), orderBy("createdAt","asc"));
  onSnapshot(q,(snap)=>{
    dmList.innerHTML = "";
    snap.forEach(d=>{
      const m = d.data();
      if (m.threadId !== currentThread) return;
      const div = document.createElement("div");
      div.className = "msg";
      div.innerHTML = `
        <div class="meta">
          <div class="who">${esc(m.name)}</div>
          <div class="when">${m.createdAt?.toDate?.().toLocaleString()||""}</div>
        </div>
        <div class="text">${esc(m.text)}</div>
      `;
      dmList.appendChild(div);
    });
    dmList.scrollTop = dmList.scrollHeight;
  });
});

/* ===== SEND DM ===== */
async function sendDm(){
  if (!currentUser || !currentThread) return;
  const text = dmInput.value.trim();
  if (!text) return;

  const [a,b] = currentThread.split("__");
  await addDoc(collection(db,"dm_messages"),{
    threadId: currentThread,
    from: currentUser.uid,
    to: currentUser.uid===a ? b : a,
    name: currentUser.displayName || currentUser.email,
    text,
    createdAt: serverTimestamp()
  });
  dmInput.value="";
}

dmSend?.addEventListener("click", sendDm);
dmInput?.addEventListener("keydown",(e)=>{
  if (e.key==="Enter"){ e.preventDefault(); sendDm(); }
});

/* ===== INIT ===== */
loadUsers();
