# 🌾 Super Farmer

A browser edition of the classic board game **Super Farmer**. Play locally, against the computer, or online with a friend using plain HTML, CSS, and JavaScript, with no backend required.

Based on the 1943 board game by Polish mathematician Prof. Karol Borsuk (*Hodowla zwierzątek*). Roll two 12-sided dice to breed animals, trade with the Bank, and defend your farm from the **Wolf** and the **Fox**. The first player to own at least **1 Rabbit, 1 Sheep, 1 Pig, 1 Cow, and 1 Horse** wins.

---

## 🕹️ Game Modes

- **Local 2P:** Pass-and-play on a single device with custom player names. Works offline.
- **vs AI:** Single-player mode against a computer opponent that handles upgrade trades and guard-dog defense automatically. Works offline.
- **Online 2P (MQTT over WebSockets):** Play with a friend over Wi-Fi or mobile data on any static host (Netlify, GitHub Pages, Vercel) with no server or accounts.
  - **Create Room** generates a short room code and an invite link (`?room=CODE`) that fills in the join screen automatically.
  - Uses public WebSocket MQTT brokers (`broker.emqx.io` with automatic failover to `broker.hivemq.com`).
  - Syncs dice rolls, trades, end-of-turn state, turn locking, disconnect alerts, match resets, and one-click rematches (alternating who starts).

---

## 📜 Rules

### Objective
Collect at least **1 of each of the 5 main species**: Rabbit, Sheep, Pig, Cow, and Horse. Guard dogs are for defense only and are not needed to win.

### Turn Flow
1. **Trade (optional):** Before or after rolling, make any number of trades with the Bank using the Trade Bar.
2. **Roll Dice:** Click **Roll Dice** to roll both 12-sided dice.
3. **Breeding:** If no predator is rolled, add your farm's animals of each rolled species to the matching dice faces. For every full pair (`floor(total / 2)`), take **+1 animal** from the Bank (up to the Bank's remaining stock).
   - Example: `0 Rabbits` on farm + `2 Rabbits` rolled = `2` total (`1` pair) -> **+1 Rabbit**.
   - Example: `3 Rabbits` on farm + `1 Rabbit` rolled = `4` total (`2` pairs) -> **+2 Rabbits**.
   - If a **Wolf** or **Fox** is rolled, the predator attack resolves and no breeding occurs on that turn.
4. **End Turn:** Click **End Turn** to pass play to the other player.

### Dice Composition (12 Faces Each)

| Die | Accent | Faces |
| :--- | :--- | :--- |
| Die 1 | Gold | 6x Rabbit, 3x Sheep, 1x Pig, 1x Cow, 1x Wolf |
| Die 2 | Blue | 6x Rabbit, 2x Sheep, 2x Pig, 1x Horse, 1x Fox |

### Starting Bank Stock

| Rabbit | Sheep | Pig | Cow | Horse | Small Dog | Big Dog |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 60 | 24 | 20 | 12 | 6 | 4 | 2 |

### Exchange Rates

All trades with the Bank work in **both directions**:

| Give | Receive | Purpose |
| :--- | :--- | :--- |
| 6 Rabbits | 1 Sheep | Upgrade tier |
| 2 Sheep | 1 Pig | Upgrade tier |
| 3 Pigs | 1 Cow | Upgrade tier |
| 2 Cows | 1 Horse | Obtain the rarest species |
| 1 Sheep | 1 Small Dog | Defense against the Fox |
| 1 Cow | 1 Big Dog | Defense against the Wolf |

### Predators & Guard Dogs
- **Wolf (Die 1):** Returns all animals on your farm **except Horses** (including Small Dogs) to the Bank. Blocked by a **Big Dog** (only the Big Dog returns to the Bank).
- **Fox (Die 2):** Returns all **Rabbits** on your farm to the Bank. Blocked by a **Small Dog** (only the Small Dog returns to the Bank).

---

## ⚙️ Features

- **Two 12-Sided Dice (d12):** Animated rolls with separate visual accents for each die.
- **Smart Trade Bar:** Shows only currently affordable trades by default, with a toggle to display all rates.
- **Guard Dog Slots:** Clear indicators for Small Dog (vs Fox) and Big Dog (vs Wolf) counts.
- **Collapsible Bank & Move Log:** Toggleable Bank stock bar and a compact latest-move strip with an expandable full match log.
- **Top-Bar Controls:** Quick access to Bank, Rules modal, Restart, Exit, Sound Mute (saved in `localStorage`), and Fullscreen.
- **Synthesized Audio:** Web Audio API sound effects for rolls, breeding, trades, predator attacks, clicks, and victory (no external audio files).
- **Responsive Layout:** Dark glassmorphism UI with floating `+1` / `-1` indicators and a confetti effect on victory.

---

## 💻 Setup & Deployment

Pure static HTML, CSS, and JavaScript. No build step, packages, or backend server needed.

### Run Locally
```bash
git clone https://github.com/kkamilll/Superfarmer.git
cd Superfarmer
```
1. Open `index.html` in any modern browser.
2. Pick **Local 2P** or **vs AI** (works offline), or **Online 2P** (enter your name and create or join a room; requires internet).

### Deploy
1. Push to GitHub or upload the folder to Netlify, GitHub Pages, or Vercel.
2. Leave the build command empty and set the publish directory to `.`.
3. Share your site URL or direct room invite links (`https://your-site.example/?room=CODE`).

---

## 📁 Project Structure

```text
SuperFarmer/
├── index.html   # Layout, start screen, online lobby, board, and modals
├── style.css    # Dark glassmorphism styling, responsive layout, and animations
├── script.js    # Game logic, computer opponent, MQTT multiplayer, and Web Audio synth
└── README.md    # Documentation
```

---

## 📄 License

Licensed under the ISC License. Created by [Kamil](https://github.com/kkamilll).
