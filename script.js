'use strict';

// =============================================
//  STAŁE — definicje zwierząt i kostek
// =============================================

const ANIMALS = {
  krolik:   { emoji: '🐰', name: 'Królik',    herdStart: 60 },
  owca:     { emoji: '🐑', name: 'Owca',      herdStart: 24 },
  swinia:   { emoji: '🐷', name: 'Świnia',    herdStart: 20 },
  krowa:    { emoji: '🐮', name: 'Krowa',     herdStart: 12 },
  kon:      { emoji: '🐴', name: 'Koń',       herdStart:  6 },
  malyPies: { emoji: '🐕', name: 'M. Pies',   herdStart:  4 },
  duzyPies: { emoji: '🐩', name: 'D. Pies',   herdStart:  2 },
};

const WIN_ANIMALS = ['krolik', 'owca', 'swinia', 'krowa', 'kon'];

// Kostka 1: 12 ścian (6 królików, 3 owce, 1 świnia, 1 krowa, 1 wilk)
const CUBE1 = ['krolik','krolik','krolik','krolik','krolik','krolik','owca','owca','owca','swinia','krowa','wilk'];
// Kostka 2: 12 ścian (6 królików, 2 owce, 2 świnie, 1 koń, 1 lis)
const CUBE2 = ['krolik','krolik','krolik','krolik','krolik','krolik','owca','owca','swinia','swinia','kon','lis'];

// Kursy wymiany: [ile z farmy, ile ze stada, gatunek_z, gatunek_na]
const TRADES = [
  [6,  1, 'krolik', 'owca'],
  [1,  6, 'owca',   'krolik'],
  [2,  1, 'owca',   'swinia'],
  [1,  2, 'swinia', 'owca'],
  [3,  1, 'swinia', 'krowa'],
  [1,  3, 'krowa',  'swinia'],
  [2,  1, 'krowa',  'kon'],
  [1,  2, 'kon',    'krowa'],
  [1,  1, 'owca',   'malyPies'],
  [1,  1, 'malyPies','owca'],
  [1,  1, 'krowa',  'duzyPies'],
  [1,  1, 'duzyPies','krowa'],
];

// =============================================
//  STAN GRY
// =============================================

function makeFarm(isHerd = false) {
  const f = {};
  for (const k in ANIMALS) f[k] = isHerd ? ANIMALS[k].herdStart : 0;
  return f;
}

let state = {
  mode: '2p',       // '2p' lub 'ai'
  names: ['Gracz 1', 'Gracz 2'],
  herd: null,
  farms: [null, null],
  currentPlayer: 0, // 0 lub 1
  gameOver: false,
  rolling: false,
};

// =============================================
//  EKRAN STARTOWY
// =============================================

let selectedMode = '2p';

function selectMode(mode) {
  selectedMode = mode;
  document.getElementById('mode2p').classList.toggle('selected', mode === '2p');
  document.getElementById('modeAI').classList.toggle('selected', mode === 'ai');
  document.getElementById('player2NameWrap').style.display = mode === 'ai' ? 'none' : 'block';
}

function startGame() {
  const name1 = document.getElementById('player1Name').value.trim() || 'Gracz 1';
  const name2 = selectedMode === 'ai' ? '🤖 Komputer' : (document.getElementById('player2Name').value.trim() || 'Gracz 2');

  state = {
    mode: selectedMode,
    names: [name1, name2],
    herd: makeFarm(true),
    farms: [makeFarm(), makeFarm()],
    currentPlayer: 0,
    gameOver: false,
    rolling: false,
  };

  document.getElementById('startScreen').style.display = 'none';
  const gs = document.getElementById('gameScreen');
  gs.style.display = 'flex';

  // Ustaw imiona
  document.getElementById('p1Label').textContent = name1;
  document.getElementById('p2Label').textContent = name2;
  document.getElementById('p1TypeBadge').textContent = 'Człowiek';
  document.getElementById('p2TypeBadge').textContent = selectedMode === 'ai' ? 'Komputer (AI)' : 'Człowiek';

  setupExchangeUI();
  renderAll();
  log(`🌾 Gra rozpoczęta! Tura: ${name1}`, 'info');
}

// =============================================
//  RENDEROWANIE
// =============================================

function renderAll() {
  renderHerd();
  renderFarm(0);
  renderFarm(1);
  updateTurnUI();
}

function renderHerd() {
  const el = document.getElementById('herdDisplay');
  el.innerHTML = '';
  for (const k in ANIMALS) {
    el.innerHTML += `
      <div class="animal-slot">
        <span class="animal-emoji">${ANIMALS[k].emoji}</span>
        <div class="animal-count" id="herd-${k}">${state.herd[k]}</div>
        <div class="animal-name">${ANIMALS[k].name}</div>
      </div>`;
  }
}

function renderFarm(playerIdx) {
  const id = `p${playerIdx + 1}-farm`;
  const el = document.getElementById(id);
  el.innerHTML = '';
  for (const k in ANIMALS) {
    el.innerHTML += `
      <div class="animal-slot">
        <span class="animal-emoji">${ANIMALS[k].emoji}</span>
        <div class="animal-count" id="p${playerIdx+1}-${k}">${state.farms[playerIdx][k]}</div>
        <div class="animal-name">${ANIMALS[k].name}</div>
      </div>`;
  }
  updateProgress(playerIdx);
}

function updateCounts() {
  for (const k in ANIMALS) {
    const hEl = document.getElementById(`herd-${k}`);
    if (hEl) hEl.textContent = state.herd[k];
    for (let i = 0; i < 2; i++) {
      const fEl = document.getElementById(`p${i+1}-${k}`);
      if (fEl) fEl.textContent = state.farms[i][k];
    }
  }
  updateProgress(0);
  updateProgress(1);
}

function updateProgress(playerIdx) {
  const farm = state.farms[playerIdx];
  const count = WIN_ANIMALS.filter(a => farm[a] > 0).length;
  const pct = (count / WIN_ANIMALS.length) * 100;
  const bar   = document.getElementById(`p${playerIdx+1}-progress`);
  const label = document.getElementById(`p${playerIdx+1}-progress-label`);
  if (bar)   bar.style.width = pct + '%';
  if (label) label.textContent = `${count}/5`;
}

function updateTurnUI() {
  const name = state.names[state.currentPlayer];
  document.getElementById('turnBadge').textContent = `Tura: ${name}`;

  document.getElementById('p1Card').classList.toggle('active', state.currentPlayer === 0);
  document.getElementById('p2Card').classList.toggle('active', state.currentPlayer === 1);

  // Wyłącz przycisk jeśli AI gra
  const isAITurn = state.mode === 'ai' && state.currentPlayer === 1;
  document.getElementById('throwBtn').disabled = isAITurn;
}

// =============================================
//  LOGOWANIE
// =============================================

function log(msg, type = '') {
  const box = document.getElementById('logContent');
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.innerHTML = msg;
  box.prepend(div);
}

// =============================================
//  KOSTKI
// =============================================

function rollDie(cube) {
  return cube[Math.floor(Math.random() * cube.length)];
}

function getAnimalEmoji(result) {
  if (result === 'wilk') return '🐺';
  if (result === 'lis')  return '🦊';
  return ANIMALS[result].emoji;
}

// =============================================
//  LOGIKA TURY
// =============================================

function handleThrow() {
  if (state.gameOver || state.rolling) return;
  executeTurn(state.currentPlayer);
}

function executeTurn(playerIdx) {
  state.rolling = true;
  document.getElementById('throwBtn').disabled = true;

  // Animacja kostek
  const die1El = document.getElementById('die1');
  const die2El = document.getElementById('die2');
  die1El.classList.add('rolling');
  die2El.classList.add('rolling');
  die1El.textContent = '🎲';
  die2El.textContent = '🎲';

  setTimeout(() => {
    const r1 = rollDie(CUBE1);
    const r2 = rollDie(CUBE2);

    die1El.classList.remove('rolling');
    die2El.classList.remove('rolling');
    die1El.textContent = getAnimalEmoji(r1);
    die2El.textContent = getAnimalEmoji(r2);

    const name = state.names[playerIdx];
    document.getElementById('diceResult').textContent =
      `${name} wyrzucił: ${getAnimalEmoji(r1)} i ${getAnimalEmoji(r2)}`;

    processRoll(playerIdx, r1, r2);
    updateCounts();

    if (!state.gameOver) {
      if (state.mode === 'ai') aiExchange(1); // AI wymiana po rzucie
      if (!checkWin(playerIdx)) {
        endTurn();
        // Jeśli kolejny gracz to AI, odpal jego turę po chwili
        if (state.mode === 'ai' && state.currentPlayer === 1 && !state.gameOver) {
          setTimeout(() => aiTurn(), 1200);
        }
      }
    }

    state.rolling = false;
    if (!state.gameOver) {
      const isAITurn = state.mode === 'ai' && state.currentPlayer === 1;
      document.getElementById('throwBtn').disabled = isAITurn;
    }
  }, 550);
}

function processRoll(playerIdx, r1, r2) {
  const farm = state.farms[playerIdx];
  const name = state.names[playerIdx];

  // Wilk na kostce 1 ma priorytet
  if (r1 === 'wilk') {
    handleWolf(playerIdx, name);
    // Jeśli na drugiej kostce coś innego niż lis — normalny wynik, ale wilk anuluje
    return;
  }

  // Lis na kostce 2 ma priorytet
  if (r2 === 'lis') {
    handleFox(playerIdx, name);
    return;
  }

  // Normalny rzut — licz zwierzęta
  const rolled = {};
  [r1, r2].forEach(r => rolled[r] = (rolled[r] || 0) + 1);

  let gained = [];
  for (const animal in rolled) {
    const inFarm = farm[animal];
    const total = inFarm + rolled[animal];
    const newCount = Math.floor(total / 2);
    const toAdd = Math.max(0, newCount - inFarm);
    if (toAdd > 0) {
      const actual = Math.min(toAdd, state.herd[animal]);
      if (actual > 0) {
        farm[animal] += actual;
        state.herd[animal] -= actual;
        gained.push(`+${actual}${ANIMALS[animal].emoji}`);
      }
    }
  }

  if (gained.length > 0) {
    log(`🎲 ${name}: ${gained.join(', ')}`, 'good');
  } else {
    log(`🎲 ${name}: Brak nowych zwierząt`, '');
  }
}

function handleWolf(playerIdx, name) {
  const farm = state.farms[playerIdx];
  if (farm.duzyPies > 0) {
    state.herd.duzyPies++;
    farm.duzyPies--;
    log(`🐺 Wilk zaatakował! Duży pies obronił farmę ${name}.`, 'good');
  } else {
    let lost = [];
    for (const k in farm) {
      if (k !== 'kon' && k !== 'duzyPies' && farm[k] > 0) {
        state.herd[k] += farm[k];
        lost.push(`${farm[k]}${ANIMALS[k].emoji}`);
        farm[k] = 0;
      }
    }
    if (lost.length) log(`🐺 Wilk spustoszył farmę ${name}! Stracono: ${lost.join(', ')}`, 'bad');
    else log(`🐺 Wilk zaatakował ${name}, ale farma i tak była pusta!`, 'bad');
  }
}

function handleFox(playerIdx, name) {
  const farm = state.farms[playerIdx];
  if (farm.malyPies > 0) {
    state.herd.malyPies++;
    farm.malyPies--;
    log(`🦊 Lis zaatakował! Mały pies obronił króliki ${name}.`, 'good');
  } else {
    const lost = farm.krolik;
    state.herd.krolik += lost;
    farm.krolik = 0;
    if (lost > 0) log(`🦊 Lis zjadł ${lost}🐰 z farmy ${name}!`, 'bad');
    else log(`🦊 Lis odwiedził ${name}, ale nie było królików do zjedzenia.`, 'bad');
  }
}

function endTurn() {
  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  updateTurnUI();
  const name = state.names[state.currentPlayer];
  log(`— Tura: ${name} —`, 'info');
}

// =============================================
//  WYMIANA
// =============================================

function exchange(fromCount, toCount, fromAnimal, toAnimal) {
  if (state.gameOver) return;
  const farm = state.farms[state.currentPlayer];
  const name = state.names[state.currentPlayer];

  if (farm[fromAnimal] < fromCount) {
    log(`❌ Za mało ${ANIMALS[fromAnimal].emoji} do wymiany!`, '');
    return;
  }
  if (state.herd[toAnimal] < toCount) {
    log(`❌ Stado nie ma tyle ${ANIMALS[toAnimal].emoji}!`, '');
    return;
  }

  farm[fromAnimal]       -= fromCount;
  state.herd[fromAnimal] += fromCount;
  farm[toAnimal]         += toCount;
  state.herd[toAnimal]   -= toCount;

  log(`🔄 ${name}: ${fromCount}${ANIMALS[fromAnimal].emoji} → ${toCount}${ANIMALS[toAnimal].emoji}`, 'trade');
  updateCounts();
  checkWin(state.currentPlayer);
}

function setupExchangeUI() {
  const grid = document.getElementById('exchangeTools');
  grid.innerHTML = '';
  TRADES.forEach(([fc, tc, fa, ta]) => {
    const btn = document.createElement('button');
    btn.className = 'ex-btn';
    btn.title = `Wymień ${fc} ${ANIMALS[fa].name} za ${tc} ${ANIMALS[ta].name}`;
    btn.innerHTML = `${fc}${ANIMALS[fa].emoji} ➔ ${tc}${ANIMALS[ta].emoji}`;
    btn.onclick = () => exchange(fc, tc, fa, ta);
    grid.appendChild(btn);
  });
}

// =============================================
//  AI — PROSTA STRATEGIA OPTYMALNA
// =============================================

function aiTurn() {
  if (state.gameOver || state.currentPlayer !== 1) return;

  // AI najpierw robi wymianę, potem rzut
  aiExchange(1);

  const aiName = state.names[1];
  log(`🤖 ${aiName} <span class="ai-thinking">myśli</span>`, '');

  setTimeout(() => {
    executeTurn(1);
  }, 800);
}

function aiExchange(playerIdx) {
  // Greedy: zawsze próbuj awansować do wyższych zwierząt
  const farm = state.farms[playerIdx];
  const order = ['krolik','owca','swinia','krowa','kon'];
  const rates  = [6, 2, 3, 2]; // ile niższych = 1 wyższy

  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < order.length - 1; i++) {
      const from = order[i];
      const to   = order[i + 1];
      const rate = rates[i];
      // Wymień jeśli mamy dużo niższych i stado ma wyższe
      while (farm[from] >= rate && state.herd[to] >= 1) {
        farm[from]       -= rate;
        state.herd[from] += rate;
        farm[to]         += 1;
        state.herd[to]   -= 1;
        changed = true;
      }
    }
    // Jeśli brak małego psa i mamy owcę zapasową — kup
    if (farm.owca >= 2 && farm.malyPies === 0 && state.herd.malyPies > 0) {
      farm.owca         -= 1;
      state.herd.owca   += 1;
      farm.malyPies     += 1;
      state.herd.malyPies -= 1;
      changed = true;
    }
    // Jeśli brak dużego psa i mamy krowę zapasową — kup
    if (farm.krowa >= 2 && farm.duzyPies === 0 && state.herd.duzyPies > 0) {
      farm.krowa        -= 1;
      state.herd.krowa  += 1;
      farm.duzyPies     += 1;
      state.herd.duzyPies -= 1;
      changed = true;
    }
  }
  updateCounts();
}

// =============================================
//  WARUNEK WYGRANEJ
// =============================================

function checkWin(playerIdx) {
  const farm = state.farms[playerIdx];
  const won = WIN_ANIMALS.every(a => farm[a] >= 1);
  if (won) {
    state.gameOver = true;
    const name = state.names[playerIdx];
    showWinner(name);
    return true;
  }
  return false;
}

function showWinner(name) {
  document.getElementById('winnerName').textContent = `${name} wygrywa!`;
  document.getElementById('winnerScreen').style.display = 'flex';
  document.getElementById('throwBtn').disabled = true;
  launchConfetti();
  log(`🏆 ${name} zebrał wszystkie zwierzęta i wygrał!`, 'info');
}

// =============================================
//  KONFETTI
// =============================================

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f5c518','#e8a12a','#27ae60','#3498db','#e74c3c','#9b59b6','#1abc9c'];
  const pieces = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 8 + Math.random() * 8,
    h: 6 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 3,
    vy: 2 + Math.random() * 4,
    vr: (Math.random() - 0.5) * 0.15,
    opacity: 1,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
    });
    frame++;
    if (frame < 350) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// =============================================
//  ZASADY — MODAL
// =============================================

function toggleRules() {
  const m = document.getElementById('rulesModal');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

function closeRulesOnBg(e) {
  if (e.target === document.getElementById('rulesModal')) toggleRules();
}

// =============================================
//  INIT
// =============================================

window.onload = function () {
  // Mały pies nie ma wrappera — upewnij się że display bloku jest poprawny
  document.getElementById('player2NameWrap').style.display = 'block';
};
