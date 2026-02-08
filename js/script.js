import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth, onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile, signOut
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, updateDoc,
  collection, addDoc, getDocs,
  serverTimestamp, query, where, orderBy, limit, onSnapshot
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

/* ================= CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDqvImySFSGTUMWDkWFDYVrzvLZTulWmJg",
  authDomain: "discordwebsitebase.firebaseapp.com",
  projectId: "discordwebsitebase",
  storageBucket: "discordwebsitebase.firebasestorage.app",
  messagingSenderId: "717030253541",
  appId: "1:717030253541:web:6dcfc566cfff4dc61b450c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const $ = id => document.getElementById(id);

let user = null;

/* ================= AUTH ================= */
onAuthStateChanged(auth, async u => {
  user = u;
  if (u) {
    await setDoc(doc(db,"users",u.uid),{
      uid:u.uid,
      name:u.displayName || u.email,
      chessElo:1000,
      updatedAt:serverTimestamp()
    },{merge:true});
    loadBadges();
  }
  updateUI();
});

function updateUI(){
  if ($("auth-status")) {
    $("auth-status").textContent = user
      ? "Logged as " + (user.displayName||user.email)
      : "Not logged in";
  }
  if ($("logout-btn")) $("logout-btn").disabled = !user;
  if ($("auth-open")) $("auth-open").style.display = user?"none":"";
}

document.addEventListener("click", async e=>{
  if (e.target.id==="submit-auth"){
    const email=$("email-input").value;
    const pass=$("pass-input").value;
    try{
      await signInWithEmailAndPassword(auth,email,pass);
    }catch{
      const c=await createUserWithEmailAndPassword(auth,email,pass);
      await updateProfile(c.user,{displayName:$("nick-input").value});
    }
  }
  if (e.target.id==="logout-btn") await signOut(auth);
});

/* ================= ELO SAVE ================= */
async function saveElo(value){
  if(!user) return;
  await updateDoc(doc(db,"users",user.uid),{
    chessElo:value,
    updatedAt:serverTimestamp()
  });
}

/* ================= FEEDBACK (1/day) ================= */
async function sendFeedback(text){
  if(!user) return alert("Login first");

  const q = query(
    collection(db,"feedback"),
    where("uid","==",user.uid),
    where("createdAt",">", new Date(Date.now()-86400000))
  );
  const snap = await getDocs(q);
  if(!snap.empty) return alert("Only once per day");

  await addDoc(collection(db,"feedback"),{
    uid:user.uid,
    text,
    createdAt:serverTimestamp()
  });
}

/* ================= BADGES ================= */
async function loadBadges(){
  if(!user || !$("badges")) return;
  const snap = await getDocs(
    collection(db,"user_badges",user.uid,"items")
  );
  $("badges").innerHTML="";
  snap.forEach(d=>{
    const b=d.data();
    $("badges").innerHTML+=`
      <div class="badge" style="border-color:${b.color}">
        <div>${b.icon}</div>
        <b>${b.title}</b>
      </div>`;
  });
}

/* ================= CHAT ================= */
function initChat(){
  if(!$("chat-list")) return;
  const q=query(collection(db,"chat"),orderBy("createdAt"),limit(100));
  onSnapshot(q,s=>{
    $("chat-list").innerHTML="";
    s.forEach(d=>{
      const m=d.data();
      $("chat-list").innerHTML+=`<div>${m.name}: ${m.text}</div>`;
    });
  });
}
initChat();
