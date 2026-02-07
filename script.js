import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, serverTimestamp, collection, query, orderBy, limit, getDocs, addDoc, onSnapshot, updateDoc, where, deleteDoc } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

let ua = true;
const T = {
	ua: {
		status: "\u0421\u0442\u0430\u0442\u0443\u0441",
		online: "\u0423 \u043c\u0435\u0440\u0435\u0436\u0456",
		time: "\u0427\u0430\u0441",
		quote: "\u0426\u0438\u0442\u0430\u0442\u0430",
		q: "\u0424\u043e\u043a\u0443\u0441. \u0420\u043e\u0437\u0432\u0438\u0442\u043e\u043a. \u041f\u043e\u0432\u0442\u043e\u0440.",
		about: "\u041f\u0440\u043e \u043c\u0435\u043d\u0435",
		a: "\u041d\u0430\u0432\u0447\u0430\u044e\u0441\u044c \u0443 \u043a\u043e\u043b\u0435\u0434\u0436\u0456 \u043d\u0430 \u043a\u043e\u043c\u043f\u2019\u044e\u0442\u0435\u0440\u043d\u043e\u0433\u043e \u0456\u043d\u0436\u0435\u043d\u0435\u0440\u0430.<br>\u0417\u0430\u0439\u043c\u0430\u044e\u0441\u044c \u0440\u0435\u043c\u043e\u043d\u0442\u043e\u043c \u0442\u0430 \u043e\u0431\u0441\u043b\u0443\u0433\u043e\u0432\u0443\u0432\u0430\u043d\u043d\u044f\u043c \u041f\u041a-\u0442\u0435\u0445\u043d\u0456\u043a\u0438."
	},
	en: {
		status: "Status",
		online: "Online",
		time: "Time",
		quote: "Quote",
		q: "Focus. Improve. Repeat.",
		about: "About",
		a: "College student in computer engineering.<br>PC repair and maintenance."
	}
};
const ts = document.getElementById("t-status");
const tq = document.getElementById("t-quote");
const ta = document.getElementById("t-about");
const b = document.getElementById("lang");
const tm = document.getElementById("time");
const aboutLabel = document.getElementById("h-about");

function apply() {
	const l = ua ? T.ua : T.en;
	ts.textContent = l.online;
	tq.textContent = l.q;
	if (ta) ta.innerHTML = l.a;
	if (aboutLabel) aboutLabel.textContent = l.about;
	b.textContent = ua ? "EN" : "UA";
}
apply();

b.onclick = () => {
	ua = !ua;
	apply();
};

window.setInterval(() => {
	const d = new Date();
	tm.textContent = d.toLocaleTimeString() + " \u2022 " + d.toLocaleDateString();
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

const playBtn = document.getElementById('play-btn');
const gameModal = document.getElementById('game-modal');
const closeModal = document.getElementById('close-modal');
const gameTitle = document.getElementById('game-title');

const emailInput = document.getElementById('email-input');
const passInput = document.getElementById('pass-input');
const passConfirm = document.getElementById('pass-confirm');
const nickInput = document.getElementById('nick-input');
const submitAuth = document.getElementById('submit-auth');
const toggleAuth = document.getElementById('toggle-auth');
const logoutBtn = document.getElementById('logout-btn');
const authStatus = document.getElementById('auth-status');
const authMsg = document.getElementById('auth-msg');
const authModal = document.getElementById('auth-modal');
const authOpen = document.getElementById('auth-open');
const authClose = document.getElementById('auth-close');
const profileOpen = document.getElementById('profile-open');
const profileClose = document.getElementById('profile-close');
const profileModal = document.getElementById('profile-modal');
const profileName = document.getElementById('profile-name');
const profileMeta = document.getElementById('profile-meta');
const profileTotal = document.getElementById('profile-total');
const profileElo = document.getElementById('profile-elo');
const profileBadges = document.getElementById('profile-badges');
const playerCards = document.getElementById('player-cards');
const userBadges = document.getElementById('user-badges');
const adminPanel = document.getElementById('admin-panel');
const badgeList = document.getElementById('badge-list');
const badgeName = document.getElementById('badge-name');
const badgeIcon = document.getElementById('badge-icon');
const badgeColor = document.getElementById('badge-color');
const badgeDesc = document.getElementById('badge-desc');
const badgeCreate = document.getElementById('badge-create');
const assignUid = document.getElementById('assign-uid');
const assignBadge = document.getElementById('assign-badge');
const assignBadgeBtn = document.getElementById('assign-badge-btn');
const calcBtn = document.getElementById('calc-btn');
const paintBtn = document.getElementById('paint-btn');
const exitCalcBtn = document.getElementById('exit-calc-btn');
const exitPaintBtn = document.getElementById('exit-paint-btn');

const calcPanel = document.getElementById('calc-panel');
const paintPanel = document.getElementById('paint-panel');

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
const chatList = document.getElementById('chat-list');
const chatInput = document.getElementById('chat-message');
const chatSend = document.getElementById('chat-send');
const chatImageInput = document.getElementById('chat-image');
const chatPreview = document.getElementById('chat-preview');
const chatPreviewImg = document.getElementById('chat-preview-img');
const chatCancel = document.getElementById('chat-cancel');
const chatEmojiBtn = document.getElementById('chat-emoji-btn');
const chatEmojiPanel = document.getElementById('chat-emoji-panel');
let pendingImageData = null;

// Chess
const chessBtn = document.getElementById('chess-btn');
const chessBtn2 = document.getElementById('chess-btn-2');
const chessPanel = document.getElementById('chess-panel');
const chessMode = document.getElementById('chess-mode');
const chessStart = document.getElementById('chess-start');
const chessDraw = document.getElementById('chess-draw');
const chessResign = document.getElementById('chess-resign');
const chessStatus = document.getElementById('chess-status');
const chessTimer = document.getElementById('chess-timer');
const chessBoardEl = document.getElementById('chess-board');
const onlineList = document.getElementById('online-list');
const inviteList = document.getElementById('invite-list');
const exitChessBtn = document.getElementById('exit-chess-btn');
const dropBtn = document.getElementById('drop-btn');
const dropText = document.getElementById('drop-text');

let currentUser = null;
const ADMIN_UIDS = ['GTWT222m9NRixYoFZBPJ6IfSN3j1'];
const isAdmin = () => !!currentUser && ADMIN_UIDS.includes(currentUser.uid);
let authMode = 'signup';

function show(el) { if (el) el.classList.remove('hidden'); }
function hide(el) { if (el) el.classList.add('hidden'); }

function openModal(title, panel) {
	gameTitle.textContent = title;
	show(gameModal);
	hide(calcPanel);
	hide(paintPanel);
	if (chessPanel) hide(chessPanel);
	show(panel);
	if (panel === calcPanel) startCalcSession();
	if (panel === paintPanel) startPaintSession();
	if (panel === chessPanel) {
		setChessStatus('Loading chess...');
		ensureChess().then((ok) => {
			if (!ok) setChessStatus('Chess failed to load');
			else setChessStatus('Idle');
		});
	}
}

function closeGameModal() {
	hide(gameModal);
	calcState = null;
	paintState = null;
}

if (playBtn) {
	playBtn.addEventListener('click', () => {
		if (chessPanel) openModal('Chess', chessPanel);
	});
}
closeModal.addEventListener('click', closeGameModal);

if (calcBtn) calcBtn.addEventListener('click', () => openModal('Calculator', calcPanel));
if (paintBtn) paintBtn.addEventListener('click', () => openModal('Paint', paintPanel));
if (chessBtn) chessBtn.addEventListener('click', () => openModal('Chess', chessPanel));
if (chessBtn2) chessBtn2.addEventListener('click', () => openModal('Chess', chessPanel));

onAuthStateChanged(auth, (user) => {
	currentUser = user || null;
	updateAuthUI();
	setChatState();
	cleanupChatIfNeeded();
	renderLeaderboards();
	renderUserBadges();
	renderBadgeAdmin();
	if (currentUser) resumeActiveGame();
});

if (profileOpen) profileOpen.addEventListener('click', () => {
	openProfile(currentUser && currentUser.uid);
});
if (profileClose && profileModal) profileClose.addEventListener('click', () => profileModal.classList.add('hidden'));

function setAuthMessage(text, isError = false) {
	if (!authMsg) return;
	authMsg.textContent = text || '';
	authMsg.style.color = isError ? '#f87171' : 'var(--muted)';
}

function updateAuthUI() {
	const loggedIn = !!currentUser;
	if (authStatus) {
		authStatus.textContent = loggedIn
			? `Logged in as ${currentUser.displayName || currentUser.email}`
			: 'Not logged in.';
	}
	if (logoutBtn) logoutBtn.disabled = !loggedIn;
	if (passConfirm) passConfirm.style.display = authMode === 'signup' ? '' : 'none';
	if (nickInput) nickInput.style.display = authMode === 'signup' ? '' : 'none';
	if (submitAuth) submitAuth.textContent = authMode === 'signup' ? 'Sign up' : 'Log in';
	if (toggleAuth) toggleAuth.textContent = authMode === 'signup' ? 'Switch to Login' : 'Switch to Sign up';
	if (authOpen) authOpen.style.display = loggedIn ? 'none' : '';
	if (authClose) authClose.style.display = loggedIn ? '' : 'none';
	if (authModal) {
		if (loggedIn) authModal.classList.add('hidden');
		else authModal.classList.remove('hidden');
	}
	if (adminPanel) adminPanel.classList.toggle('hidden', !isAdmin());
}
updateAuthUI();

function validateEmail(email) {
	return /^[^@]+@[^@]+\.[^@]+$/.test(email);
}

function getAuthErrorMessage(code) {
	switch (code) {
		case 'auth/invalid-email': return 'Invalid email format.';
		case 'auth/user-not-found': return 'User not found.';
		case 'auth/wrong-password': return 'Wrong password.';
		case 'auth/email-already-in-use': return 'Email already in use.';
		case 'auth/weak-password': return 'Password too weak (min 6).';
		default: return 'Auth error. Try again.';
	}
}

async function signup() {
	const email = emailInput.value.trim();
	const pass = passInput.value.trim();
	const nick = nickInput.value.trim();
	const confirm = passConfirm ? passConfirm.value.trim() : '';
	if (!validateEmail(email)) return setAuthMessage('Enter a valid email.', true);
	if (pass.length < 6) return setAuthMessage('Password must be at least 6 chars.', true);
	if (passConfirm && pass !== confirm) return setAuthMessage('Passwords do not match.', true);
	try {
		const cred = await createUserWithEmailAndPassword(auth, email, pass);
		if (nick) await updateProfile(cred.user, { displayName: nick });
		currentUser = cred.user;
		setAuthMessage('Account created.', false);
		renderLeaderboards();
	} catch (e) {
		console.error(e);
		setAuthMessage(getAuthErrorMessage(e.code), true);
	}
}

async function login() {
	const email = emailInput.value.trim();
	const pass = passInput.value.trim();
	if (!validateEmail(email)) return setAuthMessage('Enter a valid email.', true);
	if (!pass) return setAuthMessage('Enter your password.', true);
	try {
		const cred = await signInWithEmailAndPassword(auth, email, pass);
		currentUser = cred.user;
		setAuthMessage('Logged in.', false);
		renderLeaderboards();
	} catch (e) {
		console.error(e);
		setAuthMessage(getAuthErrorMessage(e.code), true);
	}
}

async function logout() {
	await auth.signOut();
	currentUser = null;
	setAuthMessage('Logged out.', false);
	updateAuthUI();
}

if (submitAuth) {
	submitAuth.addEventListener('click', () => {
		setAuthMessage('');
		if (authMode === 'signup') signup();
		else login();
	});
}
if (toggleAuth) {
	toggleAuth.addEventListener('click', () => {
		authMode = authMode === 'signup' ? 'login' : 'signup';
		setAuthMessage('');
		updateAuthUI();
	});
}
if (authOpen && authModal) {
	authOpen.addEventListener('click', () => authModal.classList.remove('hidden'));
}
// Auth is required: disable manual closing when not logged in
if (authClose && authModal) {
	authClose.addEventListener('click', () => {
		if (currentUser) authModal.classList.add('hidden');
	});
}
if (logoutBtn) logoutBtn.addEventListener('click', logout);

function normalizeEntries(map) {
	const out = [];
	Object.entries(map || {}).forEach(([key, val]) => {
		if (!val) return;
		const hasAny =
			typeof val.totalTime === 'number' ||
			typeof val.calcTime === 'number' ||
			typeof val.paintTime === 'number' ||
			typeof val.chessElo === 'number';
		if (!hasAny) return;
		out.push({
			key,
			name: val.name || key,
			totalTime: val.totalTime || 0,
			calcTime: val.calcTime || 0,
			paintTime: val.paintTime || 0,
			chessElo: val.chessElo || 1000,
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
		data[docSnap.id] = { id: docSnap.id, ...docSnap.data() };
	});
	return normalizeEntries(data);
}

async function renderLeaderboards() {
	if (!leaderboardContent) return;
	leaderboardContent.innerHTML = '';
	try {
		const formatSeconds = (sec) => {
			const s = Number(sec || 0);
			if (!Number.isFinite(s) || s <= 0) return '0s';
			if (s < 60) return `${Math.round(s)}s`;
			const m = Math.floor(s / 60);
			const h = Math.floor(m / 60);
			const mm = m % 60;
			if (h > 0) return `${h}h ${mm}m`;
			return `${m}m`;
		};

		const overall = await fetchLeaders('totalTime');
		const chess = await fetchLeaders('chessElo');

		function renderSection(title, rows, formatter) {
			const div = document.createElement('div');
			div.className = 'board-section';
			div.innerHTML = `<strong>${title}</strong>`;
			if (rows.length) {
				const ol = document.createElement('ol');
				rows.forEach(row => {
					const li = document.createElement('li');
					li.textContent = formatter(row);
					const uid = row.id || row.uid;
					if (uid) {
						li.style.cursor = 'pointer';
						li.addEventListener('click', () => openProfile(uid, row));
					}
					ol.appendChild(li);
				});
				div.appendChild(ol);
			} else {
				const p = document.createElement('p');
				p.textContent = '\u041f\u043e\u0440\u043e\u0436\u043d\u044c\u043e';
				div.appendChild(p);
			}
			leaderboardContent.appendChild(div);
		}

		renderSection('\u0422\u041e\u041f \u0417\u0430\u0433\u0430\u043b\u044c\u043d\u0438\u0439', overall, (row) => `${row.name} \u2014 ${formatSeconds(row.totalTime)}`);
		renderSection('TOP Chess ELO', chess, (row) => `${row.name} \u2014 ${row.chessElo}`);
		renderPlayerCards(overall, chess);
	} catch (e) {
		console.error(e);
		leaderboardContent.innerHTML = '<p>\u041d\u0435 \u0432\u0434\u0430\u043b\u043e\u0441\u044f \u0437\u0430\u0432\u0430\u043d\u0442\u0430\u0436\u0438\u0442\u0438 \u0440\u0435\u0439\u0442\u0438\u043d\u0433.</p>';
	}
}

async function updateLeaderboard(update) {
	if (!currentUser) return;
	const ref = doc(db, 'leaderboards', currentUser.uid);
	const snap = await getDoc(ref);
	const existing = snap.exists() ? snap.data() : {};
	const name = currentUser.displayName || currentUser.email || 'Player';
	const sumMap = (a = {}, b = {}) => {
		const out = { ...a };
		Object.keys(b || {}).forEach((k) => { out[k] = (out[k] || 0) + (b[k] || 0); });
		return out;
	};
	const next = {
		name,
		totalTime: (existing.totalTime || 0) + (update.totalTime || 0),
		calcTime: (existing.calcTime || 0) + (update.calcTime || 0),
		paintTime: (existing.paintTime || 0) + (update.paintTime || 0),
		ops: sumMap(existing.ops, update.ops),
		tools: sumMap(existing.tools, update.tools),
		updatedAt: serverTimestamp()
	};
	await setDoc(ref, next, { merge: true });
}

function renderPlayerCards(overall, chess) {
	if (!playerCards) return;
	playerCards.innerHTML = '';
	const byId = {};
	overall.forEach(row => { byId[row.id || row.uid || row.name] = row; });
	chess.forEach(row => { byId[row.id || row.uid || row.name] = { ...(byId[row.id || row.uid || row.name] || {}), ...row }; });
	const merged = Object.values(byId).slice(0, 6);
	if (!merged.length) {
		playerCards.innerHTML = '<p class="muted">No players yet.</p>';
		return;
	}
	merged.forEach((row) => {
		const card = document.createElement('div');
		card.className = 'player-card';
		const name = row.name || 'Player';
		const elo = row.chessElo || 1000;
		const total = row.totalTime || 0;
		card.innerHTML = `
			<h4>${name}</h4>
			<div class="player-meta">ELO: ${elo}</div>
			<div class="player-meta">Time: ${Math.round(total / 60)}m</div>
		`;
		card.addEventListener('click', () => openProfile(row.id || row.uid, row));
		playerCards.appendChild(card);
	});
}

async function loadBadges() {
	const snap = await getDocs(collection(db, 'badges'));
	const badges = [];
	snap.forEach(docSnap => badges.push({ id: docSnap.id, ...docSnap.data() }));
	return badges;
}

async function openProfile(uid, fallback = {}) {
	if (!profileModal) return;
	const userId = uid || (currentUser && currentUser.uid);
	if (!userId) return;
	profileModal.classList.remove('hidden');
	let data = fallback;
	try {
		const snap = await getDoc(doc(db, 'leaderboards', userId));
		if (snap.exists()) data = { id: userId, ...snap.data() };
	} catch {}
	if (profileName) profileName.textContent = data.name || 'Player';
	if (profileMeta) profileMeta.textContent = userId ? `UID: ${userId}` : '';
	if (profileTotal) profileTotal.textContent = `${Math.round((data.totalTime || 0) / 60)}m`;
	if (profileElo) profileElo.textContent = String(data.chessElo || 1000);
	await renderBadgesFor(userId, profileBadges);
}

async function renderBadgesFor(uid, container) {
	if (!container) return;
	container.innerHTML = '';
	const badgeSnap = await getDocs(query(collection(db, 'user_badges'), where('uid', '==', uid)));
	const badgeIds = [];
	badgeSnap.forEach(docSnap => badgeIds.push(docSnap.data().badgeId));
	if (!badgeIds.length) {
		container.innerHTML = '<span class="muted">No medals yet.</span>';
		return;
	}
	const allBadges = await loadBadges();
	const map = new Map(allBadges.map(b => [b.id, b]));
	badgeIds.forEach(id => {
		const b = map.get(id);
		if (!b) return;
		const el = document.createElement('div');
		el.className = 'badge';
		const color = b.color || '#f2c46d';
		el.innerHTML = `<span class="dot" style="background:${color}"></span>${b.icon || '🏅'} ${b.name || 'Medal'}`;
		container.appendChild(el);
	});
}

async function renderUserBadges() {
	if (!userBadges) return;
	userBadges.innerHTML = '';
	if (!currentUser) {
		userBadges.innerHTML = '<span class="muted">Login to see medals.</span>';
		return;
	}
	const badgeSnap = await getDocs(query(collection(db, 'user_badges'), where('uid', '==', currentUser.uid)));
	const badgeIds = [];
	badgeSnap.forEach(docSnap => badgeIds.push(docSnap.data().badgeId));
	if (!badgeIds.length) {
		userBadges.innerHTML = '<span class="muted">No medals yet.</span>';
		return;
	}
	const allBadges = await loadBadges();
	const map = new Map(allBadges.map(b => [b.id, b]));
	badgeIds.forEach(id => {
		const b = map.get(id);
		if (!b) return;
		const el = document.createElement('div');
		el.className = 'badge';
		const color = b.color || '#f2c46d';
		el.innerHTML = `<span class="dot" style="background:${color}"></span>${b.icon || '🏅'} ${b.name || 'Medal'}`;
		userBadges.appendChild(el);
	});
}

async function renderBadgeAdmin() {
	if (!adminPanel || !isAdmin()) return;
	const badges = await loadBadges();
	if (badgeList) {
		badgeList.innerHTML = '';
		badges.forEach(b => {
			const el = document.createElement('div');
			el.className = 'badge';
			const color = b.color || '#f2c46d';
			el.innerHTML = `<span class="dot" style="background:${color}"></span>${b.icon || '🏅'} ${b.name || 'Medal'}`;
			badgeList.appendChild(el);
		});
	}
	if (assignBadge) {
		assignBadge.innerHTML = '';
		badges.forEach(b => {
			const opt = document.createElement('option');
			opt.value = b.id;
			opt.textContent = `${b.icon || '🏅'} ${b.name || 'Medal'}`;
			assignBadge.appendChild(opt);
		});
	}
}

async function createBadge() {
	if (!isAdmin()) return;
	const name = (badgeName?.value || '').trim();
	if (!name) return;
	const icon = (badgeIcon?.value || '').trim() || '🏅';
	const color = (badgeColor?.value || '').trim() || '#f2c46d';
	const desc = (badgeDesc?.value || '').trim();
	await addDoc(collection(db, 'badges'), {
		name,
		icon,
		color,
		desc,
		createdAt: serverTimestamp(),
		createdBy: currentUser.uid
	});
	if (badgeName) badgeName.value = '';
	if (badgeIcon) badgeIcon.value = '';
	if (badgeColor) badgeColor.value = '';
	if (badgeDesc) badgeDesc.value = '';
	await renderBadgeAdmin();
}

async function assignBadgeToUser() {
	if (!isAdmin()) return;
	const uid = (assignUid?.value || '').trim();
	const badgeId = assignBadge?.value;
	if (!uid || !badgeId) return;
	const existing = await getDocs(query(collection(db, 'user_badges'), where('uid', '==', uid), where('badgeId', '==', badgeId)));
	if (!existing.empty) return;
	await addDoc(collection(db, 'user_badges'), {
		uid,
		badgeId,
		givenBy: currentUser.uid,
		createdAt: serverTimestamp()
	});
	if (assignUid) assignUid.value = '';
}

if (badgeCreate) badgeCreate.addEventListener('click', createBadge);
if (assignBadgeBtn) assignBadgeBtn.addEventListener('click', assignBadgeToUser);

// --- Chat ---
function setChatState() {
	const enabled = !!currentUser;
	chatInput.disabled = !enabled;
	chatSend.disabled = !enabled;
	if (chatImageInput) chatImageInput.disabled = !enabled;
	if (chatCancel) chatCancel.disabled = !enabled;
	chatInput.placeholder = enabled ? 'Type a message...' : 'Login to chat...';
}

function getDayKey(date = new Date()) {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, '0');
	const d = String(date.getDate()).padStart(2, '0');
	return `${y}-${m}-${d}`;
}

function renderChatItem(data) {
	const wrap = document.createElement('div');
	const isSelf = currentUser && data.uid && currentUser.uid === data.uid;
	wrap.className = isSelf ? 'chat-item self' : 'chat-item';
	const meta = document.createElement('div');
	meta.className = 'chat-meta';
	meta.textContent = `${data.name || 'Anon'} \u2022 ${data.time || ''}`;
	const bubble = document.createElement('div');
	bubble.className = 'chat-bubble';
	if (data.image) {
		const img = document.createElement('img');
		img.src = data.image;
		img.alt = 'chat image';
		bubble.appendChild(img);
	}
	if (data.text) {
		const text = document.createElement('div');
		text.className = 'chat-text';
		text.textContent = data.text || '';
		bubble.appendChild(text);
	}
	wrap.appendChild(bubble);
	wrap.appendChild(meta);
	return wrap;
}

async function cleanupChatIfNeeded() {
	if (!currentUser) return;
	const today = getDayKey();
	const lastCleanup = localStorage.getItem('chatCleanup') || '';
	if (lastCleanup === today) return;
	try {
		const oldQ = query(collection(db, 'chat'), where('dayKey', '<', today));
		const oldSnap = await getDocs(oldQ);
		const deletions = [];
		oldSnap.forEach(docSnap => deletions.push(deleteDoc(docSnap.ref)));
		await Promise.all(deletions);
		localStorage.setItem('chatCleanup', today);
	} catch (err) {
		console.warn('Chat cleanup failed:', err);
	}
}

function startChatListener() {
	const q = query(collection(db, 'chat'), orderBy('createdAt', 'desc'), limit(30));
	onSnapshot(q, (snap) => {
		chatList.innerHTML = '';
		const items = [];
		const today = getDayKey();
		snap.forEach(docSnap => {
			const data = docSnap.data();
			if (data.dayKey && data.dayKey !== today) return;
			if (!data.dayKey && data.createdAt && typeof data.createdAt.toDate === 'function') {
				const createdKey = getDayKey(data.createdAt.toDate());
				if (createdKey !== today) return;
			}
			items.push(data);
		});
		items.reverse().forEach(item => chatList.appendChild(renderChatItem(item)));
		chatList.scrollTop = chatList.scrollHeight;
	});
}
startChatListener();

async function sendChat() {
	if (!currentUser) return;
	const text = chatInput.value.trim();
	if (!text && !pendingImageData) return;
	const name = currentUser.displayName || currentUser.email || 'Player';
	const now = new Date();
	const time = now.toLocaleTimeString();
	await addDoc(collection(db, 'chat'), {
		uid: currentUser.uid,
		name,
		text,
		image: pendingImageData || null,
		time,
		dayKey: getDayKey(now),
		createdAt: serverTimestamp()
	});
	chatInput.value = '';
	pendingImageData = null;
	if (chatImageInput) chatImageInput.value = '';
	if (chatPreview) chatPreview.classList.add('hidden');
}

chatSend.addEventListener('click', sendChat);
chatInput.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') sendChat();
});

if (chatImageInput) {
	chatImageInput.addEventListener('change', () => {
		const file = chatImageInput.files && chatImageInput.files[0];
		if (!file) return;
		if (file.size > 200 * 1024) {
			alert('Image too large. Max 200KB.');
			chatImageInput.value = '';
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			pendingImageData = String(reader.result || '');
			if (chatPreviewImg) chatPreviewImg.src = pendingImageData;
			if (chatPreview) chatPreview.classList.remove('hidden');
		};
		reader.readAsDataURL(file);
	});
}

if (chatCancel) {
	chatCancel.addEventListener('click', () => {
		pendingImageData = null;
		if (chatImageInput) chatImageInput.value = '';
		if (chatPreview) chatPreview.classList.add('hidden');
	});
}

if (chatEmojiBtn && chatEmojiPanel) {
	const emojis = ['😀','😅','😂','🤣','😊','😍','😎','😤','😭','😱','🤯','🤔','😴','😡','👍','🔥','🎯','💯','✨','⚡','🎮','🕹️','🏆','🚀','💬','📌','📸','🧩','🛡️','🧠'];
	chatEmojiPanel.innerHTML = '';
	emojis.forEach(e => {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.textContent = e;
		btn.addEventListener('click', () => {
			const start = chatInput.selectionStart ?? chatInput.value.length;
			const end = chatInput.selectionEnd ?? chatInput.value.length;
			const value = chatInput.value;
			chatInput.value = value.slice(0, start) + e + value.slice(end);
			chatInput.focus();
			chatInput.selectionStart = chatInput.selectionEnd = start + e.length;
		});
		chatEmojiPanel.appendChild(btn);
	});
	chatEmojiBtn.addEventListener('click', () => {
		chatEmojiPanel.classList.toggle('hidden');
	});
}

if (dropBtn && dropText) {
	const drops = [
		'Win 3 games in a row today.',
		'Send a screenshot in chat.',
		'Beat the bot without losing a piece.',
		'Get 5 wins before midnight.',
		'Teach a new player a trick.',
		'Try a new game mode.',
		'Post your best score in chat.',
		'Find a rival and play a rematch.'
	];
	const setDrop = () => {
		const pick = drops[Math.floor(Math.random() * drops.length)];
		dropText.textContent = pick;
	};
	setDrop();
	dropBtn.addEventListener('click', setDrop);
}

// --- Presence (Firestore heartbeat) ---
let presenceTimer = null;
function startPresence() {
	if (!currentUser) return;
	const ref = doc(db, 'users', currentUser.uid);
	const update = async () => {
		await setDoc(ref, {
			uid: currentUser.uid,
			name: currentUser.displayName || currentUser.email || 'Player',
			lastSeenMs: Date.now()
		}, { merge: true });
	};
	update();
	if (presenceTimer) clearInterval(presenceTimer);
	presenceTimer = setInterval(update, 10000);
}
function stopPresence() {
	if (presenceTimer) clearInterval(presenceTimer);
	presenceTimer = null;
}
onAuthStateChanged(auth, (user) => {
	if (user) startPresence();
	else stopPresence();
});

// --- Chess ---
let ChessLib = null;
let chess = null;
const files = ['a','b','c','d','e','f','g','h'];
const pieceMap = {
	wp: '\u2659', wn: '\u2658', wb: '\u2657', wr: '\u2656', wq: '\u2655', wk: '\u2654',
	bp: '\u265F', bn: '\u265E', bb: '\u265D', br: '\u265C', bq: '\u265B', bk: '\u265A'
};

let chessSelected = null;
let chessLegal = [];
let chessGameId = null;
let chessGame = null;
let chessIsBot = false;
let chessBotLevel = 'random';
let myColor = 'w';
let chessDeadline = null;
let chessTimerInterval = null;
let invitesUnsub = null;
let sentInvitesUnsub = null;
let gameUnsub = null;
let usersUnsub = null;
let disconnectInterval = null;

function initChessBoard() {
	if (!chessBoardEl) return;
	chessBoardEl.innerHTML = '';
	for (let r = 8; r >= 1; r--) {
		for (let f = 0; f < 8; f++) {
			const sq = `${files[f]}${r}`;
			const div = document.createElement('div');
			const isLight = (r + f) % 2 === 0;
			div.className = `chess-square ${isLight ? 'light' : 'dark'}`;
			div.dataset.square = sq;
			div.addEventListener('click', () => onSquareClick(sq));
			chessBoardEl.appendChild(div);
		}
	}
}

async function ensureChess() {
	if (chess) return true;
	try {
		let mod = null;
		try {
			mod = await import('./chess.umd.js');
		} catch {
			mod = null;
		}
		if (!mod || !mod.Chess) throw new Error('chess.js load failed');
		ChessLib = mod.Chess;
		chess = new ChessLib();
		initChessBoard();
		renderChessBoard();
		return true;
	} catch (e) {
		console.error(e);
		setChessStatus('Chess failed to load');
		return false;
	}
}

function setChessStatus(text) {
	if (chessStatus) chessStatus.textContent = text;
}

function setChessTimer(seconds) {
	if (!chessTimer) return;
	const s = Math.max(0, Math.floor(seconds));
	chessTimer.textContent = `${s}s`;
}

function renderChessBoard() {
	if (!chess) return;
	if (!chessBoardEl) return;
	const board = chess.board();
	const squares = chessBoardEl.querySelectorAll('.chess-square');
	squares.forEach((el) => {
		el.textContent = '';
		el.classList.remove('selected', 'legal');
	});
	board.forEach((row, rIdx) => {
		row.forEach((piece, fIdx) => {
			const square = `${files[fIdx]}${8 - rIdx}`;
			const el = chessBoardEl.querySelector(`[data-square="${square}"]`);
			if (!el) return;
			if (piece) {
				const key = piece.color + piece.type;
				el.textContent = pieceMap[key] || '';
			}
		});
	});
	if (chessSelected) {
		const sel = chessBoardEl.querySelector(`[data-square="${chessSelected}"]`);
		if (sel) sel.classList.add('selected');
		chessLegal.forEach((m) => {
			const el = chessBoardEl.querySelector(`[data-square="${m}"]`);
			if (el) el.classList.add('legal');
		});
	}
}

function chessGameOver() {
	if (!chess) return false;
	return typeof chess.isGameOver === 'function' ? chess.isGameOver() : chess.game_over();
}

function chessCheckmate() {
	if (!chess) return false;
	return typeof chess.isCheckmate === 'function' ? chess.isCheckmate() : chess.in_checkmate();
}

function isMyTurn() {
	if (chessIsBot) return chess.turn() === myColor;
	if (!chessGame) return false;
	return chess.turn() === myColor;
}

function onSquareClick(square) {
	if (!chess) return;
	if (!isMyTurn()) return;
	if (!chessSelected) {
		const moves = chess.moves({ square, verbose: true });
		if (!moves.length) return;
		chessSelected = square;
		chessLegal = moves.map(m => m.to);
		renderChessBoard();
		return;
	}
	if (square === chessSelected) {
		chessSelected = null;
		chessLegal = [];
		renderChessBoard();
		return;
	}
	if (!chessLegal.includes(square)) {
		chessSelected = null;
		chessLegal = [];
		renderChessBoard();
		return;
	}
	makeMove(chessSelected, square);
	chessSelected = null;
	chessLegal = [];
	renderChessBoard();
}

async function makeMove(from, to) {
	if (!chess) return;
	const move = chess.move({ from, to, promotion: 'q' });
	if (!move) return;
	if (chessIsBot) {
		if (chessGameOver()) {
			await finishGameLocal();
			return;
		}
		chessDeadline = Date.now() + 60000;
		startTimerLoop();
		setTimeout(() => botMove(), 300);
		return;
	}
	if (chessGameId) {
		if (chessGameOver()) {
			const result = chessCheckmate()
				? (chess.turn() === 'w' ? 'black' : 'white')
				: 'draw';
			await updateDoc(doc(db, 'chess_games', chessGameId), {
				fen: chess.fen(),
				turn: chess.turn(),
				status: 'ended',
				result,
				reason: 'checkmate_or_draw'
			});
			return;
		}
		await updateDoc(doc(db, 'chess_games', chessGameId), {
			fen: chess.fen(),
			turn: chess.turn(),
			turnDeadline: Date.now() + 60000,
			lastMoveAtMs: Date.now()
		});
	}
}

function startTimerLoop() {
	if (chessTimerInterval) clearInterval(chessTimerInterval);
	chessTimerInterval = setInterval(() => {
		if (!chessDeadline) return;
		const remaining = Math.max(0, chessDeadline - Date.now());
		setChessTimer(remaining / 1000);
		if (remaining <= 0) handleTimeout();
	}, 500);
}

async function handleTimeout() {
	if (chessIsBot) {
		if (chess.turn() === myColor) {
			setChessStatus('Time out. Bot wins.');
			await updateChessElo(myColor === 'w' ? 'black' : 'white', true);
		}
		return;
	}
	if (!chessGame || chessGame.status !== 'active') return;
	const loser = chessGame.turn;
	const winner = loser === 'w' ? 'b' : 'w';
	await endGameOnline(winner, 'timeout');
}

function startBotGame(level) {
	if (!chess) return;
	chess.reset();
	chessIsBot = true;
	chessBotLevel = level;
	myColor = 'w';
	chessGameId = null;
	chessGame = null;
	setChessStatus(`Bot game: ${level}`);
	chessDeadline = Date.now() + 60000;
	startTimerLoop();
	renderChessBoard();
}

function botMove() {
	if (!chess) return;
	const moves = chess.moves({ verbose: true });
	if (!moves.length) return;
	let move;
	if (chessBotLevel === 'random') {
		move = moves[Math.floor(Math.random() * moves.length)];
	} else if (chessBotLevel === 'easy') {
		const captures = moves.filter(m => m.captured);
		move = (captures.length ? captures : moves)[Math.floor(Math.random() * (captures.length ? captures.length : moves.length))];
	} else {
		const depth = chessBotLevel === 'medium' ? 2 : 3;
		move = minimaxRoot(depth, chess, chess.turn() === 'w');
	}
	if (move) chess.move(move);
	if (chessGameOver()) {
		finishGameLocal();
		return;
	}
	chessDeadline = Date.now() + 60000;
	startTimerLoop();
	renderChessBoard();
}

function evaluateBoard(board) {
	const values = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
	let score = 0;
	for (const row of board) {
		for (const piece of row) {
			if (!piece) continue;
			const val = values[piece.type] || 0;
			score += piece.color === 'w' ? val : -val;
		}
	}
	return score;
}

function minimaxRoot(depth, game, isMaximisingPlayer) {
	let bestMove = null;
	let bestValue = -Infinity;
	const moves = game.moves({ verbose: true });
	for (const move of moves) {
		game.move(move);
		const value = minimax(depth - 1, game, -Infinity, Infinity, !isMaximisingPlayer);
		game.undo();
		if (value >= bestValue) {
			bestValue = value;
			bestMove = move;
		}
	}
	return bestMove;
}

function minimax(depth, game, alpha, beta, isMaximisingPlayer) {
	if (depth === 0) return evaluateBoard(game.board());
	const moves = game.moves({ verbose: true });
	if (isMaximisingPlayer) {
		let best = -Infinity;
		for (const move of moves) {
			game.move(move);
			best = Math.max(best, minimax(depth - 1, game, alpha, beta, false));
			game.undo();
			alpha = Math.max(alpha, best);
			if (beta <= alpha) break;
		}
		return best;
	}
	let best = Infinity;
	for (const move of moves) {
		game.move(move);
		best = Math.min(best, minimax(depth - 1, game, alpha, beta, true));
		game.undo();
		beta = Math.min(beta, best);
		if (beta <= alpha) break;
	}
	return best;
}

async function finishGameLocal() {
	if (!chess) return;
	const result = chessCheckmate() ? (chess.turn() === 'w' ? 'black' : 'white') : 'draw';
	setChessStatus(result === 'draw' ? 'Draw' : `${result} wins`);
	if (chessTimerInterval) clearInterval(chessTimerInterval);
	if (currentUser) await updateChessElo(result, true);
}

function resetOnlineUI() {
	if (onlineList) onlineList.innerHTML = '';
	if (inviteList) inviteList.innerHTML = '';
}

async function startOnlineLists() {
	if (!currentUser) return;
	if (usersUnsub) usersUnsub();
	const qUsers = query(collection(db, 'users'), orderBy('lastSeenMs', 'desc'), limit(30));
	usersUnsub = onSnapshot(qUsers, (snap) => {
		if (!onlineList) return;
		onlineList.innerHTML = '';
		const now = Date.now();
		snap.forEach(docSnap => {
			const data = docSnap.data();
			if (!data || !data.uid || data.uid === currentUser.uid) return;
			if (now - (data.lastSeenMs || 0) > 40000) return;
			const row = document.createElement('div');
			row.className = 'online-item';
			row.innerHTML = `<span>${data.name || data.uid}</span>`;
			const btn = document.createElement('button');
			btn.className = 'btn btn-ghost';
			btn.textContent = 'Invite';
			btn.addEventListener('click', () => sendInvite(data.uid, data.name));
			row.appendChild(btn);
			onlineList.appendChild(row);
		});
	});

	if (invitesUnsub) invitesUnsub();
	const qInv = query(collection(db, 'chess_invites'), where('toUid', '==', currentUser.uid), where('status', '==', 'pending'));
	invitesUnsub = onSnapshot(qInv, (snap) => {
		if (!inviteList) return;
		inviteList.innerHTML = '';
		snap.forEach(docSnap => {
			const data = docSnap.data();
			const row = document.createElement('div');
			row.className = 'invite-item';
			row.innerHTML = `<span>${data.fromName || 'Player'}</span>`;
			const accept = document.createElement('button');
			accept.className = 'btn btn-primary';
			accept.textContent = 'Accept';
			accept.addEventListener('click', () => acceptInvite(docSnap.id, data));
			const decline = document.createElement('button');
			decline.className = 'btn btn-ghost';
			decline.textContent = 'Decline';
			decline.addEventListener('click', () => updateDoc(doc(db, 'chess_invites', docSnap.id), { status: 'declined' }));
			row.appendChild(accept);
			row.appendChild(decline);
			inviteList.appendChild(row);
		});
	});

	if (sentInvitesUnsub) sentInvitesUnsub();
	const qSent = query(collection(db, 'chess_invites'), where('fromUid', '==', currentUser.uid), where('status', '==', 'accepted'));
	sentInvitesUnsub = onSnapshot(qSent, (snap) => {
		snap.forEach(docSnap => {
			const data = docSnap.data();
			if (data.gameId) listenToGame(data.gameId);
		});
	});
}

async function resumeActiveGame() {
	if (!currentUser) return;
	const qWhite = query(collection(db, 'chess_games'), where('whiteUid', '==', currentUser.uid), where('status', '==', 'active'));
	const qBlack = query(collection(db, 'chess_games'), where('blackUid', '==', currentUser.uid), where('status', '==', 'active'));
	const [sWhite, sBlack] = await Promise.all([getDocs(qWhite), getDocs(qBlack)]);
	const docSnap = sWhite.docs[0] || sBlack.docs[0];
	if (docSnap) await listenToGame(docSnap.id);
}

async function sendInvite(toUid, toName) {
	if (!currentUser) return;
	await addDoc(collection(db, 'chess_invites'), {
		fromUid: currentUser.uid,
		fromName: currentUser.displayName || currentUser.email || 'Player',
		toUid,
		toName: toName || '',
		status: 'pending',
		createdAt: serverTimestamp()
	});
}

async function acceptInvite(inviteId, data) {
	if (!(await ensureChess())) return;
	const gameDoc = await addDoc(collection(db, 'chess_games'), {
		whiteUid: data.toUid,
		blackUid: data.fromUid,
		whiteName: data.toName || 'Player',
		blackName: data.fromName || 'Player',
		fen: new Chess().fen(),
		turn: 'w',
		status: 'active',
		turnDeadline: Date.now() + 60000,
		lastMoveAtMs: Date.now(),
		drawOffer: null,
		disconnects: {}
	});
	await updateDoc(doc(db, 'chess_invites', inviteId), { status: 'accepted', gameId: gameDoc.id });
	listenToGame(gameDoc.id);
}

async function listenToGame(gameId) {
	if (!(await ensureChess())) return;
	if (gameUnsub) gameUnsub();
	chessGameId = gameId;
	gameUnsub = onSnapshot(doc(db, 'chess_games', gameId), (snap) => {
		if (!snap.exists()) return;
		chessGame = snap.data();
		myColor = chessGame.whiteUid === currentUser.uid ? 'w' : 'b';
		chessIsBot = false;
		chess.load(chessGame.fen);
		chessDeadline = chessGame.turnDeadline;
		if (chessGame.status === 'active') {
			const turnLabel = chessGame.turn === 'w' ? 'White' : 'Black';
			const drawNote = chessGame.drawOffer && chessGame.drawOffer !== currentUser.uid ? ' (Draw offered)' : '';
			setChessStatus(`${turnLabel} to move${drawNote}`);
		} else {
			if (chessGame.result === 'draw') setChessStatus('Draw');
			else if (chessGame.result === 'white') setChessStatus('White wins');
			else if (chessGame.result === 'black') setChessStatus('Black wins');
			else setChessStatus('Game ended');
		}
		startTimerLoop();
		renderChessBoard();
		if (disconnectInterval) clearInterval(disconnectInterval);
		disconnectInterval = setInterval(checkDisconnect, 5000);
		applyEloIfNeeded();
	});
}

async function endGameOnline(winner, reason) {
	if (!chessGameId || !chessGame || chessGame.status !== 'active') return;
	const result = winner === 'w' ? 'white' : winner === 'b' ? 'black' : 'draw';
	await updateDoc(doc(db, 'chess_games', chessGameId), {
		status: 'ended',
		result,
		reason
	});
}

function checkDisconnect() {
	if (!chessGame || chessGame.status !== 'active') return;
	if (!currentUser) return;
	const oppUid = chessGame.whiteUid === currentUser.uid ? chessGame.blackUid : chessGame.whiteUid;
	const opp = chessGame.whiteUid === currentUser.uid ? 'b' : 'w';
	const now = Date.now();
	const disconnects = chessGame.disconnects || {};
	const oppLastSeen = chessGame.oppLastSeenMs;
	const userDocId = oppUid;
	getDoc(doc(db, 'users', userDocId)).then((snap) => {
		const data = snap.data() || {};
		const last = data.lastSeenMs || 0;
		if (now - last > 30000) {
			if (!disconnects[oppUid]) {
				updateDoc(doc(db, 'chess_games', chessGameId), { [`disconnects.${oppUid}`]: now });
				return;
			}
			if (now - disconnects[oppUid] > 30000) {
				endGameOnline(myColor, 'forfeit');
			}
		} else if (disconnects[oppUid]) {
			updateDoc(doc(db, 'chess_games', chessGameId), { [`disconnects.${oppUid}`]: null });
		}
	}).catch(() => {});
}

async function updateChessElo(result, isBot = false) {
	if (!currentUser) return;
	const myRef = doc(db, 'leaderboards', currentUser.uid);
	const mySnap = await getDoc(myRef);
	const my = mySnap.exists() ? mySnap.data() : { chessElo: 1000 };
	let oppElo = 1000;
	let oppUid = null;
	let oppName = 'Player';
	let oppData = {};
	if (!isBot && chessGame) {
		oppUid = chessGame.whiteUid === currentUser.uid ? chessGame.blackUid : chessGame.whiteUid;
		oppName = chessGame.whiteUid === currentUser.uid ? chessGame.blackName : chessGame.whiteName;
		const oppSnap = await getDoc(doc(db, 'leaderboards', oppUid));
		if (oppSnap.exists()) {
			oppData = oppSnap.data();
			oppElo = oppData.chessElo || 1000;
		}
	}
	const myElo = my.chessElo || 1000;
	const score = result === 'draw' ? 0.5 : (result === (myColor === 'w' ? 'white' : 'black') ? 1 : 0);
	const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
	const k = 32;
	const newElo = Math.round(myElo + k * (score - expected));
	await setDoc(myRef, {
		name: currentUser.displayName || currentUser.email || 'Player',
		chessElo: newElo,
		chessWins: (my.chessWins || 0) + (score === 1 ? 1 : 0),
		chessLosses: (my.chessLosses || 0) + (score === 0 ? 1 : 0),
		chessDraws: (my.chessDraws || 0) + (score === 0.5 ? 1 : 0)
	}, { merge: true });

	if (!isBot && oppUid) {
		const oppScore = score === 0.5 ? 0.5 : (score === 1 ? 0 : 1);
		const oppExpected = 1 / (1 + Math.pow(10, (myElo - oppElo) / 400));
		const oppNew = Math.round(oppElo + k * (oppScore - oppExpected));
		await setDoc(doc(db, 'leaderboards', oppUid), {
			name: oppName || 'Player',
			chessElo: oppNew,
			chessWins: (oppData.chessWins || 0) + (score === 0 ? 1 : 0),
			chessLosses: (oppData.chessLosses || 0) + (score === 1 ? 1 : 0),
			chessDraws: (oppData.chessDraws || 0) + (score === 0.5 ? 1 : 0)
		}, { merge: true });
	}
}

async function applyEloIfNeeded() {
	if (!chessGame || chessGame.status !== 'ended') return;
	if (chessGame.eloApplied) return;
	const myRole = myColor === 'w' ? 'white' : 'black';
	const result = chessGame.result === 'draw' ? 'draw' : chessGame.result;
	const isWinner = result === myRole;
	// Only winner (or white in draw) applies ELO to avoid double updates
	const shouldApply = result === 'draw' ? myColor === 'w' : isWinner;
	if (!shouldApply) return;
	await updateChessElo(result, false);
	await updateDoc(doc(db, 'chess_games', chessGameId), { eloApplied: true });
}

if (chessStart) {
	chessStart.addEventListener('click', () => {
		if (!chessMode) return;
		setChessStatus('Loading chess...');
		ensureChess().then((ok) => {
			if (!ok) {
				setChessStatus('Chess failed to load');
				return;
			}
			const mode = chessMode.value;
			if (mode.startsWith('bot')) {
				startBotGame(mode.split('-')[1]);
			} else {
				if (!currentUser) {
					setChessStatus('Login required for online play.');
					return;
				}
				startOnlineLists();
				setChessStatus('Online mode: invite a player.');
			}
		});
	});
}

if (chessDraw) {
	chessDraw.addEventListener('click', async () => {
		if (!chessGameId || !chessGame) return;
		if (!chessGame.drawOffer) {
			await updateDoc(doc(db, 'chess_games', chessGameId), { drawOffer: currentUser.uid });
			setChessStatus('Draw offered');
			return;
		}
		if (chessGame.drawOffer && chessGame.drawOffer !== currentUser.uid) {
			await updateDoc(doc(db, 'chess_games', chessGameId), { status: 'ended', result: 'draw', reason: 'draw', drawOffer: null });
		} else {
			await updateDoc(doc(db, 'chess_games', chessGameId), { drawOffer: null });
		}
	});
}

if (chessResign) {
	chessResign.addEventListener('click', async () => {
		if (chessIsBot) {
			setChessStatus('Resigned. Bot wins.');
			await updateChessElo(myColor === 'w' ? 'black' : 'white', true);
			return;
		}
		if (!chessGameId || !chessGame) return;
		const winner = myColor === 'w' ? 'b' : 'w';
		await endGameOnline(winner, 'resign');
	});
}

if (chessBtn) {
	chessBtn.addEventListener('click', () => {
		const section = document.querySelector('.panel.chess');
		if (section) section.scrollIntoView({ behavior: 'smooth' });
	});
}

// --- Calculator ---
let calcState = null;
const calcReady = !!(calcPanel && calcDisplay && calcEq && exitCalcBtn);

function startCalcSession() {
	if (!calcReady) return;
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
	if (!calcReady) return;
	calcDisplay.value = calcState.expr || '0';
}

function appendValue(v) {
	if (!calcState) return;
	if (calcState.expr.length > 32) return;
	const parts = calcState.expr.split(/[-+*/]/);
	const last = parts[parts.length - 1] || '';
	if (v === '.' && last.includes('.')) return;
	if (v === '.' && last === '') {
		calcState.expr += '0.';
		updateCalcDisplay();
		return;
	}
	if (last === '0' && v !== '.' && !last.includes('.')) {
		calcState.expr = calcState.expr.slice(0, -1) + v;
		updateCalcDisplay();
		return;
	}
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

if (calcReady) {
	calcDisplay.addEventListener('keydown', (e) => e.preventDefault());

	const calcClear = document.getElementById('calc-clear');
	if (calcClear) {
		calcClear.addEventListener('click', () => {
			if (!calcState) return;
			calcState.expr = '';
			updateCalcDisplay();
		});
	}

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
		hide(gameModal);
	});
}

// --- Paint ---
let paintState = null;
let drawing = false;
const paintReady = !!(paintPanel && paintCanvas && pencilBtn && eraserBtn && fillBtn && colorPicker && brushSize && brushAlpha && paintClearBtn && exitPaintBtn);

function setActiveTool(tool) {
	if (!paintReady) return;
	pencilBtn.classList.toggle('active', tool === 'pencil');
	eraserBtn.classList.toggle('active', tool === 'eraser');
	fillBtn.classList.toggle('active', tool === 'fill');
}

function resizeCanvas() {
	if (!paintReady) return;
	const rect = paintCanvas.getBoundingClientRect();
	const dpr = window.devicePixelRatio || 1;
	paintCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
	paintCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
}

function startPaintSession() {
	if (!paintReady) return;
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

if (paintReady) {
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
		hide(gameModal);
	});
}

if (exitChessBtn) {
	exitChessBtn.addEventListener('click', () => {
		hide(chessPanel);
		hide(gameModal);
	});
}
