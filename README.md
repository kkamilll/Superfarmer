# 🌾 Super Farmer

> Digital adaptation of the classic board game **Super Farmer** (originally created in 1943 by mathematician Prof. Karol Borsuk as *Animal Husbandry*) — playable **locally**, **against AI**, or **online with a friend** directly in your browser with zero backend required!

---

## 🎮 About the Game

**Super Farmer** is a clean, responsive, and faithful digital edition of the classic board game. Breed, trade, and grow your herd while defending your farm from predators — the **Wolf** and the **Fox**.

The first farmer to collect at least **one of each of the 5 main species** wins:
🐰 **Rabbit**, 🐑 **Sheep**, 🐷 **Pig**, 🐮 **Cow**, and 🐴 **Horse**.

---

## ✨ Features & Highlights

- 🌐 **Online 2-Player Mode (MQTT over WebSockets)**:
  - Play with a friend over the internet (Wi-Fi, 4G/5G, mobile or desktop) on any static host (**Netlify**, GitHub Pages, Vercel) with **no backend server** or accounts required.
  - **Create Room** generates a short 5-character room code and a direct **Invite Link** (`?room=CODE`).
  - Real-time synced dice rolls, trades, turn locking, disconnect detection, and one-click **Rematch**.
- 👥 **Local 2-Player Mode** — pass & play on a single device.
- 🤖 **vs AI Mode** — computer opponent with smart trading and guard-dog defense logic.
- 🎲 **Authentic Two 12-Sided Dice (d12)**:
  - **Die 1 (Gold)**: 6 rabbits, 3 sheep, 1 pig, 1 cow, 1 wolf.
  - **Die 2 (Blue)**: 6 rabbits, 2 sheep, 2 pigs, 1 horse, 1 fox.
- 🔄 **Smart 1-Click Trade Bar** — automatically displays only currently available trades (with an optional *Show all rates* toggle).
- 🛡️ **Guard Dog Defense System**:
  - 🐕 **Small Dog** — blocks the Fox (🦊).
  - 🐩 **Big Dog** — blocks the Wolf (🐺).
- 🏦 **Collapsible Bank Stock** & **Compact Move History** with expandable full log.
- 🎛️ **Quick Game Controls** — top bar buttons for **Restart Match** (resets current match locally or for both online players), **Exit to Menu**, **Fullscreen** (`⛶`), **Sound Mute** (`🔊`/`🔇`), **Bank**, and **Rules**.
- 🔊 **Procedural Web Audio Sound Effects** — custom synthesized audio for dice rolls, breeding gains, trades, predators, and victory.
- 🎊 **Winner Screen & Confetti Celebration** + animated floating `+1 🐰` / `-1 🐕` deltas.
- 📖 **In-Game Rules Modal** with quick-reference exchange rates.

---

## 📜 Official Rules & Gameplay

### 🎯 Objective
Be the first farmer to collect at least **1 animal of each of the 5 target species**:  
🐰 Rabbit · 🐑 Sheep · 🐷 Pig · 🐮 Cow · 🐴 Horse.  
*(Guard dogs are defensive units and are not required to win).*

### 🎲 On Your Turn
1. **Before or after rolling**, you may perform trades with the Bank using the Trade Bar.
2. Click **ROLL DICE**.
3. **Breeding**: Add your farm animals + the dice showing that species. For **every full pair (`total ÷ 2`)**, you receive **+1 new animal** from the Bank.
   - *Example:* 0 🐰 + roll 2 🐰 → 2 total (1 pair) → **+1 🐰** (now 1).
   - *Example:* 3 🐰 + roll 1 🐰 → 4 total (2 pairs) → **+2 🐰** (now 5).
4. Click **END TURN** to pass play to the next farmer.

---

### 🔄 Official Exchange Table

All exchanges work in both directions:

| Give from Farm | Receive from Bank | Purpose |
| :--- | :--- | :--- |
| **6 🐰 Rabbits** | **1 🐑 Sheep** | Upgrade to higher tier |
| **2 🐑 Sheep** | **1 🐷 Pig** | Upgrade to higher tier |
| **3 🐷 Pigs** | **1 🐮 Cow** | Upgrade to higher tier |
| **2 🐮 Cows** | **1 🐴 Horse** | Obtain the rarest victory species |
| **1 🐑 Sheep** | **1 🐕 Small Dog** | Defense against the Fox 🦊 |
| **1 🐮 Cow** | **1 🐩 Big Dog** | Defense against the Wolf 🐺 |

---

### 🐺 Predators — Wolf and Fox

- 🐺 **Wolf (Die 1)**: Eats all animals on your farm **except 🐴 Horses** (and Big Dogs), returning them to the bank. Blocked by 🐩 **Big Dog** (the dog returns to the bank instead).
- 🦊 **Fox (Die 2)**: Eats all **🐰 Rabbits** on your farm. Blocked by 🐕 **Small Dog** (the dog returns to the bank instead).

---

## 🚀 How to Run & Deploy

The game is 100% static HTML/CSS/JS — no build step, no dependencies to install, and no backend server.

### Play Locally
1. Clone or download this repository.
2. Open `index.html` in any modern browser.
3. Choose **Local 2P**, **Online 2P**, or **vs AI** and click **PLAY**.

### Deploy on Netlify (or GitHub Pages / Vercel)
1. Push this repository to GitHub (or drag-and-drop the folder into [Netlify Drop](https://app.netlify.com/drop)).
2. Connect the repository on Netlify with **no build command** and publish directory `.` (root).
3. Share the deployed URL — players can play locally on one screen or use **Online 2P** with a room code / invite link (`https://your-site.netlify.app/?room=CODE`).

---

## 🗂️ Project Structure

```
SuperFarmer/
├── index.html   — Semantic HTML5 layout, start screen, online lobby, game board & modals
├── style.css    — Dark glassmorphism UI, responsive layout, dice & delta animations
├── script.js    — Game engine, MQTT WebSocket multiplayer, AI bot, Web Audio synth
└── README.md    — Project documentation, rules & deployment guide
```

---

<div align="center">
  Built with ❤️ as a modern digital tribute to the classic board game Super Farmer
</div>
