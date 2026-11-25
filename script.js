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

const TRADES = [
  // Upgrades
  { fc: 6, tc: 1, fa: 'krolik',   ta: 'owca'     },
  { fc: 2, tc: 1, fa: 'owca',     ta: 'swinia'   },
  { fc: 3, tc: 1, fa: 'swinia',   ta: 'krowa'    },
  { fc: 2, tc: 1, fa: 'krowa',    ta: 'kon'      },
  // Guard Dogs
  { fc: 1, tc: 1, fa: 'owca',     ta: 'malyPies' },
  { fc: 1, tc: 1, fa: 'krowa',    ta: 'duzyPies' },
  // Downgrades & Dog returns
  { fc: 1, tc: 6, fa: 'owca',     ta: 'krolik'   },
  { fc: 1, tc: 2, fa: 'swinia',   ta: 'owca'     },
  { fc: 1, tc: 3, fa: 'krowa',    ta: 'swinia'   },
  { fc: 1, tc: 2, fa: 'kon',      ta: 'krowa'    },
  { fc: 1, tc: 1, fa: 'malyPies', ta: 'owca'     },
  { fc: 1, tc: 1, fa: 'duzyPies', ta: 'krowa'    },
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
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
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
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);
      gain.gain.setValueAtTime(0.14, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.24);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.26);
    });
  }

  playTrade() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [987.77, 1318.51].forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.08);
      gain.gain.setValueAtTime(0.16, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
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
    osc.frequency.exponentialRampToValueAtTime(65, now + 0.55);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.65);
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
    osc.frequency.linearRampToValueAtTime(700, now + 0.14);
    osc.frequency.linearRampToValueAtTime(300, now + 0.32);
    gain.gain.setValueAtTime(0.16, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [
      { f: [523.25, 659.25, 783.99], t: 0 },
      { f: [587.33, 698.46, 880.00], t: 0.2 },
      { f: [659.25, 783.99, 987.77], t: 0.4 },
      { f: [783.99, 987.77, 1318.51, 1567.98], t: 0.65 },
    ].forEach(c => {
      c.f.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + c.t);
        gain.gain.setValueAtTime(0.11, now + c.t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + 0.65);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + c.t);
        osc.stop(now + c.t + 0.7);
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
    gain.gain.setValueAtTime(0.05, now);
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
  mode: '2p',
  names: ['Player 1', 'Player 2'],
  herd: null,
  farms: [null, null],
  currentPlayer: 0,
  phase: 'BEFORE_ROLL',  // 'BEFORE_ROLL' | 'AFTER_ROLL'
  showAllTrades: false,
  gameOver: false,
  rolling: false,
};

let selectedMode = '2p';
let selectedOnlineTab = 'create';

// =============================================================================
//  ONLINE MULTIPLAYER (MQTT over WebSockets — Works on 4G/Wi-Fi & Static Hosts)
// =============================================================================

const MQTT_BROKERS = [
  'wss://broker.emqx.io:8084/mqtt',
  'wss://broker.hivemq.com:8884/mqtt',
];
const ROOM_TOPIC_PREFIX = 'superfarmer-game-v2/room/';

let net = {
  client: null,
  topic: '',
  senderId: '',
  peerSenderId: '',
  isHost: false,
  myPlayerIdx: 0,
  roomCode: '',
  connected: false,
  inMatch: false,
  disconnectedMidGame: false,
  joinTimeout: null,
  helloInterval: null,
  msgCounter: 0,
  seenMsgIds: new Set(),
  startingPlayerNext: 0,
};

function isMyTurn() {
  if (state.mode === 'ai') return state.currentPlayer === 0;
  if (state.mode === 'online') return net.connected && state.currentPlayer === net.myPlayerIdx;
  return true;
}

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function makeSenderId() {
  return 'sf_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);
}

function nextMsgId() {
  net.msgCounter += 1;
  return `${net.senderId}_${net.msgCounter}`;
}

function setOnlineStatus(msg, type = '') {
  const el = document.getElementById('onlineStatus');
  if (!el) return;
  if (!msg) {
    el.style.display = 'none';
    el.textContent = '';
    el.className = 'online-status';
    return;
  }
  el.style.display = 'block';
  el.textContent = msg;
  el.className = `online-status ${type}`.trim();
}

function sendNet(payload) {
  if (net.client && net.client.connected && net.topic) {
    try {
      const envelope = {
        ...payload,
        senderId: net.senderId,
        msgId: nextMsgId(),
      };
      net.client.publish(net.topic, JSON.stringify(envelope), { qos: 1 });
    } catch (err) {
      console.error('Failed to send network message:', err);
    }
  }
}

function cleanupOnlineSession(notifyPeer = true) {
  if (net.joinTimeout) {
    clearTimeout(net.joinTimeout);
    net.joinTimeout = null;
  }
  if (net.helloInterval) {
    clearInterval(net.helloInterval);
    net.helloInterval = null;
  }
  if (notifyPeer && net.client && net.client.connected && net.topic && net.inMatch) {
    sendNet({ type: 'LEAVE' });
  }
  if (net.client) {
    const oldClient = net.client;
    net.client = null;
    try { oldClient.end(true); } catch (_) {}
  }
  net.topic = '';
  net.senderId = '';
  net.peerSenderId = '';
  net.connected = false;
  net.inMatch = false;
  net.disconnectedMidGame = false;
  net.roomCode = '';
  net.isHost = false;
  net.myPlayerIdx = 0;
  net.msgCounter = 0;
  net.seenMsgIds.clear();

  // Reset lobby UI elements
  const waitBox = document.getElementById('roomWaitingBox');
  const createBtn = document.getElementById('btnCreateRoom');
  const tabs = document.getElementById('onlineTabs');
  const joinBtn = document.getElementById('btnJoinRoom');
  if (waitBox) waitBox.style.display = 'none';
  if (createBtn) { createBtn.style.display = 'block'; createBtn.disabled = false; createBtn.textContent = '🌐 CREATE ROOM'; }
  if (tabs) tabs.style.display = 'grid';
  if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = '🚀 JOIN ROOM'; }
  setOnlineStatus('');
}

function selectOnlineTab(tab) {
  selectedOnlineTab = tab;
  SoundFX.playClick();
  if (net.client) cleanupOnlineSession(false);

  document.getElementById('tabCreate').classList.toggle('active', tab === 'create');
  document.getElementById('tabJoin').classList.toggle('active', tab === 'join');
  document.getElementById('onlineCreateView').style.display = tab === 'create' ? 'flex' : 'none';
  document.getElementById('onlineJoinView').style.display = tab === 'join' ? 'flex' : 'none';
  setOnlineStatus('');
}

function cancelOnlineLobby() {
  SoundFX.playClick();
  cleanupOnlineSession(false);
}

function connectMqttBroker(brokerIdx, roomTopic, onReady, onFail) {
  const brokerUrl = MQTT_BROKERS[brokerIdx];
  const senderId = net.senderId;
  let settled = false;

  const client = mqtt.connect(brokerUrl, {
    clientId: senderId,
    clean: true,
    connectTimeout: 6000,
    reconnectPeriod: 3000,
    keepalive: 25,
    will: {
      topic: roomTopic,
      payload: JSON.stringify({ type: 'LEAVE', senderId, msgId: 'will_' + senderId }),
      qos: 1,
      retain: false,
    },
  });

  net.client = client;

  const connectGuard = setTimeout(() => {
    if (!settled) {
      settled = true;
      try { client.end(true); } catch (_) {}
      if (net.client === client) net.client = null;
      onFail('timeout');
    }
  }, 6500);

  client.on('connect', () => {
    if (net.client !== client) return;
    client.subscribe(roomTopic, { qos: 1 }, (err) => {
      if (settled) return;
      clearTimeout(connectGuard);
      settled = true;
      if (err) {
        try { client.end(true); } catch (_) {}
        if (net.client === client) net.client = null;
        onFail('subscribe-error');
        return;
      }
      onReady(client);
    });
  });

  client.on('message', (topic, message) => {
    if (net.client !== client || topic !== roomTopic) return;
    let msg;
    try {
      msg = JSON.parse(message.toString());
    } catch (_) {
      return;
    }
    if (!msg || typeof msg !== 'object') return;
    if (msg.senderId === net.senderId) return;
    if (msg.msgId) {
      if (net.seenMsgIds.has(msg.msgId)) return;
      net.seenMsgIds.add(msg.msgId);
      if (net.seenMsgIds.size > 300) {
        const first = net.seenMsgIds.values().next().value;
        net.seenMsgIds.delete(first);
      }
    }
    handleNetMessage(msg);
  });

  client.on('error', () => {
    if (!settled) {
      clearTimeout(connectGuard);
      settled = true;
      try { client.end(true); } catch (_) {}
      if (net.client === client) net.client = null;
      onFail('network-error');
    }
  });
}

function createOnlineRoom(brokerIdx = 0) {
  SoundFX.init();
  SoundFX.playClick();

  if (typeof mqtt === 'undefined') {
    setOnlineStatus('Online library failed to load. Check your internet connection.', 'error');
    return;
  }

  cleanupOnlineSession(false);
  const baseCode = generateRoomCode();
  const displayCode = brokerIdx === 0 ? baseCode : `2${baseCode}`;
  const roomTopic = ROOM_TOPIC_PREFIX + displayCode;

  net.isHost = true;
  net.myPlayerIdx = 0;
  net.roomCode = displayCode;
  net.topic = roomTopic;
  net.senderId = makeSenderId();

  const createBtn = document.getElementById('btnCreateRoom');
  createBtn.disabled = true;
  createBtn.textContent = '⏳ Creating room...';
  setOnlineStatus('Connecting to game server...');

  connectMqttBroker(
    brokerIdx,
    roomTopic,
    () => {
      setOnlineStatus('');
      document.getElementById('onlineTabs').style.display = 'none';
      createBtn.style.display = 'none';
      document.getElementById('roomCodeDisplay').textContent = displayCode;
      document.getElementById('roomWaitingBox').style.display = 'flex';
    },
    () => {
      if (brokerIdx + 1 < MQTT_BROKERS.length) {
        createOnlineRoom(brokerIdx + 1);
      } else {
        cleanupOnlineSession(false);
        setOnlineStatus('Could not connect to online server. Please try again.', 'error');
      }
    }
  );
}

function joinOnlineRoom() {
  SoundFX.init();
  SoundFX.playClick();

  if (typeof mqtt === 'undefined') {
    setOnlineStatus('Online library failed to load. Check your internet connection.', 'error');
    return;
  }

  const input = document.getElementById('joinRoomCodeInput');
  const rawCode = (input.value || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (rawCode.length < 4) {
    setOnlineStatus('Please enter a valid room code.', 'error');
    input.focus();
    return;
  }

  cleanupOnlineSession(false);
  const brokerIdx = rawCode.length === 6 && rawCode.startsWith('2') ? 1 : 0;
  const roomTopic = ROOM_TOPIC_PREFIX + rawCode;

  net.isHost = false;
  net.myPlayerIdx = 1;
  net.roomCode = rawCode;
  net.topic = roomTopic;
  net.senderId = makeSenderId();

  const joinBtn = document.getElementById('btnJoinRoom');
  joinBtn.disabled = true;
  joinBtn.textContent = '⏳ Joining...';
  setOnlineStatus(`Connecting to room ${rawCode}...`);

  net.joinTimeout = setTimeout(() => {
    if (!net.inMatch) {
      cleanupOnlineSession(false);
      setOnlineStatus(`Room ${rawCode} not found. Make sure the host is waiting.`, 'error');
    }
  }, 12000);

  connectMqttBroker(
    brokerIdx,
    roomTopic,
    () => {
      const myName = document.getElementById('player1Name').value.trim() || 'Player 2';
      setOnlineStatus(`Connected to server — waiting for host of ${rawCode}...`);
      sendNet({ type: 'HELLO', name: myName });
      net.helloInterval = setInterval(() => {
        if (net.inMatch || !net.client) {
          clearInterval(net.helloInterval);
          net.helloInterval = null;
          return;
        }
        sendNet({ type: 'HELLO', name: myName });
      }, 1800);
    },
    () => {
      cleanupOnlineSession(false);
      setOnlineStatus('Could not connect to online server. Please try again.', 'error');
    }
  );
}

function handlePeerDisconnect(reasonText) {
  if (state.mode !== 'online') return;
  if (!net.connected && !net.disconnectedMidGame) return;

  net.connected = false;
  net.disconnectedMidGame = true;

  const pill = document.getElementById('onlineRoomPill');
  if (pill) {
    pill.textContent = '🔴 Disconnected';
    pill.classList.add('disconnected');
  }
  const banner = document.getElementById('disconnectBanner');
  const bannerText = document.getElementById('disconnectBannerText');
  if (banner && bannerText) {
    bannerText.textContent = reasonText;
    banner.style.display = 'flex';
  }
  log(reasonText, 'bad');
  updateTurnUI();
  setupExchangeUI();
}

function handleNetMessage(msg) {
  switch (msg.type) {
    case 'HELLO': {
      if (!net.isHost) return;
      if (net.inMatch && net.peerSenderId && net.peerSenderId !== msg.senderId) {
        sendNet({ type: 'ROOM_FULL', target: msg.senderId });
        return;
      }
      if (net.inMatch && net.peerSenderId === msg.senderId) {
        // Guest retried HELLO before receiving START_GAME — re-send START_GAME
        sendNet({
          type: 'START_GAME',
          names: state.names,
          startingPlayer: state.currentPlayer,
          target: msg.senderId,
        });
        return;
      }
      net.peerSenderId = msg.senderId;
      net.connected = true;
      net.inMatch = true;
      net.disconnectedMidGame = false;
      net.startingPlayerNext = 0;

      const hostName = document.getElementById('player1Name').value.trim() || 'Player 1';
      const guestName = (msg.name || '').trim().slice(0, 16) || 'Player 2';
      startOnlineMatch(hostName, guestName, 0);
      sendNet({
        type: 'START_GAME',
        names: [hostName, guestName],
        startingPlayer: 0,
        target: msg.senderId,
      });
      break;
    }

    case 'ROOM_FULL': {
      if (net.isHost || net.inMatch) return;
      if (msg.target && msg.target !== net.senderId) return;
      cleanupOnlineSession(false);
      setOnlineStatus('This room is already full.', 'error');
      break;
    }

    case 'START_GAME': {
      if (net.isHost) return;
      if (msg.target && msg.target !== net.senderId) return;
      if (net.joinTimeout) {
        clearTimeout(net.joinTimeout);
        net.joinTimeout = null;
      }
      if (net.helloInterval) {
        clearInterval(net.helloInterval);
        net.helloInterval = null;
      }
      net.peerSenderId = msg.senderId;
      net.connected = true;
      net.inMatch = true;
      net.disconnectedMidGame = false;
      startOnlineMatch(msg.names[0], msg.names[1], msg.startingPlayer || 0);
      break;
    }

    case 'ROLL': {
      if (state.mode !== 'online' || state.gameOver) return;
      if (net.peerSenderId && msg.senderId !== net.peerSenderId) return;
      executeThrow(msg.playerIdx, msg.r1, msg.r2);
      break;
    }

    case 'TRADE': {
      if (state.mode !== 'online' || state.gameOver) return;
      if (net.peerSenderId && msg.senderId !== net.peerSenderId) return;
      executeExchange(msg.fc, msg.tc, msg.fa, msg.ta, true);
      break;
    }

    case 'END_TURN': {
      if (state.mode !== 'online' || state.gameOver) return;
      if (net.peerSenderId && msg.senderId !== net.peerSenderId) return;
      advanceTurn(true, msg.stateSync || null);
      break;
    }

    case 'REMATCH_REQUEST': {
      if (!net.isHost || !net.connected) return;
      if (net.peerSenderId && msg.senderId !== net.peerSenderId) return;
      net.startingPlayerNext = net.startingPlayerNext === 0 ? 1 : 0;
      startOnlineMatch(state.names[0], state.names[1], net.startingPlayerNext);
      sendNet({
        type: 'START_GAME',
        names: [state.names[0], state.names[1]],
        startingPlayer: net.startingPlayerNext,
        target: net.peerSenderId,
      });
      break;
    }

    case 'LEAVE': {
      if (!net.inMatch) return;
      if (net.peerSenderId && msg.senderId !== net.peerSenderId) return;
      handlePeerDisconnect('⚠️ Opponent left the game.');
      break;
    }
  }
}

function startOnlineMatch(name1, name2, startingPlayer = 0) {
  state = {
    mode: 'online',
    names: [name1, name2],
    herd: makeFarm(true),
    farms: [makeFarm(), makeFarm()],
    currentPlayer: startingPlayer,
    phase: 'BEFORE_ROLL',
    showAllTrades: false,
    gameOver: false,
    rolling: false,
  };

  // Clear invite ?room= param from URL bar cleanly without reloading
  if (window.history && window.history.replaceState && window.location.search.includes('room=')) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  document.getElementById('winnerScreen').style.display = 'none';
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'flex';
  document.getElementById('disconnectBanner').style.display = 'none';

  const pill = document.getElementById('onlineRoomPill');
  if (pill) {
    pill.textContent = `🟢 Online · ${net.roomCode}`;
    pill.classList.remove('disconnected');
    pill.style.display = 'inline-flex';
  }

  document.getElementById('p1Label').textContent = net.myPlayerIdx === 0 ? `${name1} (You)` : name1;
  document.getElementById('p2Label').textContent = net.myPlayerIdx === 1 ? `${name2} (You)` : name2;
  document.getElementById('p2Avatar').textContent = '🧑‍🌾';

  document.getElementById('diceResult').textContent = isMyTurn()
    ? 'Your turn — roll the dice!'
    : `Waiting for ${state.names[state.currentPlayer]} to roll...`;
  document.getElementById('diceSubText').textContent = '';
  document.getElementById('die1').querySelector('.die-face').textContent = '🎲';
  document.getElementById('die2').querySelector('.die-face').textContent = '🎲';
  document.getElementById('logContent').innerHTML = '';
  document.getElementById('toggleAllTradesBtn').textContent = 'Show all rates ▾';

  renderAll();
  log(`🌐 Online match started (Room ${net.roomCode}) — ${playerTag(startingPlayer)} goes first`, 'info');
}

function copyTextToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      setOnlineStatus(successMsg, 'success');
    }).catch(() => {
      fallbackCopy(text, successMsg);
    });
  } else {
    fallbackCopy(text, successMsg);
  }
}

function fallbackCopy(text, successMsg) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand('copy');
    setOnlineStatus(successMsg, 'success');
  } catch (_) {
    setOnlineStatus(`Copy manually: ${text}`, '');
  }
  document.body.removeChild(ta);
}

function copyRoomCode() {
  SoundFX.playClick();
  if (!net.roomCode) return;
  copyTextToClipboard(net.roomCode, `Room code "${net.roomCode}" copied!`);
}

function copyInviteLink() {
  SoundFX.playClick();
  if (!net.roomCode) return;
  const baseUrl = window.location.origin && window.location.origin !== 'null'
    ? `${window.location.origin}${window.location.pathname}`
    : window.location.href.split('?')[0];
  const inviteUrl = `${baseUrl}?room=${net.roomCode}`;
  copyTextToClipboard(inviteUrl, 'Invite link copied! Send it to your friend.');
}

// =============================================================================
//  START SCREEN & TOGGLES
// =============================================================================

function selectMode(mode) {
  if (selectedMode === 'online' && mode !== 'online') {
    cleanupOnlineSession(false);
  }
  selectedMode = mode;
  SoundFX.playClick();
  document.getElementById('mode2p').classList.toggle('selected', mode === '2p');
  document.getElementById('modeOnline').classList.toggle('selected', mode === 'online');
  document.getElementById('modeAI').classList.toggle('selected', mode === 'ai');

  const p1Label = document.getElementById('player1NameLabel');
  if (p1Label) {
    p1Label.innerHTML = mode === 'online'
      ? '<span class="label-dot p1-dot"></span> Your Name'
      : '<span class="label-dot p1-dot"></span> Player 1';
  }
  document.getElementById('player2NameWrap').style.display = mode === '2p' ? 'flex' : 'none';
  document.getElementById('onlinePanel').style.display = mode === 'online' ? 'flex' : 'none';
  document.getElementById('localStartBtn').style.display = mode === 'online' ? 'none' : 'block';
}

function startGame() {
  SoundFX.init();
  SoundFX.playClick();

  const name1 = document.getElementById('player1Name').value.trim() || 'Player 1';
  const name2 = selectedMode === 'ai' ? 'Computer' : (document.getElementById('player2Name').value.trim() || 'Player 2');

  state = {
    mode: selectedMode,
    names: [name1, name2],
    herd: makeFarm(true),
    farms: [makeFarm(), makeFarm()],
    currentPlayer: 0,
    phase: 'BEFORE_ROLL',
    showAllTrades: false,
    gameOver: false,
    rolling: false,
  };

  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'flex';
  document.getElementById('disconnectBanner').style.display = 'none';
  document.getElementById('onlineRoomPill').style.display = 'none';

  document.getElementById('p1Label').textContent = name1;
  document.getElementById('p2Label').textContent = name2;
  document.getElementById('p2Avatar').textContent = selectedMode === 'ai' ? '🤖' : '🧑‍🌾';

  document.getElementById('diceResult').textContent = `${name1}, roll the dice!`;
  document.getElementById('diceSubText').textContent = '';
  document.getElementById('die1').querySelector('.die-face').textContent = '🎲';
  document.getElementById('die2').querySelector('.die-face').textContent = '🎲';
  document.getElementById('logContent').innerHTML = '';
  document.getElementById('toggleAllTradesBtn').textContent = 'Show all rates ▾';

  renderAll();
  log(`🌾 Game started — ${playerTag(0)} goes first`, 'info');
}

function toggleSound() {
  const isMuted = SoundFX.toggleMute();
  const icon = document.getElementById('soundIcon');
  if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
  if (!isMuted) SoundFX.playClick();
}

function toggleBank() {
  SoundFX.playClick();
  const strip = document.getElementById('bankStrip');
  const btn = document.getElementById('bankToggleBtn');
  const open = strip.style.display === 'none';
  strip.style.display = open ? 'flex' : 'none';
  btn.classList.toggle('active', open);
}

function toggleHistory() {
  const drawer = document.getElementById('historyDrawer');
  const btn = document.getElementById('historyToggleBtn');
  const open = drawer.style.display === 'none';
  drawer.style.display = open ? 'block' : 'none';
  btn.textContent = open ? 'Hide ▴' : 'History ▾';
}

function toggleShowAllTrades() {
  SoundFX.playClick();
  state.showAllTrades = !state.showAllTrades;
  document.getElementById('toggleAllTradesBtn').textContent =
    state.showAllTrades ? 'Available only ▴' : 'Show all rates ▾';
  setupExchangeUI();
}

// =============================================================================
//  RENDERING UI
// =============================================================================

function renderAll() {
  renderHerd();
  renderFarm(0);
  renderFarm(1);
  updateTurnUI();
  setupExchangeUI();
}

function renderHerd() {
  const el = document.getElementById('herdDisplay');
  el.innerHTML = '';
  for (const k in ANIMALS) {
    const a = ANIMALS[k];
    el.innerHTML += `
      <span class="bank-pill ${state.herd[k] === 0 ? 'empty' : ''}" id="slot-herd-${k}" title="${a.name} in Bank">
        ${a.emoji} <span id="herd-${k}">${state.herd[k]}</span>
      </span>`;
  }
}

function renderFarm(playerIdx) {
  const pNum = playerIdx + 1;
  const el = document.getElementById(`p${pNum}-farm`);
  el.innerHTML = '';

  WIN_ANIMALS.forEach(k => {
    const a = ANIMALS[k];
    const count = state.farms[playerIdx][k];
    const owned = count > 0;
    el.innerHTML += `
      <div class="species-slot ${owned ? 'owned' : ''}" id="slot-p${pNum}-${k}" title="${a.name}">
        <span class="species-check" id="p${pNum}-check-${k}">✅</span>
        <span class="species-emoji">${a.emoji}</span>
        <span class="species-count" id="p${pNum}-${k}">${count}</span>
      </div>`;
  });

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
      if (fEl) fEl.textContent = count;

      if (ANIMALS[k].isWinTarget) {
        const fSlot = document.getElementById(`slot-p${pNum}-${k}`);
        if (fSlot) fSlot.classList.toggle('owned', count > 0);
      }
    }
  }
  updatePlayerBadges(0);
  updatePlayerBadges(1);
  setupExchangeUI();
}

function updatePlayerBadges(playerIdx) {
  const pNum = playerIdx + 1;
  const farm = state.farms[playerIdx];

  const winCount = WIN_ANIMALS.filter(k => farm[k] > 0).length;
  document.getElementById(`p${pNum}-progress-label`).textContent = `${winCount} / 5`;
  document.getElementById(`p${pNum}-progress`).style.width = `${(winCount / 5) * 100}%`;

  const foxPill = document.getElementById(`slot-p${pNum}-malyPies`);
  const wolfPill = document.getElementById(`slot-p${pNum}-duzyPies`);
  if (foxPill) foxPill.classList.toggle('active-def', farm.malyPies > 0);
  if (wolfPill) wolfPill.classList.toggle('active-def', farm.duzyPies > 0);
  document.getElementById(`p${pNum}-malyPies`).textContent = farm.malyPies;
  document.getElementById(`p${pNum}-duzyPies`).textContent = farm.duzyPies;
}

function updateTurnUI() {
  const p = state.currentPlayer;
  const name = state.names[p];
  const isAI = state.mode === 'ai' && p === 1;
  const isOnline = state.mode === 'online';
  const canAct = isMyTurn();

  const gameScreen = document.getElementById('gameScreen');
  gameScreen.classList.toggle('turn-p1', p === 0);
  gameScreen.classList.toggle('turn-p2', p === 1);

  if (isOnline) {
    document.getElementById('turnBadgeText').textContent = canAct ? 'Your Turn' : `${name}'s Turn`;
  } else {
    document.getElementById('turnBadgeText').textContent = isAI ? `🤖 ${name}'s Turn` : `${name}'s Turn`;
  }

  document.getElementById('p1Card').classList.toggle('active', p === 0);
  document.getElementById('p2Card').classList.toggle('active', p === 1);

  document.getElementById('p1TurnTag').textContent = p === 0 ? 'TURN' : 'WAIT';
  document.getElementById('p2TurnTag').textContent = p === 1 ? (isAI ? 'AI' : 'TURN') : 'WAIT';

  document.getElementById('marketOwnerPill').textContent = name;
  document.getElementById('exchangeSection').classList.toggle('locked', !canAct || state.rolling || state.gameOver);

  // Single primary action button — impossible to click the wrong one!
  const btn = document.getElementById('primaryActionBtn');
  btn.classList.remove('mode-roll', 'mode-end', 'mode-ai');

  if (isOnline && !net.connected) {
    btn.classList.add('mode-ai');
    btn.textContent = '🔴 Opponent Disconnected';
    btn.disabled = true;
  } else if (isAI) {
    btn.classList.add('mode-ai');
    btn.textContent = '🤖 AI is playing...';
    btn.disabled = true;
  } else if (isOnline && !canAct) {
    btn.classList.add('mode-ai');
    btn.textContent = state.rolling ? `🎲 ${name} is rolling...` : `⏳ Waiting for ${name}...`;
    btn.disabled = true;
  } else if (state.phase === 'BEFORE_ROLL') {
    btn.classList.add('mode-roll');
    btn.textContent = state.rolling ? '🎲 Rolling...' : '🎲 ROLL DICE';
    btn.disabled = state.rolling || state.gameOver;
  } else {
    btn.classList.add('mode-end');
    btn.textContent = '➡️ END TURN';
    btn.disabled = state.rolling || state.gameOver;
  }
}

// =============================================================================
//  FLOATING DELTAS & LOGGING
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

  setTimeout(() => delta.remove(), 1100);
}

function playerTag(playerIdx) {
  const cls = playerIdx === 0 ? 'p1' : 'p2';
  return `<span class="log-player-tag ${cls}">${state.names[playerIdx]}</span>`;
}

function log(msg, type = '') {
  const lastMove = document.getElementById('lastMoveText');
  if (lastMove) lastMove.innerHTML = msg;

  const box = document.getElementById('logContent');
  if (!box) return;
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.innerHTML = msg;
  box.prepend(div);
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

function handlePrimaryAction() {
  if (state.gameOver || state.rolling) return;
  if (!isMyTurn()) return;

  if (state.phase === 'BEFORE_ROLL') {
    const r1 = rollDie(CUBE1);
    const r2 = rollDie(CUBE2);
    if (state.mode === 'online') {
      sendNet({ type: 'ROLL', playerIdx: state.currentPlayer, r1, r2 });
    }
    executeThrow(state.currentPlayer, r1, r2);
  } else {
    SoundFX.playClick();
    advanceTurn(false);
  }
}

function executeThrow(playerIdx, forcedR1 = null, forcedR2 = null) {
  state.rolling = true;
  SoundFX.playRoll();
  updateTurnUI();

  const die1El = document.getElementById('die1');
  const die2El = document.getElementById('die2');
  die1El.classList.add('rolling');
  die2El.classList.add('rolling');
  die1El.querySelector('.die-face').textContent = '🎲';
  die2El.querySelector('.die-face').textContent = '🎲';

  setTimeout(() => {
    const r1 = forcedR1 !== null ? forcedR1 : rollDie(CUBE1);
    const r2 = forcedR2 !== null ? forcedR2 : rollDie(CUBE2);

    die1El.classList.remove('rolling');
    die2El.classList.remove('rolling');
    die1El.querySelector('.die-face').textContent = getAnimalEmoji(r1);
    die2El.querySelector('.die-face').textContent = getAnimalEmoji(r2);

    processRoll(playerIdx, r1, r2);

    state.rolling = false;
    state.phase = 'AFTER_ROLL';
    updateCounts();
    updateTurnUI();

    if (!state.gameOver) checkWin(playerIdx);
  }, 540);
}

function processRoll(playerIdx, r1, r2) {
  const farm = state.farms[playerIdx];
  const pNum = playerIdx + 1;
  const resultEl = document.getElementById('diceResult');
  const subEl = document.getElementById('diceSubText');

  const isWolf = (r1 === 'wilk');
  const isFox = (r2 === 'lis');

  if (isWolf || isFox) {
    let msgs = [];
    if (isWolf) msgs.push(handleWolf(playerIdx));
    if (isFox)  msgs.push(handleFox(playerIdx));
    resultEl.textContent = msgs.join(' · ');
    subEl.textContent = '';
    return;
  }

  const rolledCounts = {};
  [r1, r2].forEach(r => rolledCounts[r] = (rolledCounts[r] || 0) + 1);

  let gainedList = [];
  for (const animal in rolledCounts) {
    const sum = (farm[animal] || 0) + rolledCounts[animal];
    const toAdd = Math.floor(sum / 2);
    if (toAdd > 0) {
      const actualAdd = Math.min(toAdd, state.herd[animal]);
      if (actualAdd > 0) {
        farm[animal] += actualAdd;
        state.herd[animal] -= actualAdd;
        gainedList.push(`+${actualAdd} ${ANIMALS[animal].emoji}`);
        showFloatingDelta(`slot-p${pNum}-${animal}`, `+${actualAdd} ${ANIMALS[animal].emoji}`, true);
      }
    }
  }

  if (gainedList.length > 0) {
    SoundFX.playGain();
    resultEl.textContent = `Gained ${gainedList.join('  ')}`;
    subEl.textContent = isMyTurn() ? 'Trade below or click End Turn' : `${state.names[playerIdx]} is deciding...`;
    log(`${playerTag(playerIdx)} rolled ${getAnimalEmoji(r1)}${getAnimalEmoji(r2)} ➔ <strong>${gainedList.join(', ')}</strong>`, 'good');
  } else {
    resultEl.textContent = 'No new pairs';
    subEl.textContent = isMyTurn() ? 'Need 2 of a kind (farm + dice)' : `${state.names[playerIdx]} is deciding...`;
    log(`${playerTag(playerIdx)} rolled ${getAnimalEmoji(r1)}${getAnimalEmoji(r2)} — no pairs`, '');
  }
}

function handleWolf(playerIdx) {
  const farm = state.farms[playerIdx];
  const pNum = playerIdx + 1;
  SoundFX.playWolf();

  if (farm.duzyPies > 0) {
    state.herd.duzyPies++;
    farm.duzyPies--;
    showFloatingDelta(`slot-p${pNum}-duzyPies`, '-1 🐩', false);
    log(`${playerTag(playerIdx)} 🐺 Wolf blocked by Big Dog 🐩!`, 'good');
    return '🛡️ Big Dog stopped the Wolf!';
  } else {
    let lost = [];
    for (const k in farm) {
      if (k !== 'kon' && k !== 'duzyPies' && farm[k] > 0) {
        state.herd[k] += farm[k];
        lost.push(`${farm[k]}${ANIMALS[k].emoji}`);
        showFloatingDelta(`slot-p${pNum}-${k}`, `-${farm[k]} ${ANIMALS[k].emoji}`, false);
        farm[k] = 0;
      }
    }
    log(`${playerTag(playerIdx)} 🐺 Wolf attack! ${lost.length ? 'Lost ' + lost.join(', ') : 'Farm was empty'}`, 'bad');
    return lost.length ? '🐺 Wolf ate your herd!' : '🐺 Wolf found nothing';
  }
}

function handleFox(playerIdx) {
  const farm = state.farms[playerIdx];
  const pNum = playerIdx + 1;
  SoundFX.playFox();

  if (farm.malyPies > 0) {
    state.herd.malyPies++;
    farm.malyPies--;
    showFloatingDelta(`slot-p${pNum}-malyPies`, '-1 🐕', false);
    log(`${playerTag(playerIdx)} 🦊 Fox blocked by Small Dog 🐕!`, 'good');
    return '🛡️ Small Dog stopped the Fox!';
  } else {
    const lost = farm.krolik;
    state.herd.krolik += lost;
    farm.krolik = 0;
    if (lost > 0) showFloatingDelta(`slot-p${pNum}-krolik`, `-${lost} 🐰`, false);
    log(`${playerTag(playerIdx)} 🦊 Fox attack! ${lost ? `Lost ${lost}🐰` : 'No rabbits'}`, 'bad');
    return lost ? `🦊 Fox ate ${lost} 🐰!` : '🦊 Fox found no rabbits';
  }
}

function advanceTurn(fromRemote = false, stateSync = null) {
  if (stateSync && stateSync.herd && stateSync.farms) {
    state.herd = { ...stateSync.herd };
    state.farms = [{ ...stateSync.farms[0] }, { ...stateSync.farms[1] }];
  }

  state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
  state.phase = 'BEFORE_ROLL';

  if (!fromRemote && state.mode === 'online') {
    sendNet({
      type: 'END_TURN',
      stateSync: {
        herd: { ...state.herd },
        farms: [{ ...state.farms[0] }, { ...state.farms[1] }],
      },
    });
  }

  updateCounts();
  updateTurnUI();

  const nextName = state.names[state.currentPlayer];
  const isAI = state.mode === 'ai' && state.currentPlayer === 1;
  if (state.mode === 'online') {
    document.getElementById('diceResult').textContent = isMyTurn()
      ? 'Your turn — roll the dice!'
      : `Waiting for ${nextName} to roll...`;
  } else {
    document.getElementById('diceResult').textContent = isAI ? `${nextName} is rolling...` : `${nextName}, roll the dice!`;
  }
  document.getElementById('diceSubText').textContent = '';

  if (isAI && !state.gameOver) {
    setTimeout(() => runAITurn(), 800);
  }
}

// =============================================================================
//  SMART TRADE BAR (1-CLICK CHIPS)
// =============================================================================

function setupExchangeUI() {
  const container = document.getElementById('exchangeTools');
  if (!container) return;
  container.innerHTML = '';

  const playerFarm = state.farms[state.currentPlayer];
  const canAct = isMyTurn() && !state.rolling && !state.gameOver;

  const enriched = TRADES.map(t => {
    const playerHas = playerFarm ? playerFarm[t.fa] : 0;
    const bankHas = state.herd ? state.herd[t.ta] : 0;
    const isAffordable = playerHas >= t.fc && bankHas >= t.tc;
    return { ...t, isAffordable };
  });

  const list = state.showAllTrades
    ? [...enriched].sort((a, b) => Number(b.isAffordable) - Number(a.isAffordable))
    : enriched.filter(t => t.isAffordable);

  if (list.length === 0) {
    container.innerHTML = `<span class="trade-empty">No trades available right now — roll the dice to collect animals.</span>`;
    return;
  }

  list.forEach(t => {
    const canClick = t.isAffordable && canAct;
    const btn = document.createElement('button');
    btn.className = `trade-chip ${t.isAffordable ? '' : 'disabled-chip'}`;
    btn.disabled = !canClick;
    btn.title = `Give ${t.fc} ${ANIMALS[t.fa].name} → Get ${t.tc} ${ANIMALS[t.ta].name}`;
    btn.onclick = () => executeExchange(t.fc, t.tc, t.fa, t.ta, false);
    btn.innerHTML = `
      <span class="chip-side"><span class="chip-num">${t.fc}</span><span class="chip-emoji">${ANIMALS[t.fa].emoji}</span></span>
      <span class="chip-arrow">➔</span>
      <span class="chip-side"><span class="chip-num">${t.tc}</span><span class="chip-emoji">${ANIMALS[t.ta].emoji}</span></span>
    `;
    container.appendChild(btn);
  });
}

function executeExchange(fc, tc, fa, ta, fromRemote = false) {
  if (state.gameOver || state.rolling) return;
  if (!fromRemote && !isMyTurn()) return;
  const p = state.currentPlayer;
  const farm = state.farms[p];
  const pNum = p + 1;

  if (farm[fa] < fc || state.herd[ta] < tc) return;

  farm[fa] -= fc;
  state.herd[fa] += fc;
  farm[ta] += tc;
  state.herd[ta] -= tc;

  if (!fromRemote && state.mode === 'online') {
    sendNet({ type: 'TRADE', fc, tc, fa, ta });
  }

  SoundFX.playTrade();
  showFloatingDelta(`slot-p${pNum}-${fa}`, `-${fc} ${ANIMALS[fa].emoji}`, false);
  showFloatingDelta(`slot-p${pNum}-${ta}`, `+${tc} ${ANIMALS[ta].emoji}`, true);

  log(`${playerTag(p)} traded ${fc}${ANIMALS[fa].emoji} ➔ ${tc}${ANIMALS[ta].emoji}`, 'trade');

  updateCounts();
  checkWin(p);
}

// =============================================================================
//  ARTIFICIAL INTELLIGENCE (AI)
// =============================================================================

function runAITurn() {
  if (state.gameOver || state.currentPlayer !== 1) return;

  setTimeout(() => {
    if (state.gameOver) return;
    smartAIExchange(1);

    setTimeout(() => {
      if (state.gameOver) return;
      executeThrow(1);

      setTimeout(() => {
        if (state.gameOver) return;
        smartAIExchange(1);
        setTimeout(() => {
          if (!state.gameOver) advanceTurn();
        }, 850);
      }, 1000);
    }, 700);
  }, 600);
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

    if (farm.owca >= 2 && farm.malyPies === 0 && state.herd.malyPies > 0) {
      farm.owca -= 1; state.herd.owca += 1;
      farm.malyPies += 1; state.herd.malyPies -= 1;
      log(`${playerTag(playerIdx)} traded 1🐑 ➔ 1🐕`, 'trade');
      changed = true; didTrade = true;
    }

    if (farm.krowa >= 2 && farm.duzyPies === 0 && state.herd.duzyPies > 0) {
      farm.krowa -= 1; state.herd.krowa += 1;
      farm.duzyPies += 1; state.herd.duzyPies -= 1;
      log(`${playerTag(playerIdx)} traded 1🐮 ➔ 1🐩`, 'trade');
      changed = true; didTrade = true;
    }

    for (let i = 0; i < order.length - 1; i++) {
      const from = order[i];
      const to = order[i + 1];
      const rate = rates[i];

      while (farm[from] >= rate && state.herd[to] >= 1) {
        farm[from] -= rate; state.herd[from] += rate;
        farm[to] += 1; state.herd[to] -= 1;
        log(`${playerTag(playerIdx)} traded ${rate}${ANIMALS[from].emoji} ➔ 1${ANIMALS[to].emoji}`, 'trade');
        changed = true; didTrade = true;
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
//  WIN CONDITION & MODALS
// =============================================================================

function checkWin(playerIdx) {
  const farm = state.farms[playerIdx];
  if (WIN_ANIMALS.every(a => farm[a] >= 1)) {
    state.gameOver = true;
    showWinner(state.names[playerIdx]);
    return true;
  }
  return false;
}

function showWinner(name) {
  SoundFX.playVictory();
  document.getElementById('winnerName').textContent = `${name} wins!`;

  const primaryBtn = document.getElementById('winnerPrimaryBtn');
  const menuBtn = document.getElementById('winnerMenuBtn');
  if (state.mode === 'online' && net.connected) {
    primaryBtn.textContent = '🔄 Rematch';
    primaryBtn.disabled = false;
    menuBtn.style.display = 'inline-block';
  } else {
    primaryBtn.textContent = '🔄 Play Again';
    primaryBtn.disabled = false;
    menuBtn.style.display = 'none';
  }

  document.getElementById('winnerScreen').style.display = 'flex';
  updateTurnUI();
  launchConfetti();
  log(`🏆 <strong>${name}</strong> won the game!`, 'good');
}

function handleWinnerPlayAgain() {
  SoundFX.playClick();
  if (state.mode === 'online' && net.connected) {
    if (net.isHost) {
      net.startingPlayerNext = net.startingPlayerNext === 0 ? 1 : 0;
      startOnlineMatch(state.names[0], state.names[1], net.startingPlayerNext);
      sendNet({
        type: 'START_GAME',
        names: [state.names[0], state.names[1]],
        startingPlayer: net.startingPlayerNext,
        target: net.peerSenderId,
      });
    } else {
      const primaryBtn = document.getElementById('winnerPrimaryBtn');
      primaryBtn.disabled = true;
      primaryBtn.textContent = '⏳ Starting rematch...';
      sendNet({ type: 'REMATCH_REQUEST' });
    }
  } else {
    restartToStartScreen();
  }
}

function restartToStartScreen() {
  if (state.mode === 'online' || net.client) {
    cleanupOnlineSession(true);
  }
  document.getElementById('winnerScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'none';
  document.getElementById('disconnectBanner').style.display = 'none';
  document.getElementById('onlineRoomPill').style.display = 'none';
  document.getElementById('startScreen').style.display = 'flex';
}

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#f5c518', '#10e88a', '#38b6ff', '#a855f7', '#ff4757', '#ffffff'];
  const pieces = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 8 + Math.random() * 7,
    h: 6 + Math.random() * 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: Math.random() * Math.PI * 2,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 5,
    vr: (Math.random() - 0.5) * 0.2,
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
    });
    if (++frame < 360) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

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
  document.getElementById('confirmResetModal').style.display = 'flex';
}

function closeResetModal() {
  SoundFX.playClick();
  document.getElementById('confirmResetModal').style.display = 'none';
}

function closeResetOnBg(e) {
  if (e.target === document.getElementById('confirmResetModal')) closeResetModal();
}

function confirmResetGame() {
  closeResetModal();
  restartToStartScreen();
}

window.onload = function () {
  const icon = document.getElementById('soundIcon');
  if (icon && SoundFX.muted) icon.textContent = '🔇';

  // Auto-open Join Room if opened via an invite link (?room=XXXXX)
  const params = new URLSearchParams(window.location.search);
  const roomFromUrl = (params.get('room') || '').trim().toUpperCase();
  if (roomFromUrl) {
    selectMode('online');
    selectOnlineTab('join');
    const codeInput = document.getElementById('joinRoomCodeInput');
    if (codeInput) codeInput.value = roomFromUrl;
    setOnlineStatus(`Invited to room ${roomFromUrl}. Enter your name and click Join!`, 'success');
  }

  // Allow pressing Enter in room code input to join
  const codeInput = document.getElementById('joinRoomCodeInput');
  if (codeInput) {
    codeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') joinOnlineRoom();
    });
  }
};

window.addEventListener('beforeunload', () => {
  if (net.client && net.client.connected && net.inMatch) {
    sendNet({ type: 'LEAVE' });
  }
});
