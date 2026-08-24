'use strict';

// =============================================================================
//  SPECIES CONSTANTS & DEFINITIONS
// =============================================================================

const ANIMALS = {
  krolik:   { emoji: '🐰', name: 'Rabbit',    herdStart: 60, isWinTarget: true  },
  owca:     { emoji: '🐑', name: 'Sheep',     herdStart: 24, isWinTarget: true  },
  swinia:   { emoji: '🐷', name: 'Pig',       herdStart: 20, isWinTarget: true  },
  krowa:    { emoji: '🐮', name: 'Cow',       herdStart: 12, isWinTarget: true  },
  kon:      { emoji: '🐴', name: 'Horse',     herdStart:  6, isWinTarget: true  },
  malyPies: { emoji: '🐕', name: 'Small Dog', herdStart:  4, isWinTarget: false },
  duzyPies: { emoji: '🐩', name: 'Big Dog',   herdStart:  2, isWinTarget: false },
};

const WIN_ANIMALS = ['krolik', 'owca', 'swinia', 'krowa', 'kon'];

// Die 1: 12 faces (6 rabbits, 3 sheep, 1 pig, 1 cow, 1 wolf)
const CUBE1 = ['krolik','krolik','krolik','krolik','krolik','krolik','owca','owca','owca','swinia','krowa','wilk'];
// Die 2: 12 faces (6 rabbits, 2 sheep, 2 pigs, 1 horse, 1 fox)
const CUBE2 = ['krolik','krolik','krolik','krolik','krolik','krolik','owca','owca','swinia','swinia','kon','lis'];

// Catalog of exchange rates
const TRADES = [
  // Upgrades
  { fc: 6, tc: 1, fa: 'krolik', ta: 'owca',     category: 'upgrade'   },
  { fc: 2, tc: 1, fa: 'owca',   ta: 'swinia',   category: 'upgrade'   },
  { fc: 3, tc: 1, fa: 'swinia', ta: 'krowa',    category: 'upgrade'   },
  { fc: 2, tc: 1, fa: 'krowa',  ta: 'kon',      category: 'upgrade'   },

  // Downgrades
  { fc: 1, tc: 6, fa: 'owca',   ta: 'krolik',   category: 'downgrade' },
  { fc: 1, tc: 2, fa: 'swinia', ta: 'owca',     category: 'downgrade' },
  { fc: 1, tc: 3, fa: 'krowa',  ta: 'swinia',   category: 'downgrade' },
  { fc: 1, tc: 2, fa: 'kon',    ta: 'krowa',    category: 'downgrade' },

  // Dogs
  { fc: 1, tc: 1, fa: 'owca',   ta: 'malyPies', category: 'dogs'      },
  { fc: 1, tc: 1, fa: 'malyPies',ta: 'owca',    category: 'dogs'      },
  { fc: 1, tc: 1, fa: 'krowa',  ta: 'duzyPies', category: 'dogs'      },
  { fc: 1, tc: 1, fa: 'duzyPies',ta: 'krowa',   category: 'dogs'      },
];

// =============================================================================
//  PROCEDURAL AUDIO SYNTHESIZER (WEB AUDIO API)
// =============================================================================

class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('farmer_sound_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('farmer_sound_muted', this.muted);
    return this.muted;
  }

  playRoll() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140 + Math.random() * 80, now + i * 0.09);
      gain.gain.setValueAtTime(0.12, now + i * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.09);
      osc.stop(now + i * 0.09 + 0.07);
    }
  }

  playGain() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.15, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.28);
    });
  }

  playTrade() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [987.77, 1318.51]; // B5, E6
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.22);
    });
  }

  playWolf() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.6);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.7);
  }

  playFox() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(700, now + 0.15);
    osc.frequency.linearRampToValueAtTime(300, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const chords = [
      { f: [523.25, 659.25, 783.99], t: 0 },
      { f: [587.33, 698.46, 880.00], t: 0.2 },
      { f: [659.25, 783.99, 987.77], t: 0.4 },
      { f: [783.99, 987.77, 1318.51, 1567.98], t: 0.65 },
    ];
    chords.forEach(c => {
      c.f.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + c.t);
        gain.gain.setValueAtTime(0.12, now + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + c.t);
        osc.stop(now + c.t + 0.75);
      });
    });
  }

  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

const SoundFX = new SoundFXEngine();

// =============================================================================
//  GAME STATE
// =============================================================================

function makeFarm(isHerd = false) {
  const f = {};
  for (const k in ANIMALS) f[k] = isHerd ? ANIMALS[k].herdStart : 0;
  return f;
}

let state = {
  mode: '2p',            // '2p' | 'ai'
  names: ['Player 1', 'Player 2'],
  herd: null,
  farms: [null, null],
  currentPlayer: 0,      // 0 | 1
  phase: 'BEFORE_ROLL',  // 'BEFORE_ROLL' | 'AFTER_ROLL'
  activeTradeFilter: 'all',
  gameOver: false,
  rolling: false,
};

let selectedMode = '2p';

// =============================================================================
//  START SCREEN & INITIALIZATION
// =============================================================================

function selectMode(mode) {
  selectedMode = mode;
  SoundFX.playClick();
  document.getElementById('mode2p').classList.toggle('selected', mode === '2p');
  document.getElementById('modeAI').classList.toggle('selected', mode === 'ai');
  document.getElementById('player2NameWrap').style.display = mode === 'ai' ? 'none' : 'flex';
}

function startGame() {
  SoundFX.init();
  SoundFX.playClick();

  const name1 = document.getElementById('player1Name').value.trim() || 'Player 1';
  const name2 = selectedMode === 'ai' ? '🤖 Computer (AI)' : (document.getElementById('player2Name').value.trim() || 'Player 2');

  state = {
    mode: selectedMode,
    names: [name1, name2],
    herd: makeFarm(true),
    farms: [makeFarm(), makeFarm()],
    currentPlayer: 0,
    phase: 'BEFORE_ROLL',
    activeTradeFilter: 'all',
    gameOver: false,
    rolling: false,
  };

  document.getElementById('startScreen').style.display = 'none';
  const gs = document.getElementById('gameScreen');
  gs.style.display = 'flex';

  document.getElementById('p1Label').textContent = name1;
  document.getElementById('p2Label').textContent = name2;
  document.getElementById('p1TypeBadge').textContent = 'Farmer';
  document.getElementById('p2TypeBadge').textContent = selectedMode === 'ai' ? 'AI Bot' : 'Farmer';
  document.getElementById('p2Avatar').textContent = selectedMode === 'ai' ? '🤖' : '🧑‍🌾';

  setupExchangeUI();
  renderAll();
  log(`🌾 Game started! Good luck to ${name1} and ${name2}!`, 'info');
}

function toggleSound() {
  const isMuted = SoundFX.toggleMute();
  const icon = document.getElementById('soundIcon');
  if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
  if (!isMuted) SoundFX.playClick();
}

// =============================================================================
//  RENDERING UI
// =============================================================================

function renderAll() {
  renderHerd();
  renderFarm(0);
  renderFarm(1);
  updateTurnUI();
  updateExchangeUI();
}

function renderHerd() {
  const el = document.getElementById('herdDisplay');
  el.innerHTML = '';
  for (const k in ANIMALS) {
    const a = ANIMALS[k];
    const isEmpty = state.herd[k] === 0;
    el.innerHTML += `
      <div class="animal-slot ${isEmpty ? 'empty' : ''}" id="slot-herd-${k}" title="Bank Herd: ${a.name}">
        <span class="animal-emoji">${a.emoji}</span>
        <div class="animal-count" id="herd-${k}">${state.herd[k]}</div>
        <div class="animal-name">${a.name}</div>
      </div>`;
  }
}

function renderFarm(playerIdx) {
  const pNum = playerIdx + 1;
  const el = document.getElementById(`p${pNum}-farm`);
  el.innerHTML = '';
  for (const k in ANIMALS) {
    const a = ANIMALS[k];
    const count = state.farms[playerIdx][k];
    const isEmpty = count === 0;
    el.innerHTML += `
      <div class="animal-slot ${isEmpty ? 'empty' : ''}" id="slot-p${pNum}-${k}" title="${a.name} on farm">
        <span class="animal-emoji">${a.emoji}</span>
        <div class="animal-count" id="p${pNum}-${k}">${count}</div>
        <div class="animal-name">${a.name}</div>
      </div>`;
  }
  updatePlayerBadges(playerIdx);
}

function updateCounts() {
  for (const k in ANIMALS) {
    const hEl = document.getElementById(`herd-${k}`);
    const hSlot = document.getElementById(`slot-herd-${k}`);
    if (hEl) hEl.textContent = state.herd[k];
    if (hSlot) hSlot.classList.toggle('empty', state.herd[k] === 0);

    for (let i = 0; i < 2; i++) {
      const pNum = i + 1;
      const count = state.farms[i][k];
      const fEl = document.getElementById(`p${pNum}-${k}`);
      const fSlot = document.getElementById(`slot-p${pNum}-${k}`);
      if (fEl) fEl.textContent = count;
      if (fSlot) fSlot.classList.toggle('empty', count === 0);
    }
  }
  updatePlayerBadges(0);
  updatePlayerBadges(1);
  updateExchangeUI();
}

function updatePlayerBadges(playerIdx) {
  const pNum = playerIdx + 1;
  const farm = state.farms[playerIdx];

  // Victory Badges (5 Target Species)
  let winCount = 0;
  WIN_ANIMALS.forEach(animalKey => {
    const slot = document.getElementById(`p${pNum}-vic-${animalKey}`);
    const hasAnimal = farm[animalKey] > 0;
    if (slot) {
      slot.classList.toggle('collected', hasAnimal);
      const statusSpan = slot.querySelector('.vic-status');
      if (statusSpan) statusSpan.textContent = hasAnimal ? '✅' : '❌';
    }
    if (hasAnimal) winCount++;
  });

  const progressLabel = document.getElementById(`p${pNum}-progress-label`);
  if (progressLabel) progressLabel.textContent = `${winCount} / 5`;
  const progressBar = document.getElementById(`p${pNum}-progress`);
  if (progressBar) progressBar.style.width = `${(winCount / 5) * 100}%`;

  // Dog Defense Shields
  const foxBadge = document.getElementById(`p${pNum}-def-fox`);
  const foxState = document.getElementById(`p${pNum}-def-fox-state`);
  const hasFoxDef = farm.malyPies > 0;
  if (foxBadge) foxBadge.classList.toggle('active-def', hasFoxDef);
  if (foxState) foxState.textContent = hasFoxDef ? `Active (${farm.malyPies}🐕) 🛡️` : 'No Dog ⚠️';

  const wolfBadge = document.getElementById(`p${pNum}-def-wolf`);
  const wolfState = document.getElementById(`p${pNum}-def-wolf-state`);
  const hasWolfDef = farm.duzyPies > 0;
  if (wolfBadge) wolfBadge.classList.toggle('active-def', hasWolfDef);
  if (wolfState) wolfState.textContent = hasWolfDef ? `Active (${farm.duzyPies}🐩) 🛡️` : 'No Dog ⚠️';
}

function updateTurnUI() {
  const p = state.currentPlayer;
  const name = state.names[p];
  const isAI = state.mode === 'ai' && p === 1;

  document.getElementById('turnBadgeText').textContent = `Turn: ${name}`;
  document.getElementById('p1Card').classList.toggle('active', p === 0);
  document.getElementById('p2Card').classList.toggle('active', p === 1);

  const phaseTag = document.getElementById('dicePhaseTag');
  const phaseIndicator = document.getElementById('turnPhaseIndicator');
  const throwBtn = document.getElementById('throwBtn');
  const endTurnBtn = document.getElementById('endTurnBtn');

  if (state.phase === 'BEFORE_ROLL') {
    if (phaseTag) phaseTag.textContent = 'PHASE 1: ROLL OR TRADE';
    if (phaseIndicator) phaseIndicator.textContent = 'Step 1: Execute trades on the market or roll the dice';
    if (throwBtn) throwBtn.disabled = isAI || state.rolling;
    if (endTurnBtn) endTurnBtn.disabled = true;
  } else {
    if (phaseTag) phaseTag.textContent = 'PHASE 2: SUMMARY & TRADE';
    if (phaseIndicator) phaseIndicator.textContent = 'Step 2: Check your newborn animals, trade, and end turn';
    if (throwBtn) throwBtn.disabled = true;
    if (endTurnBtn) endTurnBtn.disabled = isAI || state.rolling;
  }
}

// =============================================================================
//  ANIMATED FLOATING LABELS (FLOATING DELTA)
// =============================================================================

function showFloatingDelta(elementId, text, isPositive = true) {
  const target = document.getElementById(elementId);
  if (!target) return;
  const rect = target.getBoundingClientRect();
  const container = document.getElementById('floatingDeltaContainer');
  if (!container) return;

  const delta = document.createElement('div');
  delta.className = `floating-delta ${isPositive ? 'plus' : 'minus'}`;
  delta.textContent = text;
  delta.style.left = `${rect.left + rect.width / 2}px`;
  delta.style.top = `${rect.top + rect.height / 3}px`;
  container.appendChild(delta);

  setTimeout(() => delta.remove(), 1200);
}

// =============================================================================
//  GAME EVENT LOGGING
// =============================================================================

function log(msg, type = '') {
  const box = document.getElementById('logContent');
  if (!box) return;
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.innerHTML = msg;
  box.prepend(div);
}

function clearLogs() {
  const box = document.getElementById('logContent');
  if (box) box.innerHTML = '';
}

// =============================================================================
//  TURN LOGIC & DICE ROLLING
// =============================================================================

function rollDie(cube) {
  return cube[Math.floor(Math.random() * cube.length)];
}

function getAnimalEmoji(result) {
  if (result === 'wilk') return '🐺';
  if (result === 'lis')  return '🦊';
  return ANIMALS[result].emoji;
}

function handleThrow() {
  if (state.gameOver || state.rolling || state.phase !== 'BEFORE_ROLL') return;
  executeThrow(state.currentPlayer);
}

function executeThrow(playerIdx) {
  state.rolling = true;
  SoundFX.playRoll();
  updateTurnUI();

  const die1El = document.getElementById('die1');
  const die2El = document.getElementById('die2');
  die1El.classList.add('rolling');
  die2El.classList.add('rolling');
  die1El.querySelector('.die-face').textContent = '🎲';
  die2El.querySelector('.die-face').textContent = '🎲';

  const calcBox = document.getElementById('calcBreakdown');
  if (calcBox) calcBox.style.display = 'none';

  setTimeout(() => {
    const r1 = rollDie(CUBE1);
    const r2 = rollDie(CUBE2);

    die1El.classList.remove('rolling');
    die2El.classList.remove('rolling');
    die1El.querySelector('.die-face').textContent = getAnimalEmoji(r1);
    die2El.querySelector('.die-face').textContent = getAnimalEmoji(r2);

    const name = state.names[playerIdx];
    document.getElementById('diceResult').textContent =
      `${name} rolled: ${getAnimalEmoji(r1)} and ${getAnimalEmoji(r2)}`;

    processRoll(playerIdx, r1, r2);
    updateCounts();

    state.rolling = false;
    state.phase = 'AFTER_ROLL';
    updateTurnUI();

    if (!state.gameOver) {
      checkWin(playerIdx);
    }
  }, 580);
}

function processRoll(playerIdx, r1, r2) {
  const farm = state.farms[playerIdx];
  const name = state.names[playerIdx];
  const pNum = playerIdx + 1;
  const calcBox = document.getElementById('calcBreakdown');
  const calcText = document.getElementById('calcBreakdownText');

  const isWolf = (r1 === 'wilk');
  const isFox = (r2 === 'lis');

  // Predator encounters
  if (isWolf || isFox) {
    if (isWolf) handleWolf(playerIdx, name);
    if (isFox) handleFox(playerIdx, name);
    return;
  }

  // Normal roll — breeding calculation
  const rolledCounts = {};
  [r1, r2].forEach(r => rolledCounts[r] = (rolledCounts[r] || 0) + 1);

  let gainedList = [];
  let explanations = [];

  for (const animal in rolledCounts) {
    const farmCount = farm[animal] || 0;
    const diceCount = rolledCounts[animal];
    const sum = farmCount + diceCount;
    // For every full pair (sum ÷ 2), the player gets 1 new offspring from bank
    const toAdd = Math.floor(sum / 2);

    if (toAdd > 0) {
      const inStock = state.herd[animal];
      const actualAdd = Math.min(toAdd, inStock);

      if (actualAdd > 0) {
        farm[animal] += actualAdd;
        state.herd[animal] -= actualAdd;
        gainedList.push(`+${actualAdd} ${ANIMALS[animal].emoji} (${ANIMALS[animal].name})`);
        showFloatingDelta(`slot-p${pNum}-${animal}`, `+${actualAdd} ${ANIMALS[animal].emoji}`, true);
        explanations.push(`• <strong>${ANIMALS[animal].name}</strong>: Farm has (${farmCount}) + Rolled on dice (${diceCount}) = Total <strong>${sum} pcs</strong> (i.e. <strong>${toAdd} ${toAdd === 1 ? 'pair' : 'pairs'}</strong>) ➔ Received <strong>+${actualAdd} ${ANIMALS[animal].emoji}</strong> from Bank.`);
      } else {
        explanations.push(`• <strong>${ANIMALS[animal].name}</strong>: Eligible for +${toAdd}, but Bank is completely out of stock!`);
      }
    } else {
      explanations.push(`• <strong>${ANIMALS[animal].name}</strong>: Farm has (${farmCount}) + Rolled (${diceCount}) = <strong>${sum} pcs</strong> (Need at least 2 to form a breeding pair).`);
    }
  }

  if (gainedList.length > 0) {
    SoundFX.playGain();
    log(`🎲 <strong>${name}</strong> expanded herd: ${gainedList.join(', ')}`, 'good');
  } else {
    log(`🎲 <strong>${name}</strong>: No new animal pairs from this roll.`, '');
  }

  if (calcBox && calcText) {
    calcBox.style.display = 'block';
    calcText.innerHTML = explanations.join('<br/>');
  }
}

function handleWolf(playerIdx, name) {
  const farm = state.farms[playerIdx];
  const pNum = playerIdx + 1;
  const calcBox = document.getElementById('calcBreakdown');
  const calcText = document.getElementById('calcBreakdownText');

  SoundFX.playWolf();

  if (farm.duzyPies > 0) {
    state.herd.duzyPies++;
    farm.duzyPies--;
    showFloatingDelta(`slot-p${pNum}-duzyPies`, '-1 🐩', false);
    log(`🐺 <strong>Wolf attacked!</strong> Big Dog 🐩 successfully defended ${name}'s farm and repelled the predator!`, 'good');
    if (calcBox && calcText) {
      calcBox.style.display = 'block';
      calcText.innerHTML = '🛡️ <strong>Defense Successful!</strong> Big Dog 🐩 repelled the Wolf and returned to the bank. Your herd is safe.';
    }
  } else {
    let lost = [];
    for (const k in farm) {
      if (k !== 'kon' && k !== 'duzyPies' && farm[k] > 0) {
        state.herd[k] += farm[k];
        lost.push(`${farm[k]} ${ANIMALS[k].emoji}`);
        showFloatingDelta(`slot-p${pNum}-${k}`, `-${farm[k]} ${ANIMALS[k].emoji}`, false);
        farm[k] = 0;
      }
    }
    if (lost.length > 0) {
      log(`🐺 <strong>Wolf raided ${name}'s farm!</strong> Lost: ${lost.join(', ')} (Horses and Big Dogs survived).`, 'bad');
    } else {
      log(`🐺 Wolf visited ${name}'s farm, but the farm was empty!`, 'bad');
    }
    if (calcBox && calcText) {
      calcBox.style.display = 'block';
      calcText.innerHTML = '⚠️ <strong>Wolf Attack!</strong> No Big Dog available. All animals (except Horses) were devoured and returned to the bank.';
    }
  }
}

function handleFox(playerIdx, name) {
  const farm = state.farms[playerIdx];
  const pNum = playerIdx + 1;
  const calcBox = document.getElementById('calcBreakdown');
  const calcText = document.getElementById('calcBreakdownText');

  SoundFX.playFox();

  if (farm.malyPies > 0) {
    state.herd.malyPies++;
    farm.malyPies--;
    showFloatingDelta(`slot-p${pNum}-malyPies`, '-1 🐕', false);
    log(`🦊 <strong>Fox attacked!</strong> Small Dog 🐕 protected ${name}'s rabbits!`, 'good');
    if (calcBox && calcText) {
      calcBox.style.display = 'block';
      calcText.innerHTML = '🛡️ <strong>Defense Successful!</strong> Small Dog 🐕 repelled the Fox and returned to the bank. Rabbits are safe.';
    }
  } else {
    const lost = farm.krolik;
    state.herd.krolik += lost;
    farm.krolik = 0;
    if (lost > 0) {
      showFloatingDelta(`slot-p${pNum}-krolik`, `-${lost} 🐰`, false);
      log(`🦊 <strong>Fox devoured all rabbits (${lost} 🐰)</strong> from ${name}'s farm!`, 'bad');
    } else {
      log(`🦊 Fox visited ${name}'s farm, but there were no rabbits to eat.`, 'bad');
    }
    if (calcBox && calcText) {
      calcBox.style.display = 'block';
      calcText.innerHTML = '⚠️ <strong>Fox Attack!</strong> No Small Dog available. All rabbits 🐰 were devoured and returned to the bank.';
    }
  }
}

function handleEndTurn() {
  if (state.gameOver || state.rolling || state.phase !== 'AFTER_ROLL') return;
  SoundFX.playClick();
  advanceTurn();
}

function advanceTurn() {
  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  state.phase = 'BEFORE_ROLL';
  updateCounts();
  updateTurnUI();

  const nextName = state.names[state.currentPlayer];
  log(`➡️ <strong>Turn finished.</strong> Next up: ${nextName}`, 'info');

  // Trigger AI turn if applicable
  if (state.mode === 'ai' && state.currentPlayer === 1 && !state.gameOver) {
    setTimeout(() => runAITurn(), 900);
  }
}

// =============================================================================
//  ANIMAL EXCHANGE MARKET
// =============================================================================

function filterTrades(category) {
  state.activeTradeFilter = category;
  SoundFX.playClick();
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.classList.toggle('active', tab.getAttribute('data-category') === category);
  });
  setupExchangeUI();
}

function setupExchangeUI() {
  const grid = document.getElementById('exchangeTools');
  if (!grid) return;
  grid.innerHTML = '';

  const playerFarm = state.farms[state.currentPlayer];
  const pNum = state.currentPlayer + 1;

  // Compute category counts
  const catCounts = { all: TRADES.length, upgrade: 0, downgrade: 0, dogs: 0 };
  TRADES.forEach(t => catCounts[t.category]++);
  for (const c in catCounts) {
    const el = document.getElementById(`count-${c}`);
    if (el) el.textContent = catCounts[c];
  }

  const filtered = state.activeTradeFilter === 'all'
    ? TRADES
    : TRADES.filter(t => t.category === state.activeTradeFilter);

  filtered.forEach(trade => {
    const { fc, tc, fa, ta } = trade;
    const playerHas = playerFarm ? playerFarm[fa] : 0;
    const bankHas = state.herd ? state.herd[ta] : 0;

    const maxByPlayer = Math.floor(playerHas / fc);
    const maxByBank = Math.floor(bankHas / tc);
    const maxTrades = Math.min(maxByPlayer, maxByBank);
    const isAffordable = maxTrades >= 1;
    const isOutOfStock = bankHas < tc;

    let cardClass = 'ex-card';
    if (isAffordable) cardClass += ' affordable';
    else if (isOutOfStock) cardClass += ' out-of-stock';
    else cardClass += ' unaffordable';

    const card = document.createElement('div');
    card.className = cardClass;
    card.innerHTML = `
      <div class="ex-card-flow">
        <div class="ex-side">
          <span class="ex-side-emoji">${ANIMALS[fa].emoji}</span>
          <div class="ex-side-info">
            <span class="ex-side-count">${fc}x</span>
            <span class="ex-side-name">${ANIMALS[fa].name}</span>
          </div>
        </div>
        <div class="ex-arrow-badge">➔</div>
        <div class="ex-side">
          <span class="ex-side-emoji">${ANIMALS[ta].emoji}</span>
          <div class="ex-side-info">
            <span class="ex-side-count">+${tc}x</span>
            <span class="ex-side-name">${ANIMALS[ta].name}</span>
          </div>
        </div>
      </div>

      <div class="ex-card-status">
        <span class="ex-status-you">You have: <strong>${playerHas}</strong> / ${fc}</span>
        <span class="ex-status-bank">In bank: <strong>${bankHas}</strong></span>
      </div>

      <div class="ex-card-actions">
        <button class="btn-trade-action" ${!isAffordable ? 'disabled' : ''} onclick="executeExchange(${fc}, ${tc}, '${fa}', '${ta}', 1)">
          ${isAffordable ? 'Trade 1x' : (isOutOfStock ? 'Out of Stock' : 'Need more animals')}
        </button>
        ${maxTrades >= 2 ? `<button class="btn-trade-max" title="Trade maximum affordable quantity (${maxTrades}x)" onclick="executeExchange(${fc}, ${tc}, '${fa}', '${ta}', ${maxTrades})">MAX (${maxTrades}x)</button>` : ''}
      </div>
    `;

    grid.appendChild(card);
  });
}

function updateExchangeUI() {
  setupExchangeUI();
}

function executeExchange(fc, tc, fa, ta, times = 1) {
  if (state.gameOver) return;
  const p = state.currentPlayer;
  const farm = state.farms[p];
  const name = state.names[p];
  const pNum = p + 1;

  const totalFrom = fc * times;
  const totalTo = tc * times;

  if (farm[fa] < totalFrom) {
    log(`❌ Not enough ${ANIMALS[fa].emoji} on ${name}'s farm!`, 'bad');
    return;
  }
  if (state.herd[ta] < totalTo) {
    log(`❌ Main Herd does not have ${totalTo}x ${ANIMALS[ta].emoji}!`, 'bad');
    return;
  }

  farm[fa] -= totalFrom;
  state.herd[fa] += totalFrom;
  farm[ta] += totalTo;
  state.herd[ta] -= totalTo;

  SoundFX.playTrade();
  showFloatingDelta(`slot-p${pNum}-${fa}`, `-${totalFrom} ${ANIMALS[fa].emoji}`, false);
  showFloatingDelta(`slot-p${pNum}-${ta}`, `+${totalTo} ${ANIMALS[ta].emoji}`, true);

  log(`🔄 <strong>${name}</strong> traded: ${totalFrom}${ANIMALS[fa].emoji} ➔ ${totalTo}${ANIMALS[ta].emoji}`, 'trade');

  updateCounts();
  checkWin(p);
}

// =============================================================================
//  ARTIFICIAL INTELLIGENCE (AI)
// =============================================================================

function runAITurn() {
  if (state.gameOver || state.currentPlayer !== 1) return;

  log(`🤖 <em>${state.names[1]} is analyzing the farm and calculating optimal trades...</em>`, '');

  // 1. Pre-roll trading
  setTimeout(() => {
    if (state.gameOver) return;
    smartAIExchange(1);

    // 2. Roll dice
    setTimeout(() => {
      if (state.gameOver) return;
      executeThrow(1);

      // 3. Post-roll trading & finish turn
      setTimeout(() => {
        if (state.gameOver) return;
        smartAIExchange(1);
        setTimeout(() => {
          if (!state.gameOver) {
            advanceTurn();
          }
        }, 800);
      }, 1000);

    }, 800);
  }, 700);
}

function smartAIExchange(playerIdx) {
  const farm = state.farms[playerIdx];
  const order = ['krolik', 'owca', 'swinia', 'krowa', 'kon'];
  const rates = [6, 2, 3, 2];

  let didTrade = false;
  let loops = 0;

  while (loops < 10) {
    loops++;
    let changed = false;

    // Guard dog defense if surplus animals available
    if (farm.owca >= 2 && farm.malyPies === 0 && state.herd.malyPies > 0) {
      farm.owca -= 1;
      state.herd.owca += 1;
      farm.malyPies += 1;
      state.herd.malyPies -= 1;
      log(`🤖 <strong>AI</strong> bought a Small Dog 🐕 for Fox defense.`, 'trade');
      changed = true;
      didTrade = true;
    }

    if (farm.krowa >= 2 && farm.duzyPies === 0 && state.herd.duzyPies > 0) {
      farm.krowa -= 1;
      state.herd.krowa += 1;
      farm.duzyPies += 1;
      state.herd.duzyPies -= 1;
      log(`🤖 <strong>AI</strong> bought a Big Dog 🐩 for Wolf defense.`, 'trade');
      changed = true;
      didTrade = true;
    }

    // Upgrades to higher tiers
    for (let i = 0; i < order.length - 1; i++) {
      const from = order[i];
      const to = order[i + 1];
      const rate = rates[i];

      while (farm[from] >= rate && state.herd[to] >= 1) {
        farm[from] -= rate;
        state.herd[from] += rate;
        farm[to] += 1;
        state.herd[to] -= 1;
        log(`🤖 <strong>AI</strong> traded ${rate}${ANIMALS[from].emoji} ➔ 1${ANIMALS[to].emoji}`, 'trade');
        changed = true;
        didTrade = true;
      }
    }

    if (!changed) break;
  }

  if (didTrade) {
    SoundFX.playTrade();
    updateCounts();
    checkWin(playerIdx);
  }
}

// =============================================================================
//  WIN CONDITION & CELEBRATION
// =============================================================================

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
  SoundFX.playVictory();
  document.getElementById('winnerName').textContent = `${name} is the Super Farmer!`;
  document.getElementById('winnerScreen').style.display = 'flex';
  document.getElementById('throwBtn').disabled = true;
  document.getElementById('endTurnBtn').disabled = true;
  launchConfetti();
  log(`🏆 <strong>${name}</strong> collected all 5 species and won the match!`, 'good');
}

function restartToStartScreen() {
  document.getElementById('winnerScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'flex';
}

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f5c518', '#10e88a', '#38b6ff', '#a855f7', '#ff4757', '#ffffff'];
  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 8 + Math.random() * 8,
    h: 6 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 5,
    vr: (Math.random() - 0.5) * 0.2,
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
    if (frame < 400) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// =============================================================================
//  MODALS & WINDOW MANAGEMENT
// =============================================================================

function toggleRules() {
  SoundFX.playClick();
  const m = document.getElementById('rulesModal');
  m.style.display = m.style.display === 'flex' ? 'none' : 'flex';
}

function closeRulesOnBg(e) {
  if (e.target === document.getElementById('rulesModal')) toggleRules();
}

function promptNewGame() {
  SoundFX.playClick();
  const m = document.getElementById('confirmResetModal');
  if (m) m.style.display = 'flex';
}

function closeResetModal() {
  SoundFX.playClick();
  const m = document.getElementById('confirmResetModal');
  if (m) m.style.display = 'none';
}

function closeResetOnBg(e) {
  if (e.target === document.getElementById('confirmResetModal')) closeResetModal();
}

function confirmResetGame() {
  closeResetModal();
  restartToStartScreen();
}

// =============================================================================
//  INITIAL LOAD
// =============================================================================

window.onload = function () {
  const icon = document.getElementById('soundIcon');
  if (icon && SoundFX.muted) icon.textContent = '🔇';
};
