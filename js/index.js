const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

const TG_TOKEN = "PASTE_BOT_TOKEN";
const TG_CHAT = "PASTE_YOUR_CHAT_ID";

exports.feedbackToTelegram = functions.firestore
  .document("feedback/{id}")
  .onCreate(async (snap) => {
    const d = snap.data();
    const msg = `📩 Feedback\nUID: ${d.uid}\n\n${d.text}`;

    await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        chat_id:TG_CHAT,
        text:msg
      })
    });
  });
