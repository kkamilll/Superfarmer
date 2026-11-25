<div align="center">

# 🌾 Super Farmer

**A clean, responsive digital edition of the classic board game *Super Farmer***  
Play **locally**, **against AI**, or **online with a friend** directly in your browser — zero backend required.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![MQTT](https://img.shields.io/badge/Online-MQTT_over_WSS-660066?style=flat-square)
![Zero Backend](https://img.shields.io/badge/Backend-None-10b981?style=flat-square)

</div>

---

## 🎮 About the Game

**Super Farmer** is a faithful browser adaptation of the classic board game originally created in 1943 by Polish mathematician **Prof. Karol Borsuk** (as *Hodowla zwierzątek* / *Animal Husbandry*). Breed, trade, and grow your herd while protecting your farm from predators — the **Wolf** and the **Fox**.

The first farmer to collect at least **1 of each of the 5 main species** wins:  
🐰 **Rabbit** · 🐑 **Sheep** · 🐷 **Pig** · 🐮 **Cow** · 🐴 **Horse**

---

## 🕹️ Game Modes

- 👥 **Local 2P** — classic pass-and-play on a single device with custom player names.
- 🌐 **Online 2P (MQTT over WebSockets)** — play with a friend across Wi-Fi or 4G/5G on any static host (**Netlify**, **GitHub Pages**, **Vercel**) with no backend server or accounts:
  - **Create Room** generates a short room code and a direct **Invite Link** (`?room=CODE`) that auto-fills the join screen.
  - Uses public WebSocket MQTT brokers (`broker.emqx.io` with automatic failover to `broker.hivemq.com`).
  - Real-time synced dice rolls, trades, end-of-turn state sync, turn locking, disconnect detection, and one-click **Rematch** (alternating who goes first).
- 🤖 **vs AI** — computer opponent with automated upgrade trading and guard-dog defense logic.

---

## ✨ Features

- 🎲 **Authentic Two 12-Sided Dice (d12)** with animated rolls and distinct visual accents.
- 🔄 **Smart 1-Click Trade Bar** — shows only currently affordable trades by default, with a *Show all rates* toggle to view the full exchange list.
- 🛡️ **Guard Dog Defense** — visual protection badges for **Small Dog** (vs 🦊) and **Big Dog** (vs 🐺).
- 🏦 **Collapsible Bank Stock** — toggle the Bank strip at any time to check remaining animals.
- 📜 **Compact Move History** — single-line latest-move bar with an expandable full match log.
- 🎛️ **Quick Top-Bar Controls** — **Bank**, **Rules**, **Restart** (resets the match locally or for both online players), **Exit**, **Sound Mute** (saved in `localStorage`), and **Fullscreen** (`⛶`).
- 🔊 **Procedural Web Audio SFX** — synthesized sound effects for dice rolls, breeding gains, trades, wolf/fox attacks, UI clicks, and victory fanfare (no external audio files).
- 🎊 **Visual Polish** — dark glassmorphism UI, responsive layout, floating `+1 🐰` / `-1 🐕` delta indicators, and a Canvas confetti celebration on victory.

---

## 📜 Rules & Gameplay

### 🎯 Objective
Be the first farmer to have at least **1 animal of each of the 5 target species**:  
🐰 Rabbit · 🐑 Sheep · 🐷 Pig · 🐮 Cow · 🐴 Horse  
*(Guard dogs are defensive units and are not required to win.)*

### 🎲 Turn Flow
1. **Trade (optional):** Before or after rolling, perform any number of trades with the Bank using the Trade Bar.
2. **Roll Dice:** Click **ROLL DICE**.
3. **Breeding:** If no predator is rolled, add your farm animals + the dice showing each rolled species. For **every full pair (`floor(total / 2)`)**, receive **+1 new animal** from the Bank (up to the Bank's remaining stock).
   - *Example:* `0 🐰` on farm + roll `2 🐰` → `2` total (`1` pair) → **+1 🐰** (now `1`).
   - *Example:* `3 🐰` on farm + roll `1 🐰` → `4` total (`2` pairs) → **+2 🐰** (now `5`).
   - *Note:* If a **Wolf** or **Fox** is rolled, the predator attack resolves and no breeding occurs on that roll.
4. **End Turn:** Click **END TURN** to pass play to the next farmer.

### 🎲 Dice Composition (12 Faces Each)

| Die | Color | Faces |
| :--- | :--- | :--- |
| **Die 1** | Gold | 6× 🐰 Rabbit, 3× 🐑 Sheep, 1× 🐷 Pig, 1× 🐮 Cow, 1× 🐺 Wolf |
| **Die 2** | Blue | 6× 🐰 Rabbit, 2× 🐑 Sheep, 2× 🐷 Pig, 1× 🐴 Horse, 1× 🦊 Fox |

### 🏦 Starting Bank Stock

| 🐰 Rabbits | 🐑 Sheep | 🐷 Pigs | 🐮 Cows | 🐴 Horses | 🐕 Small Dogs | 🐩 Big Dogs |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **60** | **24** | **20** | **12** | **6** | **4** | **2** |

### 🔄 Exchange Rates

All trades with the Bank work in **both directions**:

| Give from Farm | Receive from Bank | Purpose |
| :--- | :--- | :--- |
| **6 🐰 Rabbits** | **1 🐑 Sheep** | Upgrade tier |
| **2 🐑 Sheep** | **1 🐷 Pig** | Upgrade tier |
| **3 🐷 Pigs** | **1 🐮 Cow** | Upgrade tier |
| **2 🐮 Cows** | **1 🐴 Horse** | Obtain the rarest victory species |
| **1 🐑 Sheep** | **1 🐕 Small Dog** | Defense against the Fox 🦊 |
| **1 🐮 Cow** | **1 🐩 Big Dog** | Defense against the Wolf 🐺 |

### 🐺 Predators

- 🐺 **Wolf (Die 1):** Eats all animals on your farm **except 🐴 Horses** (including Small Dogs), returning them to the Bank. Blocked by a 🐩 **Big Dog** (the Big Dog returns to the Bank instead).
- 🦊 **Fox (Die 2):** Eats all **🐰 Rabbits** on your farm, returning them to the Bank. Blocked by a 🐕 **Small Dog** (the Small Dog returns to the Bank instead).

---

## 🚀 Getting Started & Deployment

The project is 100% static HTML, CSS, and Vanilla JavaScript — no build step, package installation, or backend server required.

### Play Locally
```bash
git clone https://github.com/kkamilll/superfarmer.git
cd superfarmer
```
1. Open `index.html` in any modern browser.
2. Select a mode:
   - **Local 2P** or **vs AI**: enter player name(s) and click **PLAY** *(works offline)*.
   - **Online 2P**: enter your name, then click **CREATE ROOM** to share a code/link or **JOIN ROOM** with a friend's code *(requires internet access for MQTT over WSS)*.

### Deploy (Netlify / GitHub Pages / Vercel)
1. Push the repository to GitHub (or drag-and-drop the folder into [Netlify Drop](https://app.netlify.com/drop)).
2. Configure your host with **no build command** and publish directory `.` (repository root).
3. Share the deployed URL — friends can join directly via invite links (`https://your-site.example/?room=CODE`).

---

## 🗂️ Project Structure

```text
SuperFarmer/
├── index.html   # Semantic HTML5 layout, start screen, online lobby, board & modals
├── style.css    # Dark glassmorphism theme, responsive layout, dice & delta animations
├── script.js    # Game engine, MQTT WebSocket multiplayer, AI opponent, Web Audio synth
└── README.md    # Documentation, rules & deployment guide
```

---

<div align="center">
  Built as a modern digital tribute to the classic board game <strong>Super Farmer</strong> 🌾
</div>
