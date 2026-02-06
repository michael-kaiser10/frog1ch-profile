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

// --- Game Logic ---
const gameModal = document.getElementById('game-modal');
const playBtn = document.getElementById('play-btn');
const regPanel = document.getElementById('reg-panel');
const lobbyPanel = document.getElementById('lobby-panel');
const calcPanel = document.getElementById('calc-panel');
const paintPanel = document.getElementById('paint-panel');
const boardPanel = document.getElementById('board-panel');

const nickInput = document.getElementById('nick-input');
const passInput = document.getElementById('pass-input');
const playerName = document.getElementById('player-name');
const regBtn = document.getElementById('reg-btn');
const closeBtn = document.getElementById('close-btn');
const backBtn = document.getElementById('back-btn');
const calcBtn = document.getElementById('calc-btn');
const paintBtn = document.getElementById('paint-btn');
const exitCalcBtn = document.getElementById('exit-calc-btn');
const exitPaintBtn = document.getElementById('exit-paint-btn');
const discordLoginBtn = document.getElementById('discord-login');

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

// Optional: backend OAuth config (not available on GitHub Pages without server)
const DISCORD_CLIENT_ID = '';
const DISCORD_OAUTH_PROXY = '';
const DISCORD_REDIRECT_URI = window.location.origin + window.location.pathname;

let discordUser = JSON.parse(localStorage.getItem('discord_user') || 'null');
let player = localStorage.getItem('game_nick') || '';
let boards = JSON.parse(localStorage.getItem('game_leaderboards_v2') || '{}');
let users = JSON.parse(localStorage.getItem('game_users_v1') || '{}');

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function saveBoards() {
	localStorage.setItem('game_leaderboards_v2', JSON.stringify(boards));
}

function saveUsers() {
	localStorage.setItem('game_users_v1', JSON.stringify(users));
}

function setDiscordUser(user) {
	discordUser = user;
	localStorage.setItem('discord_user', JSON.stringify(user));
	player = user.username;
	localStorage.setItem('game_nick', player);
	updateAuthUI();
}

function updateAuthUI() {
	if (discordUser) {
		nickInput.value = discordUser.username;
		nickInput.disabled = true;
		passInput.disabled = true;
		discordLoginBtn.textContent = 'Discord Connected';
		discordLoginBtn.disabled = true;
	} else {
		nickInput.disabled = false;
		passInput.disabled = false;
		discordLoginBtn.textContent = 'Discord Login';
		discordLoginBtn.disabled = false;
	}
}
updateAuthUI();

async function handleDiscordCallback() {
	const url = new URL(window.location.href);
	const code = url.searchParams.get('code');
	if (!code || !DISCORD_OAUTH_PROXY) return;
	try {
		const res = await fetch(`${DISCORD_OAUTH_PROXY}/discord/exchange`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ code, redirectUri: DISCORD_REDIRECT_URI })
		});
		if (!res.ok) throw new Error('OAuth failed');
		const data = await res.json();
		if (data && data.user) setDiscordUser(data.user);
	} catch (e) {
		console.error(e);
		alert('Discord login error.');
	} finally {
		url.searchParams.delete('code');
		window.history.replaceState({}, document.title, url.toString());
	}
}
handleDiscordCallback();

function startDiscordLogin() {
	if (!DISCORD_CLIENT_ID || !DISCORD_OAUTH_PROXY) {
		alert('Discord OAuth ???????? ??????. ????? DISCORD_CLIENT_ID ?? DISCORD_OAUTH_PROXY ? script.js');
		return;
	}
	const params = new URLSearchParams({
		client_id: DISCORD_CLIENT_ID,
		redirect_uri: DISCORD_REDIRECT_URI,
		response_type: 'code',
		scope: 'identify'
	});
	window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

discordLoginBtn.addEventListener('click', startDiscordLogin);

async function hashPassword(value) {
	if (window.crypto && window.crypto.subtle) {
		const enc = new TextEncoder().encode(value);
		const digest = await window.crypto.subtle.digest('SHA-256', enc);
		return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
	}
	return btoa(unescape(encodeURIComponent(value)));
}

function normalizeEntries(map) {
	const out = [];
	Object.entries(map || {}).forEach(([key, val]) => {
		if (!val) return;
		if (typeof val.time !== 'number') return;
		out.push({
			key,
			name: val.name || key,
			time: val.time || 0,
			ops: val.ops || {},
			tools: val.tools || {}
		});
	});
	return out;
}

function renderLeaderboards() {
	leaderboardContent.innerHTML = '';
	const calc = normalizeEntries(boards.calc).sort((a, b) => b.time - a.time);
	const paint = normalizeEntries(boards.paint).sort((a, b) => b.time - a.time);

	const topAll = {};
	calc.forEach(row => {
		topAll[row.key] = { name: row.name, time: (topAll[row.key]?.time || 0) + row.time };
	});
	paint.forEach(row => {
		topAll[row.key] = { name: row.name, time: (topAll[row.key]?.time || 0) + row.time };
	});
	const overall = Object.entries(topAll).map(([key, v]) => ({ key, name: v.name, time: v.time }));
	overall.sort((a, b) => b.time - a.time);

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

	renderSection('??? ?????????', overall, (row) => `${row.name} ? ${Math.round(row.time / 60)}m`);
	renderSection('??? Calculator', calc, (row) => {
		const ops = row.ops || {};
		return `${row.name} ? ${Math.round(row.time / 60)}m | +:${ops['+']||0} -:${ops['-']||0} ?:${ops['*']||0} ?:${ops['/']||0}`;
	});
	renderSection('??? Paint', paint, (row) => {
		const tools = row.tools || {};
		return `${row.name} ? ${Math.round(row.time / 60)}m | pencil:${tools.pencil||0} eraser:${tools.eraser||0} fill:${tools.fill||0}`;
	});
}

function openLobby() {
	hide(regPanel);
	playerName.textContent = player;
	show(lobbyPanel);
	renderLeaderboards();
	show(boardPanel);
}

playBtn.addEventListener('click', () => {
	show(gameModal);
	if (player) {
		openLobby();
	} else {
		show(regPanel);
		hide(lobbyPanel);
		hide(calcPanel);
		hide(paintPanel);
		hide(boardPanel);
	}
});

regBtn.addEventListener('click', async () => {
	if (discordUser) {
		player = discordUser.username;
		openLobby();
		return;
	}
	const nick = nickInput.value.trim();
	const pass = passInput.value.trim();
	if (!nick || !pass) return alert('????? ??? ? ??????');
	const passHash = await hashPassword(pass);
	if (users[nick]) {
		if (users[nick].passHash !== passHash) {
			return alert('???????? ??????');
		}
	} else {
		users[nick] = { name: nick, passHash };
		saveUsers();
	}
	player = nick;
	localStorage.setItem('game_nick', player);
	openLobby();
});

closeBtn.addEventListener('click', () => {
	hide(gameModal);
	nickInput.value = '';
	passInput.value = '';
});

backBtn.addEventListener('click', () => {
	hide(lobbyPanel);
	hide(calcPanel);
	hide(paintPanel);
	hide(boardPanel);
	show(regPanel);
});

function getPlayerKey() {
	return discordUser?.id || player;
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

function endCalcSession() {
	if (!calcState) return;
	const secs = Math.floor((Date.now() - calcState.sessionStart) / 1000);
	boards.calc = boards.calc || {};
	const key = getPlayerKey();
	const name = discordUser?.username || player;
	const p = boards.calc[key] = boards.calc[key] || { name, time:0, ops:{'+':0,'-':0,'*':0,'/':0} };
	p.name = name;
	p.time += secs;
	Object.keys(calcState.opsCount).forEach(k => {
		p.ops[k] = (p.ops[k] || 0) + (calcState.opsCount[k] || 0);
	});
	saveBoards();
	renderLeaderboards();
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

exitCalcBtn.addEventListener('click', () => {
	endCalcSession();
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

function endPaintSession() {
	if (!paintState) return;
	const secs = Math.floor((Date.now() - paintState.sessionStart) / 1000);
	boards.paint = boards.paint || {};
	const key = getPlayerKey();
	const name = discordUser?.username || player;
	const p = boards.paint[key] = boards.paint[key] || { name, time:0, tools:{pencil:0,eraser:0,fill:0} };
	p.name = name;
	p.time += secs;
	p.tools.pencil = (p.tools.pencil || 0) + (paintState.toolCounts.pencil || 0);
	p.tools.eraser = (p.tools.eraser || 0) + (paintState.toolCounts.eraser || 0);
	p.tools.fill = (p.tools.fill || 0) + (paintState.toolCounts.fill || 0);
	saveBoards();
	renderLeaderboards();
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

exitPaintBtn.addEventListener('click', () => {
	endPaintSession();
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
