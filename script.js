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
function setupCalculator() {
	let expr = '';
	let opsCount = { '+':0, '-':0, '*':0, '/':0 };
	let sessionStart = Date.now();
	
	calcDisplay.value = '';
	
	// Clear button
	const clearBtn = document.getElementById('calc-clear');
	clearBtn.addEventListener('click', () => {
		expr = '';
		calcDisplay.value = '';
	});
	
	// Bind calculator buttons
	const calcBtns = document.querySelectorAll('#calc-panel .calc-btn');
	calcBtns.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.stopPropagation();
			const v = btn.dataset.val;
			const op = btn.dataset.op;
			
			if(v) {
				expr += v;
				calcDisplay.value = expr;
			} else if(op) {
				opsCount[op] = (opsCount[op] || 0) + 1;
				expr += op;
				calcDisplay.value = expr;
			}
		});
	});

	// Equals button
	calcEq.addEventListener('click', () => {
		try {
			const res = eval(expr);
			calcDisplay.value = res;
			expr = String(res);
		} catch {
			calcDisplay.value = 'Error';
			expr = '';
		}
	});

	exitCalcBtn.addEventListener('click', () => {
		const secs = Math.floor((Date.now() - sessionStart) / 1000);
		boards.calc = boards.calc || {};
		const p = boards.calc[player] = boards.calc[player] || {time:0, ops:{'+':0,'-':0,'*':0,'/':0}};
		p.time += secs;
		Object.keys(opsCount).forEach(k => {
			p.ops[k] = (p.ops[k] || 0) + (opsCount[k] || 0);
		});
		saveBoards();
		renderLeaderboards();
		hide(calcPanel);
		openLobby();
	});
}

// --- Paint ---
function setupPaint() {
	const ctx = paintCanvas.getContext('2d');
	let tool = 'pencil';
	let toolCounts = {pencil:0, eraser:0, fill:0};
	let sessionStart = Date.now();
	let drawing = false;
	
	// Clear canvas and initialize
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
	ctx.strokeStyle = colorPicker.value;
	ctx.fillStyle = colorPicker.value;
	
	// Get canvas rect for proper offset calculation
	const rect = paintCanvas.getBoundingClientRect();
	
	// Remove old listeners - create new paint panel to avoid duplicates
	const oldPanel = paintPanel;
	const newPanel = oldPanel.cloneNode(true);
	oldPanel.parentNode.replaceChild(newPanel, oldPanel);
	
	// Re-assign new references after clone
	const newCanvas = document.getElementById('paint-canvas');
	const newCtx = newCanvas.getContext('2d');
	newCtx.fillStyle = '#fff';
	newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
	
	const newPencilBtn = newPanel.querySelector('[data-tool="pencil"]');
	const newEraserBtn = newPanel.querySelector('[data-tool="eraser"]');
	const newFillBtn = newPanel.querySelector('[data-tool="fill"]');
	const newColorPicker = newPanel.querySelector('#color-picker');
	const newExitBtn = newPanel.querySelector('#exit-paint-btn');
	
	// Tool selection
	newPencilBtn.addEventListener('click', () => { tool='pencil'; toolCounts.pencil++; newPencilBtn.classList.add('active'); newEraserBtn.classList.remove('active'); newFillBtn.classList.remove('active'); });
	newEraserBtn.addEventListener('click', () => { tool='eraser'; toolCounts.eraser++; newEraserBtn.classList.add('active'); newPencilBtn.classList.remove('active'); newFillBtn.classList.remove('active'); });
	newFillBtn.addEventListener('click', () => { tool='fill'; toolCounts.fill++; newFillBtn.classList.add('active'); newPencilBtn.classList.remove('active'); newEraserBtn.classList.remove('active'); });

	// Color picker
	newColorPicker.addEventListener('change', (e) => {
		newCtx.strokeStyle = e.target.value;
		newCtx.fillStyle = e.target.value;
	});

	// Canvas drawing with proper offset
	newCanvas.addEventListener('mousedown', (e) => {
		drawing = true;
		const rect = newCanvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		newCtx.beginPath();
		newCtx.moveTo(x, y);
		
		if(tool === 'fill') {
			newCtx.fillStyle = newColorPicker.value;
			newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
		} else {
			newCtx.lineWidth = tool === 'eraser' ? 20 : 3;
			newCtx.lineCap = 'round';
			newCtx.lineJoin = 'round';
			newCtx.strokeStyle = tool === 'eraser' ? '#fff' : newColorPicker.value;
		}
	});

	newCanvas.addEventListener('mousemove', (e) => {
		if(!drawing || tool === 'fill') return;
		const rect = newCanvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		newCtx.lineTo(x, y);
		newCtx.stroke();
	});

	newCanvas.addEventListener('mouseup', () => {
		drawing = false;
	});

	newCanvas.addEventListener('mouseleave', () => {
		drawing = false;
	});

	newExitBtn.addEventListener('click', () => {
		const secs = Math.floor((Date.now() - sessionStart) / 1000);
		boards.paint = boards.paint || {};
		const p = boards.paint[player] = boards.paint[player] || {time:0, tools:{pencil:0,eraser:0,fill:0}};
		p.time += secs;
		p.tools.pencil = (p.tools.pencil || 0) + (toolCounts.pencil || 0);
		p.tools.eraser = (p.tools.eraser || 0) + (toolCounts.eraser || 0);
		p.tools.fill = (p.tools.fill || 0) + (toolCounts.fill || 0);
		saveBoards();
		renderLeaderboards();
		hide(paintPanel);
		openLobby();
	});
}

// Game selection
calcBtn.addEventListener('click', () => {
	hide(lobbyPanel);
	hide(boardPanel);
	show(calcPanel);
	setupCalculator();
});

paintBtn.addEventListener('click', () => {
	hide(lobbyPanel);
	hide(boardPanel);
	show(paintPanel);
	setupPaint();
});
