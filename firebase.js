import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyDqvImySFSGTUMWDkWFDYVrzvLZTulWmJg",
  authDomain: "discordwebsitebase.firebaseapp.com",
  projectId: "discordwebsitebase",
  storageBucket: "discordwebsitebase.firebasestorage.app",
  messagingSenderId: "717030253541",
  appId: "1:717030253541:web:6dcfc566cfff4dc61b450c",
  measurementId: "G-S7KL9BGQCY"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
