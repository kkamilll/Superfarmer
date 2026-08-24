# 🌾 Super Farmer Pro

> Digital adaptation of the legendary board game **Super Farmer** (originally created in 1943 by mathematician Prof. Karol Borsuk as *Animal Husbandry*) — fully playable directly in your browser with zero installation!

---

## 🎮 About the Game

**Super Farmer Pro** is a modern, responsive, and faithful digital board game. You take on the role of a farmer aiming to breed, trade, and expand your livestock while defending your farm from dangerous predators — the wolf and the fox.

The game is won by the first farmer who gathers at least **one of each of the 5 main species** on their farm:
🐰 **Rabbit**, 🐑 **Sheep**, 🐷 **Pig**, 🐮 **Cow**, and 🐴 **Horse**!

---

## ✨ Features & Highlights

- 🎲 **Two 12-Sided Dice (d12)** — accurate probability distribution based on the original game:
  - **Die 1 (Orange)**: 6 rabbits, 3 sheep, 1 pig, 1 cow, 1 wolf.
  - **Die 2 (Blue)**: 6 rabbits, 2 sheep, 2 pigs, 1 horse, 1 fox.
- 👥 **2-Player Mode** — local pass & play on a single screen.
- 🤖 **Player vs AI Mode** — smart computer bot with tactical trading and defense strategies.
- 🏆 **Victory Collection Track** — 5 species badge slots with golden glow when acquired.
- 🛡️ **Guard Dog Defense System**:
  - 🐕 **Small Dog** — shields rabbits from the Fox.
  - 🐩 **Big Dog** — shields the entire livestock herd from the Wolf.
- 🧮 **Breeding Profit Calculator** — instant real-time breakdown of dice math (`Farm + Dice ÷ 2`) plus animated `+2 🐰` / `-1 🐕` floating delta badges.
- 🔄 **Intuitive Animal Exchange Market**:
  - **Value Hierarchy Diagram** — interactive value flow ($6🐰 \to 1🐑 \to 2🐑 \to 1🐷 \dots$).
  - **Category Tabs** — *All Trades*, *Upgrades*, *Downgrades*, *Guard Dogs*.
  - **Live Affordability Indicators** — cards glow green when affordable and in stock.
  - **Trade 1x & MAX Buttons** — bulk trade with one click.
- 🔊 **Procedural Audio Engine (Web Audio API)** — custom sound effects for dice rolling, coin transactions, herd breeding, predator alerts, and victory fanfare with a mute toggle (🔊 / 🔇).
- 📋 **Turn Phasing & Event History** — two-phase turn (*Phase 1: Roll or Trade* $\to$ *Phase 2: Summary, Trade & End Turn*).
- 🎊 **Winner Screen & Confetti Shower**.
- 📖 **Interactive In-Game Rules Modal** with detailed examples and official exchange rates.

---

## 📜 Official Rules & Gameplay

### 🎯 Objective
Be the first farmer to collect at least **1 animal of each of the 5 target species**:  
🐰 Rabbit · 🐑 Sheep · 🐷 Pig · 🐮 Cow · 🐴 Horse.  
*(Guard dogs are defensive units and are not required to win).*

### 🎲 Turn Phasing
Each player's turn is divided into two phases:

1. **Phase 1 (Before the roll)**:
   - You may execute any available trades on the Animal Exchange Market.
   - Click **ROLL DICE**.

2. **Herd Breeding**:
   - Count all animals of the rolled species on your farm + the dice results.
   - For **every full pair (sum ÷ 2)**, you receive **1 new animal** from the Bank Herd and add it to your farm.

#### 💡 Breeding Examples:
- You have **0** 🐰 + roll **2** 🐰 $\to 2$ total ($1$ pair) $\to$ receive **+1 🐰** (farm now has 1).
- You have **1** 🐰 + roll **1** 🐰 $\to 2$ total ($1$ pair) $\to$ receive **+1 🐰** (farm now has 2).
- You have **2** 🐰 + roll **1** 🐰 $\to 3$ total ($1$ pair) $\to$ receive **+1 🐰** (farm now has 3).
- You have **3** 🐰 + roll **1** 🐰 $\to 4$ total ($2$ pairs) $\to$ receive **+2 🐰** (farm now has 5).
- You have **4** 🐰 + roll **2** 🐰 $\to 6$ total ($3$ pairs) $\to$ receive **+3 🐰** (farm now has 7).

3. **Phase 2 (After the roll)**:
   - After collecting newborn livestock, you may execute additional trades.
   - When finished, click **END TURN** to pass play to the next farmer.

---

### 🔄 Official Exchange Table

Exchanges can be made in both directions according to the following rates:

| Give from Farm | Receive from Bank | Strategic Purpose |
| :--- | :--- | :--- |
| **6 🐰 Rabbits** | **1 🐑 Sheep** | Upgrade to higher tier |
| **2 🐑 Sheep** | **1 🐷 Pig** | Upgrade to higher tier |
| **3 🐷 Pigs** | **1 🐮 Cow** | Upgrade to higher tier |
| **2 🐮 Cows** | **1 🐴 Horse** | Obtain the rarest victory species |
| **1 🐑 Sheep** | **1 🐕 Small Dog** | Defense against the Fox 🦊 |
| **1 🐮 Cow** | **1 🐩 Big Dog** | Defense against the Wolf 🐺 |

*Note:* All trades are reversible (e.g. 1 Horse = 2 Cows, 1 Cow = 3 Pigs, 1 Big Dog = 1 Cow, etc.).

---

### 🐺 Predators — Wolf and Fox

- 🐺 **Wolf (Die 1)**:
  - Devours **all animals** on the farm (rabbits, sheep, pigs, cows, and small dogs), returning them to the bank.
  - **Horses and Big Dogs are safe**.
  - Owning a **Big Dog (🐩)** repels the wolf — the dog is lost to the bank, but the entire livestock herd is saved.

- 🦊 **Fox (Die 2)**:
  - Devours **all rabbits (🐰)** on the farm. All other animals are safe.
  - Owning a **Small Dog (🐕)** repels the fox — the dog is lost to the bank, but all rabbits are saved.

---

## 🚀 How to Run

The game is standalone and requires no installation, build step, or server:

1. Download or clone this repository to your computer.
2. Open [index.html](file:///c:/Users/kamil/Desktop/farmer/index.html) in any modern browser (Chrome, Firefox, Safari, Edge, Opera).
3. Select your game mode, enter your farmer names, and click **START GAME**!

---

## 🗂️ Project Structure

```
farmer/
├── index.html   — Semantic HTML5 layout, player boards, exchange market, modals
├── style.css    — Dark glassmorphism styling, 3D dice animations, responsive design
├── script.js    — Game engine, procedural audio synthesizer, AI bot, breeding calculator
└── README.md    — Full documentation and rules in English
```

---

<div align="center">
  Built with ❤️ as a modern digital tribute to the classic board game Super Farmer
</div>
