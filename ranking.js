import { db } from "./firebase.js";
import { qs, toast } from "./ui.js";
import {
  collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

function fmtTime(sec){
  const s = Number(sec || 0);
  if (!Number.isFinite(s) || s <= 0) return "0s";
  if (s < 60) return `${Math.round(s)}s`;
  const m = Math.floor(s/60);
  const h = Math.floor(m/60);
  const mm = m % 60;
  if (h > 0) return `${h}h ${mm}m`;
  return `${m}m`;
}

async function loadTop(field){
  const snap = await getDocs(query(collection(db,"leaderboards"), orderBy(field,"desc"), limit(20)));
  const rows = [];
  snap.forEach(d=>{
    const x = d.data();
    rows.push({
      uid: d.id,
      name: x.name || "Player",
      totalTime: x.totalTime || 0,
      chessElo: x.chessElo || 1000
    });
  });
  return rows;
}

function renderTable(target, title, rows, mapper){
  const wrap = document.createElement("div");
  wrap.className = "card";
  wrap.innerHTML = `<div class="card-top">
    <div class="card-title">${title}</div>
    <div class="muted">Top 20</div>
  </div>`;

  const table = document.createElement("table");
  table.className = "table";
  table.innerHTML = `<thead><tr>
    <th>#</th><th>Player</th><th>Value</th>
  </tr></thead>`;
  const tb = document.createElement("tbody");

  rows.forEach((r, i)=>{
    const tr = document.createElement("tr");
    tr.className = "click";
    tr.innerHTML = `<td>${i+1}</td><td>${escapeHtml(r.name)}</td><td>${escapeHtml(mapper(r))}</td>`;
    tr.onclick = ()=> location.href = `profile.html?uid=${encodeURIComponent(r.uid)}`;
    tb.appendChild(tr);
  });

  table.appendChild(tb);
  wrap.appendChild(table);
  target.appendChild(wrap);
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

export async function initRanking(){
  const host = qs("leaderboard-content");
  if (!host) return;

  host.innerHTML = `<p class="muted">Loading…</p>`;
  try{
    const overall = await loadTop("totalTime");
    const chess = await loadTop("chessElo");
    host.innerHTML = "";
    renderTable(host, "TOP Overall Time", overall, r=> fmtTime(r.totalTime));
    renderTable(host, "TOP Chess ELO", chess, r=> String(r.chessElo));
    toast("Ranking", "Оновлено", "ok", 1600);
  }catch(e){
    host.innerHTML = `<p class="muted">Не вдалося завантажити рейтинг.</p>`;
  }
}
