import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let ua = true;
const T = {
	ua: {
		status: "??????",
		online: "? ??????",
		time: "???",
		quote: "??????",
		q: "?????. ????????. ??????.",
		about: "??? ????",
		a: "???????? ? ??????? ?? ????????????? ????????.<br>???????? ???????? ?? ??????????????? ??-???????."
	},
	en: {
		status: "Status",
		online: "Online",
		time: "Time",
		quote: "Quote",
		q: "Focus. Improve. Repeat.",
		about: "About me",
		a: "College student in computer engineering.<br>PC repair and maintenance."
	}
};
const hs = document.getElementById("h-status");
const ts = document.getElementById("t-status");
const ht = document.getElementById("h-time");
const hq = document.getElementById("h-quote");
const tq = document.getElementById("t-quote");
const ha = document.getElementById("h-about");
const ta = document.getElementById("t-about");
const b = document.getElementById("lang");
const tm = document.getElementById("time");

function apply() {
	const l = ua ? T.ua : T.en;
	hs.textContent = l.status;
	ts.textContent = l.online;
	ht.textContent = l.time;
	hq.textContent = l.quote;
	tq.textContent = l.q;
	ha.textContent = l.about;
	ta.innerHTML = l.a;
	b.textContent = ua ? "EN" : "UA";
}
apply();

b.onclick = () => {
	ua = !ua;
	apply();
};

window.setInterval(() => {
	const d = new Date();
	tm.textContent = d.toLocaleTimeString() + " ? " + d.toLocaleDateString();
}, 1000);

// Firebase config
const firebaseConfig = {
	apiKey: "AIzaSyDqvImySFSGTUMWDkWFDYVrzvLZTulWmJg",
	authDomain: "discordwebsitebase.firebaseapp.com",
	projectId: "discordwebsitebase",
	storageBucket: "discordwebsitebase.firebasestorage.app",
	messagingSenderId: "717030253541",
	appId: "1:717030253541:web:6dcfc566cfff4dc61b450c",
	measurementId: "G-S7KL9BGQCY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Game Logic ---
const gameModal = document.getElementById('game-modal');
const playBtn = document.getElementById('play-btn');
const regPanel = document.getElementById('reg-panel');
const lobbyPanel = document.getElementById('lobby-panel');
const calcPanel = document.getElementById('calc-panel');
const paintPanel = document.getElementById('paint-panel');
const boardPanel = document.getElementById('board-panel');

const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');
const nickInput = document.getElementById('nick-input');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const closeBtn = document.getElementById('close-btn');
const backBtn = document.getElementById('back-btn');
const calcBtn = document.getElementById('calc-btn');
const paintBtn = document.getElementById('paint-btn');
const exitCalcBtn = document.getElementById('exit-calc-btn');
const exitPaintBtn = document.getElementById('exit-paint-btn');
const playerName = document.getElementById('player-name');

const calcDisplay = document.getElementById('calc-display');
const calcEq = document.getElementById('calc-eq');
const paintCanvas = document.getElementById('paint-canvas');
const colorPicker = document.getElementById('color-picker');
const brushSize = document.getElementById('brush-size');
const brushAlpha = document.getElementById('brush-alpha');
const paintClearBtn = document.getElementById('paint-clear');
const pencilBtn = document.getElementById('pencil-btn');
const eraserBtn = document.getElementById('eraser-btn');
const fillBtn = document.getElementById('fill-btn');
const leaderboardContent = document.getElementById('leaderboard-content');

let currentUser = null;

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function openLobby() {
	hide(regPanel);
	playerName.textContent = currentUser?.displayName || currentUser?.email || 'Player';
	show(lobbyPanel);
	renderLeaderboards();
	show(boardPanel);
}

playBtn.addEventListener('click', () => {
	show(gameModal);
	if (currentUser) {
		openLobby();
	} else {
		show(regPanel);
		hide(lobbyPanel);
		hide(calcPanel);
		hide(paintPanel);
		hide(boardPanel);
	}
});

closeBtn.addEventListener('click', () => {
	hide(gameModal);
	emailInput.value = '';
	passInput.value = '';
	nickInput.value = '';
});

backBtn.addEventListener('click', () => {
	hide(lobbyPanel);
	hide(calcPanel);
	hide(paintPanel);
	hide(boardPanel);
	show(regPanel);
});

onAuthStateChanged(auth, (user) => {
	currentUser = user || null;
	if (currentUser) {
		openLobby();
	}
});

async function signup() {
	const email = emailInput.value.trim();
	const pass = passInput.value.trim();
	const nick = nickInput.value.trim();
	if (!email || !pass) return alert('????? email ? ??????');
	try {
		const cred = await createUserWithEmailAndPassword(auth, email, pass);
		if (nick) {
			await updateProfile(cred.user, { displayName: nick });
		}
		currentUser = cred.user;
		openLobby();
	} catch (e) {
		console.error(e);
		alert('??????? ??????????');
	}
}

async function login() {
	const email = emailInput.value.trim();
	const pass = passInput.value.trim();
	if (!email || !pass) return alert('????? email ? ??????');
	try {
		const cred = await signInWithEmailAndPassword(auth, email, pass);
		currentUser = cred.user;
		openLobby();
	} catch (e) {
		console.error(e);
		alert('??????? ?????');
	}
}

signupBtn.addEventListener('click', signup);
loginBtn.addEventListener('click', login);

function normalizeEntries(map) {
	const out = [];
	Object.entries(map || {}).forEach(([key, val]) => {
		if (!val) return;
		if (typeof val.totalTime !== 'number') return;
		out.push({
			key,
			name: val.name || key,
			totalTime: val.totalTime || 0,
			calcTime: val.calcTime || 0,
			paintTime: val.paintTime || 0,
			ops: val.ops || {},
			tools: val.tools || {}
		});
	});
	return out;
}

async function fetchLeaders(field) {
	const q = query(collection(db, 'leaderboards'), orderBy(field, 'desc'), limit(20));
	const snap = await getDocs(q);
	const data = {};
	snap.forEach(docSnap => {
		data[docSnap.id] = docSnap.data();
	});
	return normalizeEntries(data);
}

async function renderLeaderboards() {
	leaderboardContent.innerHTML = '';
	try {
		const overall = await fetchLeaders('totalTime');
		const calc = await fetchLeaders('calcTime');
		const paint = await fetchLeaders('paintTime');

		function renderSection(title, rows, formatter) {
			const div = document.createElement('div');
			div.className = 'board-section';
			div.innerHTML = `<strong>${title}</strong>`;
			if (rows.length) {
				const ol = document.createElement('ol');
				rows.forEach(row => {
					const li = document.createElement('li');
					li.textContent = formatter(row);
					ol.appendChild(li);
				});
				div.appendChild(ol);
			} else {
				const p = document.createElement('p');
				p.textContent = '????????';
				div.appendChild(p);
			}
			leaderboardContent.appendChild(div);
		}

		renderSection('??? ?????????', overall, (row) => `${row.name} ? ${Math.round(row.totalTime / 60)}m`);
		renderSection('??? Calculator', calc, (row) => {
			const ops = row.ops || {};
			return `${row.name} ? ${Math.round(row.calcTime / 60)}m | +:${ops['+']||0} -:${ops['-']||0} ?:${ops['*']||0} ?:${ops['/']||0}`;
		});
		renderSection('??? Paint', paint, (row) => {
			const tools = row.tools || {};
			return `${row.name} ? ${Math.round(row.paintTime / 60)}m | pencil:${tools.pencil||0} eraser:${tools.eraser||0} fill:${tools.fill||0}`;
		});
	} catch (e) {
		console.error(e);
		leaderboardContent.innerHTML = '<p>?? ??????? ??????????? ???????.</p>';
	}
}

async function updateLeaderboard(update) {
	if (!currentUser) return;
	const ref = doc(db, 'leaderboards', currentUser.uid);
	const snap = await getDoc(ref);
	const existing = snap.exists() ? snap.data() : {};
	const name = currentUser.displayName || currentUser.email || 'Player';
	const next = {
		name,
		totalTime: (existing.totalTime || 0) + (update.totalTime || 0),
		calcTime: (existing.calcTime || 0) + (update.calcTime || 0),
		paintTime: (existing.paintTime || 0) + (update.paintTime || 0),
		ops: {
			...(existing.ops || {}),
			...(update.ops || {})
		},
		tools: {
			...(existing.tools || {}),
			...(update.tools || {})
		},
		updatedAt: serverTimestamp()
	};
	await setDoc(ref, next, { merge: true });
}

// --- Calculator ---
let calcState = null;

function startCalcSession() {
	calcState = {
		expr: '',
		opsCount: { '+':0, '-':0, '*':0, '/':0 },
		sessionStart: Date.now()
	};
	calcDisplay.value = '';
}

async function endCalcSession() {
	if (!calcState) return;
	const secs = Math.floor((Date.now() - calcState.sessionStart) / 1000);
	await updateLeaderboard({
		totalTime: secs,
		calcTime: secs,
		ops: calcState.opsCount
	});
	await renderLeaderboards();
	calcState = null;
}

function updateCalcDisplay() {
	calcDisplay.value = calcState.expr || '0';
}

function appendValue(v) {
	if (!calcState) return;
	if (calcState.expr.length > 32) return;
	const last = calcState.expr.split(/[-+*/]/).pop();
	if (v === '.' && last.includes('.')) return;
	calcState.expr += v;
	updateCalcDisplay();
}

function appendOp(op) {
	if (!calcState) return;
	if (!calcState.expr && op === '-') {
		calcState.expr = '-';
		updateCalcDisplay();
		return;
	}
	if (!calcState.expr) return;
	if (/[+\-*/]$/.test(calcState.expr)) {
		calcState.expr = calcState.expr.slice(0, -1) + op;
	} else {
		calcState.expr += op;
	}
	calcState.opsCount[op] = (calcState.opsCount[op] || 0) + 1;
	updateCalcDisplay();
}

calcDisplay.addEventListener('keydown', (e) => e.preventDefault());

document.getElementById('calc-clear').addEventListener('click', () => {
	if (!calcState) return;
	calcState.expr = '';
	updateCalcDisplay();
});

document.querySelectorAll('#calc-panel .calc-btn').forEach(btn => {
	btn.addEventListener('click', (e) => {
		if (!calcState) return;
		e.stopPropagation();
		const v = btn.dataset.val;
		const op = btn.dataset.op;
		if (v) appendValue(v);
		if (op) appendOp(op);
	});
});

calcEq.addEventListener('click', () => {
	if (!calcState) return;
	try {
		let expr = calcState.expr.replace(/[+\-*/]+$/, '');
		if (!expr) return;
		const res = eval(expr);
		calcState.expr = String(res);
		updateCalcDisplay();
	} catch {
		calcDisplay.value = 'Error';
		calcState.expr = '';
	}
});

exitCalcBtn.addEventListener('click', async () => {
	await endCalcSession();
	hide(calcPanel);
	openLobby();
});

// --- Paint ---
let paintState = null;
let drawing = false;

function setActiveTool(tool) {
	pencilBtn.classList.toggle('active', tool === 'pencil');
	eraserBtn.classList.toggle('active', tool === 'eraser');
	fillBtn.classList.toggle('active', tool === 'fill');
}

function resizeCanvas() {
	const rect = paintCanvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	paintCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
	paintCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
}

function startPaintSession() {
	const ctx = paintCanvas.getContext('2d');
	paintState = {
		tool: 'pencil',
		toolCounts: {pencil:0, eraser:0, fill:0},
		sessionStart: Date.now(),
		ctx
	};
	resizeCanvas();
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
	ctx.strokeStyle = colorPicker.value;
	ctx.fillStyle = colorPicker.value;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';
	setActiveTool('pencil');
}

async function endPaintSession() {
	if (!paintState) return;
	const secs = Math.floor((Date.now() - paintState.sessionStart) / 1000);
	await updateLeaderboard({
		totalTime: secs,
		paintTime: secs,
		tools: paintState.toolCounts
	});
	await renderLeaderboards();
	paintState = null;
}

pencilBtn.addEventListener('click', () => {
	if (!paintState) return;
	paintState.tool = 'pencil';
	paintState.toolCounts.pencil++;
	setActiveTool('pencil');
});

eraserBtn.addEventListener('click', () => {
	if (!paintState) return;
	paintState.tool = 'eraser';
	paintState.toolCounts.eraser++;
	setActiveTool('eraser');
});

fillBtn.addEventListener('click', () => {
	if (!paintState) return;
	paintState.tool = 'fill';
	paintState.toolCounts.fill++;
	setActiveTool('fill');
});

paintClearBtn.addEventListener('click', () => {
	if (!paintState) return;
	paintState.ctx.save();
	paintState.ctx.globalAlpha = 1;
	paintState.ctx.fillStyle = '#fff';
	paintState.ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
	paintState.ctx.restore();
});

colorPicker.addEventListener('change', (e) => {
	if (!paintState) return;
	paintState.ctx.strokeStyle = e.target.value;
	paintState.ctx.fillStyle = e.target.value;
});

function getCanvasPoint(e) {
	const rect = paintCanvas.getBoundingClientRect();
	const scaleX = paintCanvas.width / rect.width;
	const scaleY = paintCanvas.height / rect.height;
	return {
		x: (e.clientX - rect.left) * scaleX,
		y: (e.clientY - rect.top) * scaleY
	};
}

function paintStart(e) {
	if (!paintState) return;
	drawing = true;
	paintCanvas.setPointerCapture(e.pointerId);
	const rect = paintCanvas.getBoundingClientRect();
	const scale = paintCanvas.width / rect.width;
	const { x, y } = getCanvasPoint(e);
	paintState.ctx.beginPath();
	paintState.ctx.moveTo(x, y);
	if (paintState.tool === 'fill') {
		paintState.ctx.save();
		paintState.ctx.globalAlpha = Number(brushAlpha.value);
		paintState.ctx.fillStyle = colorPicker.value;
		paintState.ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
		paintState.ctx.restore();
	} else {
		const baseSize = paintState.tool === 'eraser' ? 20 : Number(brushSize.value);
		paintState.ctx.lineWidth = baseSize * scale;
		paintState.ctx.globalAlpha = paintState.tool === 'eraser' ? 1 : Number(brushAlpha.value);
		paintState.ctx.strokeStyle = paintState.tool === 'eraser' ? '#fff' : colorPicker.value;
	}
}

function paintMove(e) {
	if (!paintState || !drawing || paintState.tool === 'fill') return;
	const { x, y } = getCanvasPoint(e);
	paintState.ctx.lineTo(x, y);
	paintState.ctx.stroke();
}

function paintEnd() {
	drawing = false;
}

paintCanvas.addEventListener('pointerdown', paintStart);
paintCanvas.addEventListener('pointermove', paintMove);
paintCanvas.addEventListener('pointerup', paintEnd);
paintCanvas.addEventListener('pointerleave', paintEnd);

window.addEventListener('resize', () => {
	if (paintState) resizeCanvas();
});

exitPaintBtn.addEventListener('click', async () => {
	await endPaintSession();
	hide(paintPanel);
	openLobby();
});

// Game selection
calcBtn.addEventListener('click', () => {
	hide(lobbyPanel);
	hide(boardPanel);
	show(calcPanel);
	startCalcSession();
});

paintBtn.addEventListener('click', () => {
	hide(lobbyPanel);
	hide(boardPanel);
	show(paintPanel);
	startPaintSession();
});
