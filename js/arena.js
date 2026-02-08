import { currentUser } from "./auth.js";
import { startCardGame } from "./cards.js";

const content = document.getElementById("arena-content");

document.getElementById("open-chess").onclick = () => {
  content.innerHTML = "<p>♟ Chess will be upgraded later.</p>";
};

document.getElementById("open-cards").onclick = () => {
  if (!currentUser) {
    alert("Login required");
    return;
  }
  startCardGame(content);
};
