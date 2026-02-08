import { db } from "./firebase.js";
import { currentUser } from "./auth.js";
import {
  collection, addDoc, serverTimestamp, updateDoc, doc, getDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const cards = [
  "2","3","4","5","6","7","8","9","10","J","Q","K","A"
];

function drawCard() {
  return cards[Math.floor(Math.random() * cards.length)];
}

function cardValue(c) {
  return cards.indexOf(c);
}

export function startCardGame(container) {
  container.innerHTML = `
    <h3>🃏 High Card</h3>
    <p>Higher card wins.</p>
    <button id="draw-card">Draw</button>
    <div id="result"></div>
  `;

  document.getElementById("draw-card").onclick = async () => {
    const userCard = drawCard();
    const botCard = drawCard();

    let resultText = `You: ${userCard} | Bot: ${botCard}<br>`;
    let win = false;

    if (cardValue(userCard) > cardValue(botCard)) {
      resultText += "✅ You WIN!";
      win = true;
    } else if (cardValue(userCard) < cardValue(botCard)) {
      resultText += "❌ You LOSE!";
    } else {
      resultText += "➖ Draw";
    }

    document.getElementById("result").innerHTML = resultText;

    // save match
    await addDoc(collection(db, "card_matches"), {
      uid: currentUser.uid,
      win,
      createdAt: serverTimestamp()
    });

    // update stats
    const ref = doc(db, "users", currentUser.uid);
    const snap = await getDoc(ref);
    const data = snap.data();

    const wins = (data.cardWins || 0) + (win ? 1 : 0);
    const games = (data.cardGames || 0) + 1;

    await updateDoc(ref, {
      cardWins: wins,
      cardGames: games
    });
  };
}
