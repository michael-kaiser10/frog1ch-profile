import { db } from "./firebase.js";
import { currentUser, onUser, requireAuth } from "./auth.js";
import { qs, toast } from "./ui.js";
import {
  collection, doc, getDoc, getDocs, addDoc, setDoc,
  query, orderBy, limit, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let globalUnsub = null;
let dmUnsub = null;
let currentThreadId = null;

const EMOJIS = ["😀","😂","😍","😎","😭","😡","👍","👎","🔥","⚡","💯","🎯","🏆","❤️","🧠","🐸","🥶","🥵","😴","🤝"];

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

function renderMsg(host, m){
  const el = document.createElement("div");
  el.className = "msg";
  const name = m.name || "Player";
  const when = m.createdAt?.toDate ? m.createdAt.toDate().toLocaleString() : "";
  el.innerHTML = `
    <div class="meta">
      <div class="who">${escapeHtml(name)}</div>
      <div class="when">${escapeHtml(when)}</div>
    </div>
    ${m.text ? `<div class="text">${escapeHtml(m.text)}</div>` : ``}
    ${m.image ? `<img src="${m.image}" alt="image">` : ``}
  `;
  host.appendChild(el);
}

function scrollBottom(host){
  host.scrollTop = host.scrollHeight;
}

async function fileToDataUrl(file){
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // size limit 200KB
  if (bytes.byteLength > 200*1024) throw new Error("TOO_BIG");
  const blob = new Blob([bytes], { type: file.type || "application/octet-stream" });
  return await new Promise((res, rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(String(r.result));
    r.onerror = ()=> rej(new Error("READ_FAIL"));
    r.readAsDataURL(blob);
  });
}

function threadId(a,b){
  return [a,b].sort().join("__");
}

async function loadUserList(selectEl){
  const snap = await getDocs(query(collection(db,"users"), orderBy("name"), limit(80)));
  const rows = [];
  snap.forEach(d=> rows.push({ uid:d.id, ...d.data() }));
  selectEl.innerHTML = `<option value="">Select user</option>` + rows
    .filter(u=> u.uid !== currentUser.uid)
    .map(u=> `<option value="${u.uid}">${escapeHtml(u.name || u.email || u.uid)}</option>`)
    .join("");
}

export function initChat(){
  const chatList = qs("chat-list");
  const chatInput = qs("chat-message");
  const chatSend = qs("chat-send");
  const chatImage = qs("chat-image");
  const chatEmojiBtn = qs("chat-emoji-btn");
  const chatEmojiPanel = qs("chat-emoji-panel");
  const dmList = qs("dm-list");
  const dmInput = qs("dm-message");
  const dmSend = qs("dm-send");
  const dmUserSelect = qs("dm-user");
  const dmUidInput = qs("dm-uid");
  const dmOpen = qs("dm-load");

  let pendingImage = null;

  if (!chatList) return; // not on chat page

  onUser(async (u)=>{
    if (!u){
      toast("Auth", "Спочатку залогінься", "danger");
      return;
    }

    // GLOBAL CHAT LISTENER
    const q1 = query(collection(db,"chat"), orderBy("createdAt","asc"), limit(80));
    globalUnsub?.();
    globalUnsub = onSnapshot(q1, (snap)=>{
      chatList.innerHTML = "";
      snap.forEach(d=> renderMsg(chatList, d.data()));
      scrollBottom(chatList);
    });

    // user list for DM
    if (dmUserSelect) await loadUserList(dmUserSelect);

    // Emoji panel
    if (chatEmojiPanel){
      chatEmojiPanel.innerHTML = EMOJIS.map(e=> `<button class="emoji" type="button">${e}</button>`).join("");
      chatEmojiPanel.querySelectorAll(".emoji").forEach(btn=>{
        btn.onclick = ()=>{
          if (!chatInput) return;
          chatInput.value += btn.textContent;
          chatInput.focus();
        };
      });
    }

    if (chatEmojiBtn && chatEmojiPanel){
      chatEmojiBtn.onclick = ()=> chatEmojiPanel.classList.toggle("hidden");
    }

    // attach image
    if (chatImage){
      chatImage.onchange = async ()=>{
        const f = chatImage.files?.[0];
        if (!f) return;
        try{
          pendingImage = await fileToDataUrl(f);
          toast("Image", "Прикріплено", "ok");
        }catch(e){
          pendingImage = null;
          toast("Image", "Файл > 200KB або помилка читання", "danger");
        }
      };
    }

    async function sendGlobal(){
      if (!requireAuth("account.html")) return;

      const text = (chatInput?.value || "").trim().slice(0,500);
      if (!text && !pendingImage) return;

      try{
        await addDoc(collection(db,"chat"), {
          uid: u.uid,
          name: u.displayName || u.email || "Player",
          text: text || "",
          image: pendingImage || "",
          createdAt: serverTimestamp()
        });
        if (chatInput) chatInput.value = "";
        pendingImage = null;
        if (chatImage) chatImage.value = "";
      }catch(e){
        toast("Chat", "Не вдалося надіслати", "danger");
      }
    }

    if (chatSend) chatSend.onclick = sendGlobal;
    if (chatInput){
      chatInput.addEventListener("keydown", (e)=>{
        if (e.key === "Enter" && !e.shiftKey){
          e.preventDefault();
          sendGlobal();
        }
      });
    }

    // DM open
    async function openDm(peerUid){
      if (!peerUid) return;
      currentThreadId = threadId(u.uid, peerUid);

      // ensure a dm thread doc in users collection is optional; rules allow dm_messages only, so we keep minimal
      dmUnsub?.();
      const q2 = query(collection(db,"dm_messages"), orderBy("createdAt","asc"), limit(120));
      dmUnsub = onSnapshot(q2, (snap)=>{
        if (!dmList) return;
        dmList.innerHTML = "";
        snap.forEach(d=>{
          const m = d.data();
          if (m.threadId !== currentThreadId) return;
          renderMsg(dmList, m);
        });
        scrollBottom(dmList);
      });

      toast("DM", "Діалог відкрито", "ok", 1400);
    }

    if (dmOpen){
      dmOpen.onclick = ()=>{
        const uidFromSelect = dmUserSelect?.value || "";
        const uidFromInput = (dmUidInput?.value || "").trim();
        openDm(uidFromInput || uidFromSelect);
      };
    }

    async function sendDm(){
      if (!requireAuth("account.html")) return;
      if (!currentThreadId) return toast("DM", "Спочатку відкрий діалог", "danger");

      const text = (dmInput?.value || "").trim().slice(0,500);
      if (!text) return;

      const [a,b] = currentThreadId.split("__");
      try{
        await addDoc(collection(db,"dm_messages"), {
          threadId: currentThreadId,
          from: u.uid,
          to: (u.uid === a ? b : a),
          name: u.displayName || u.email || "Player",
          text,
          createdAt: serverTimestamp()
        });
        if (dmInput) dmInput.value = "";
      }catch(e){
        toast("DM", "Не вдалося надіслати", "danger");
      }
    }

    if (dmSend) dmSend.onclick = sendDm;
    if (dmInput){
      dmInput.addEventListener("keydown",(e)=>{
        if (e.key === "Enter" && !e.shiftKey){
          e.preventDefault();
          sendDm();
        }
      });
    }
  });
}
