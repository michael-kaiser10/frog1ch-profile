let ua=true
const T={
ua:{status:"Статус",online:"У мережі",time:"Час",quote:"Цитата",q:"Фокус. Розвиток. Повтор.",about:"Про мене",a:"Навчаюсь у коледжі на комп'ютерного інженера.<br>Займаюсь ремонтом та обслуговуванням ПК-техніки."},
en:{status:"Status",online:"Online",time:"Time",quote:"Quote",q:"Focus. Improve. Repeat.",about:"About me",a:"College student in computer engineering.<br>PC repair and maintenance."}
}
const hs=document.getElementById("h-status"),ts=document.getElementById("t-status"),ht=document.getElementById("h-time"),hq=document.getElementById("h-quote"),tq=document.getElementById("t-quote"),ha=document.getElementById("h-about"),ta=document.getElementById("t-about"),b=document.getElementById("lang"),tm=document.getElementById("time")
function apply(){const l=ua?T.ua:T.en;hs.textContent=l.status;ts.textContent=l.online;ht.textContent=l.time;hq.textContent=l.quote;tq.textContent=l.q;ha.textContent=l.about;ta.innerHTML=l.a;b.textContent=ua?"EN":"UA"}
apply()
b.onclick=()=>{ua=!ua;apply()}
window.setInterval(()=>{const d=new Date();tm.textContent=d.toLocaleTimeString()+" • "+d.toLocaleDateString()},1000)

// --- Game Logic ---
const gameModal = document.getElementById('game-modal');
const playBtn = document.getElementById('play-btn');
const regPanel = document.getElementById('reg-panel');
const lobbyPanel = document.getElementById('lobby-panel');
const calcPanel = document.getElementById('calc-panel');
const paintPanel = document.getElementById('paint-panel');
const boardPanel = document.getElementById('board-panel');

const nickInput = document.getElementById('nick-input');
const playerName = document.getElementById('player-name');
const regBtn = document.getElementById('reg-btn');
const closeBtn = document.getElementById('close-btn');
const backBtn = document.getElementById('back-btn');
const calcBtn = document.getElementById('calc-btn');
const paintBtn = document.getElementById('paint-btn');
const exitCalcBtn = document.getElementById('exit-calc-btn');
const exitPaintBtn = document.getElementById('exit-paint-btn');

const calcDisplay = document.getElementById('calc-display');
const calcEq = document.getElementById('calc-eq');
const paintCanvas = document.getElementById('paint-canvas');
const colorPicker = document.getElementById('color-picker');
const pencilBtn = document.getElementById('pencil-btn');
const eraserBtn = document.getElementById('eraser-btn');
const fillBtn = document.getElementById('fill-btn');
const leaderboardContent = document.getElementById('leaderboard-content');

let player = localStorage.getItem('game_nick') || '';
let boards = JSON.parse(localStorage.getItem('game_leaderboards_v1') || '{}');

function show(el) { el.classList.remove('hidden'); }
function hide(el) { el.classList.add('hidden'); }

function saveBoards() {
	localStorage.setItem('game_leaderboards_v1', JSON.stringify(boards));
}

function renderLeaderboards() {
	leaderboardContent.innerHTML = '';
	
	const calc = Object.entries(boards.calc||{}).sort((a,b)=>b[1].time - a[1].time);
	const paint = Object.entries(boards.paint||{}).sort((a,b)=>b[1].time - a[1].time);

	const calcDiv = document.createElement('div');
	calcDiv.className = 'board-section';
	calcDiv.innerHTML = '<strong>📱 Calculator</strong>';
	if(calc.length) {
		const ol = document.createElement('ol');
		calc.forEach(d => {
			const ops = d[1].ops || {};
			const hours = Math.round(d[1].time/3600);
			const li = document.createElement('li');
			li.textContent = `${d[0]} — ${hours}h | +:${ops['+']||0} -:${ops['-']||0} ×:${ops['*']||0} ÷:${ops['/']||0}`;
			ol.appendChild(li);
		});
		calcDiv.appendChild(ol);
	} else {
		const p = document.createElement('p');
		p.textContent = 'Порожньо';
		calcDiv.appendChild(p);
	}
	leaderboardContent.appendChild(calcDiv);

	const paintDiv = document.createElement('div');
	paintDiv.className = 'board-section';
	paintDiv.innerHTML = '<strong>🎨 Paint</strong>';
	if(paint.length) {
		const ol = document.createElement('ol');
		paint.forEach(d => {
			const tools = d[1].tools || {};
			const hours = Math.round(d[1].time/3600);
			const li = document.createElement('li');
			li.textContent = `${d[0]} — ${hours}h | pencil:${tools.pencil||0} eraser:${tools.eraser||0} fill:${tools.fill||0}`;
			ol.appendChild(li);
		});
		paintDiv.appendChild(ol);
	} else {
		const p = document.createElement('p');
		p.textContent = 'Порожньо';
		paintDiv.appendChild(p);
	}
	leaderboardContent.appendChild(paintDiv);
}

function openLobby() {
	hide(regPanel);
	playerName.textContent = player;
	show(lobbyPanel);
	renderLeaderboards();
	show(boardPanel);
}

// Play button — open modal
playBtn.addEventListener('click', () => {
	console.log('Play button clicked');
	show(gameModal);
	if(player) {
		openLobby();
	} else {
		show(regPanel);
		hide(lobbyPanel);
		hide(calcPanel);
		hide(paintPanel);
		hide(boardPanel);
	}
});

// Registration
regBtn.addEventListener('click', () => {
	const nick = nickInput.value.trim();
	if(!nick) return alert('Введи нік');
	player = nick;
	localStorage.setItem('game_nick', player);
	openLobby();
});

// Close modal
closeBtn.addEventListener('click', () => {
	hide(gameModal);
	nickInput.value = '';
});

// Back to registration
backBtn.addEventListener('click', () => {
	hide(lobbyPanel);
	hide(calcPanel);
	hide(paintPanel);
	hide(boardPanel);
	show(regPanel);
});

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
	if(!calcState) return;
	const secs = Math.floor((Date.now() - calcState.sessionStart) / 1000);
	boards.calc = boards.calc || {};
	const p = boards.calc[player] = boards.calc[player] || {time:0, ops:{'+':0,'-':0,'*':0,'/':0}};
	p.time += secs;
	Object.keys(calcState.opsCount).forEach(k => {
		p.ops[k] = (p.ops[k] || 0) + (calcState.opsCount[k] || 0);
	});
	saveBoards();
	renderLeaderboards();
	calcState = null;
}

// Bind calculator buttons once
document.getElementById('calc-clear').addEventListener('click', () => {
	if(!calcState) return;
	calcState.expr = '';
	calcDisplay.value = '';
});

document.querySelectorAll('#calc-panel .calc-btn').forEach(btn => {
	btn.addEventListener('click', (e) => {
		if(!calcState) return;
		e.stopPropagation();
		const v = btn.dataset.val;
		const op = btn.dataset.op;
		if(v) {
			calcState.expr += v;
			calcDisplay.value = calcState.expr;
		} else if(op) {
			calcState.opsCount[op] = (calcState.opsCount[op] || 0) + 1;
			calcState.expr += op;
			calcDisplay.value = calcState.expr;
		}
	});
});

calcEq.addEventListener('click', () => {
	if(!calcState) return;
	try {
		const res = eval(calcState.expr);
		calcDisplay.value = res;
		calcState.expr = String(res);
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

function startPaintSession() {
	const ctx = paintCanvas.getContext('2d');
	paintState = {
		tool: 'pencil',
		toolCounts: {pencil:0, eraser:0, fill:0},
		sessionStart: Date.now(),
		ctx
	};
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
	ctx.strokeStyle = colorPicker.value;
	ctx.fillStyle = colorPicker.value;
	setActiveTool('pencil');
}

function endPaintSession() {
	if(!paintState) return;
	const secs = Math.floor((Date.now() - paintState.sessionStart) / 1000);
	boards.paint = boards.paint || {};
	const p = boards.paint[player] = boards.paint[player] || {time:0, tools:{pencil:0,eraser:0,fill:0}};
	p.time += secs;
	p.tools.pencil = (p.tools.pencil || 0) + (paintState.toolCounts.pencil || 0);
	p.tools.eraser = (p.tools.eraser || 0) + (paintState.toolCounts.eraser || 0);
	p.tools.fill = (p.tools.fill || 0) + (paintState.toolCounts.fill || 0);
	saveBoards();
	renderLeaderboards();
	paintState = null;
}

// Tool selection
pencilBtn.addEventListener('click', () => {
	if(!paintState) return;
	paintState.tool = 'pencil';
	paintState.toolCounts.pencil++;
	setActiveTool('pencil');
});

eraserBtn.addEventListener('click', () => {
	if(!paintState) return;
	paintState.tool = 'eraser';
	paintState.toolCounts.eraser++;
	setActiveTool('eraser');
});

fillBtn.addEventListener('click', () => {
	if(!paintState) return;
	paintState.tool = 'fill';
	paintState.toolCounts.fill++;
	setActiveTool('fill');
});

// Color picker
colorPicker.addEventListener('change', (e) => {
	if(!paintState) return;
	paintState.ctx.strokeStyle = e.target.value;
	paintState.ctx.fillStyle = e.target.value;
});

// Canvas drawing
paintCanvas.addEventListener('mousedown', (e) => {
	if(!paintState) return;
	drawing = true;
	const rect = paintCanvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	paintState.ctx.beginPath();
	paintState.ctx.moveTo(x, y);
	if(paintState.tool === 'fill') {
		paintState.ctx.fillStyle = colorPicker.value;
		paintState.ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
	} else {
		paintState.ctx.lineWidth = paintState.tool === 'eraser' ? 20 : 3;
		paintState.ctx.lineCap = 'round';
		paintState.ctx.lineJoin = 'round';
		paintState.ctx.strokeStyle = paintState.tool === 'eraser' ? '#fff' : colorPicker.value;
	}
});

paintCanvas.addEventListener('mousemove', (e) => {
	if(!paintState || !drawing || paintState.tool === 'fill') return;
	const rect = paintCanvas.getBoundingClientRect();
	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;
	paintState.ctx.lineTo(x, y);
	paintState.ctx.stroke();
});

paintCanvas.addEventListener('mouseup', () => { drawing = false; });
paintCanvas.addEventListener('mouseleave', () => { drawing = false; });

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
