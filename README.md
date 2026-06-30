# 🌾 Super Farmer Pro

> Cyfrowa wersja klasycznej polskiej gry planszowej **Super Farmer** — prosto w przeglądarce, bez instalacji!

---

## 🎮 O grze

**Super Farmer Pro** to wierna cyfrowa adaptacja kultowej polskiej gry planszowej wydanej przez Granna. Hoduj zwierzęta, wymieniaj je na rynku i jako pierwszy zdobądź co najmniej jednego przedstawiciela każdego gatunku — królika, owcę, świnię, krowę i konia!

---

## ✨ Funkcje

- 🎲 **Dwie kostki 12-ścienne** zgodne z oryginałem (królik ×6, owca ×3, świnia ×1, krowa/koń ×1, wilk/lis ×1)
- 👥 **Tryb 2 graczy** — gra naprzemiennie na jednym urządzeniu
- 🤖 **Tryb Gracz vs AI** — komputer stosuje zachłanną strategię optymalnej wymiany
- 🔄 **Rynek wymiany** — wszystkie kursy z oryginału (królik ⇄ owca ⇄ świnia ⇄ krowa ⇄ koń + psy)
- 🐺 **Wilk i lis** z mechaniką ochrony przez psy
- 📊 **Pasek postępu** dla każdego gracza
- 📋 **Historia zdarzeń** — log wszystkich akcji w trakcie rozgrywki
- 🏆 **Ekran wygranej** z efektem konfetti
- 📖 **Modal z zasadami** dostępny w każdej chwili gry

---

## 🚀 Jak uruchomić

Gra nie wymaga instalacji, serwera ani żadnych zależności — wystarczy przeglądarka!

1. Pobierz lub rozpakuj folder z projektem na dysk.
2. Otwórz plik `index.html` dwukrotnym kliknięciem **lub** przeciągnij go do okna przeglądarki.
3. Gotowe — gra startuje od razu! ✅

> Działa w każdej nowoczesnej przeglądarce: Chrome, Firefox, Edge, Safari.

---

## 🗂️ Struktura projektu

```
farmer/
├── index.html   — Struktura HTML, ekrany gry, modal zasad
├── style.css    — Stylowanie (dark mode, glassmorphism, animacje)
└── script.js    — Logika gry, AI, kostki, wymiana, konfetti
```

---

## 📜 Zasady gry

### 🎯 Cel

Jako pierwszy zdobądź co najmniej **1 sztukę każdego** z 5 gatunków:
🐰 Królik · 🐑 Owca · 🐷 Świnia · 🐮 Krowa · 🐴 Koń

### 🎲 Przebieg tury

1. Aktywny gracz rzuca dwiema 12-ściennymi kostkami.
2. Gracz otrzymuje ze stada głównego połowę sumy zwierząt: `⌊(na farmie + na kostce) / 2⌋`
3. Przed lub po rzucie można dokonywać wymian na Rynku.

### 🔄 Kursy wymiany

| Sprzedajesz | Kupujesz |
|-------------|----------|
| 6 🐰 Króliki | 1 🐑 Owca |
| 2 🐑 Owce | 1 🐷 Świnia |
| 3 🐷 Świnie | 1 🐮 Krowa |
| 2 🐮 Krowy | 1 🐴 Koń |
| 1 🐑 Owca | 1 🐕 Mały pies |
| 1 🐮 Krowa | 1 🐩 Duży pies |

Kursy działają też w odwrotną stronę.

### 🐺 Wilk (Kostka 1)

Pojawienie się wilka na kostce 1 niszczy całą fermę (oprócz 🐴 konia).
**Duży pies** (🐩) chroni farmę przed wilkiem — ale sam ginie.

### 🦊 Lis (Kostka 2)

Pojawienie się lisa na kostce 2 zjada wszystkich 🐰 królików.
**Mały pies** (🐕) chroni króliki przed lisem — ale sam ginie.

---

## 🤖 Strategia AI

Komputer stosuje zachłanną (greedy) strategię wymiany:

- Awansuje zwierzęta na jak najwyższy poziom przy każdej okazji.
- Kupuje psy ochronne, gdy ma wystarczający zapas.
- Wykonuje wymianę automatycznie przed i po rzucie kostkami.

---

## 🛠️ Technologie

| Technologia | Zastosowanie |
|-------------|--------------|
| **HTML5** | Struktura i semantyka |
| **CSS3** | Dark mode, glassmorphism, animacje, responsywność |
| **Vanilla JavaScript (ES6+)** | Logika gry, AI, efekty konfetti (Canvas API) |

Zero zewnętrznych zależności — działa offline, bez Node.js czy npm.

---

## 🎨 Design

- 🌑 Ciemny motyw (dark mode)
- 💎 Efekty glassmorphism
- ✨ Animacja rzutu kostkami
- 🎊 Konfetti przy wygranej (Canvas API)
- 📱 Responsywny układ (desktop + mobile)

---

## 📄 Licencja

Projekt fanowski / edukacyjny. Gra planszowa „Super Farmer" jest własnością firmy [Granna](https://granna.pl/).

---

<div align="center">
  Zbudowane z ❤️ jako cyfrowy hołd dla klasycznej polskiej gry planszowej
</div>
