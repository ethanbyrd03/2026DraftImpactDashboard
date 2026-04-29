# 2026 NBA Draft — Impact Model

A data-driven NBA impact projection tool for the 2026 draft class. Raw college stats (per 36 min) are adjusted for player age and strength of schedule using the Engelmann methodology, then combined into a composite impact score.

**Live demo:** [ethanbyrd03.github.io/2026DraftImpactDashboard](https://ethanbyrd03.github.io/2026DraftImpactDashboard/)

---

## Features

- **71 ranked prospects** from Tankathon's 2026 big board + international players
- **Age adjustment** — younger players receive a statistical bonus; older players are penalized (Engelmann / Royce Webb methodology)
- **Strength of schedule adjustment** — raw stats are normalized against average draft-class competition
- **Composite impact score** — weighted blend of adjusted BPM, OBPM, DBPM, age, and usage
- **Sortable big board** — 11 sort keys, position filter, year filter, live search
- **4 charts** — impact score ranking, offense/defense BPM breakdown, age vs impact scatter, full-class BPM delta
- **Player cards** — per-36 stat bars, raw vs adjusted BPM comparison for every prospect
- **Methodology tab** — full explanation of every formula used

---

## Project structure

```
nba-draft-2026/
├── index.html          # App shell — markup only, no inline JS or CSS
├── css/
│   └── style.css       # All styles (CSS variables, layout, components)
└── js/
    ├── players.js      # RAW_PROSPECTS array + SOS_MAP (the database)
    ├── model.js        # Adjustment formulas + composite score computation
    ├── charts.js       # Chart.js chart builders (4 charts)
    ├── ui.js           # DOM rendering — board, cards, tabs, hero metrics
    └── main.js         # Entry point — boots the app, global event handlers
```

### File responsibilities

| File | What it does |
|---|---|
| `js/players.js` | The raw data. Add / edit prospects here. Also contains `SOS_MAP` and `getSOS()`. |
| `js/model.js` | Pure logic. All math lives here — adjust `MODEL_CONFIG` constants to tune the model. |
| `js/charts.js` | Chart.js wrappers. Edit chart styles, colors, and which prospects appear here. |
| `js/ui.js` | HTML generation for the board rows, player cards, and tab switching. |
| `js/main.js` | Bootstraps everything. Global `DATA` array and event handler entry points. |

---

## Methodology

### 1. Raw BPM (Box Plus/Minus)
BPM estimates a player's impact per 100 possessions relative to a league-average player, calculated from box score stats. Source: Tankathon / BartTorvik (2025–26 season, per-36 minute basis).

### 2. Age adjustment
Per the [Engelmann / Royce Webb methodology](https://www.roycewebb.com/p/how-to-adjust-college-stats-featuring):

```
age_delta = 19.0 − player_age
adj_OBPM += age_delta × 0.55
adj_DBPM += age_delta × 0.35
```

A player 1 year younger than the 19.0 baseline gains **+0.90 BPM**. A 23-year-old loses **−3.60 BPM**.

### 3. Strength of schedule adjustment
The average opponent SRS for historical draft classes is ~+7.0. Each SRS point above the baseline adds to adjusted OBPM:

```
sos_delta = (player_sos − 7.0) × 0.40
adj_OBPM += sos_delta
```

### 4. Composite impact score
```
Impact = adj_BPM  × 0.40
       + adj_OBPM × 0.25
       + adj_DBPM × 0.20
       + age_factor × 0.10      # 0–10 scale; 19yr = 5.0
       + usage_factor × 0.05    # 0–10 scale; 35% usg = 10.0
```

All weights are defined in `MODEL_CONFIG` in `js/model.js` and can be tuned.

---

## Data sources

- **Player rankings & stats:** [Tankathon Big Board](https://www.tankathon.com/big_board) / BartTorvik (per-36 min, 2025–26 season)
- **SOS estimates:** Conference NET / KenPom tier data, 2025–26
- **Age/SOS adjustment framework:** [Royce Webb's Substack](https://www.roycewebb.com/p/how-to-adjust-college-stats-featuring) (Engelmann 2026)
- **BPR framework reference:** [EvanMiya](https://evanmiya.com)

Data last updated: **March 2026**

---

## License

MIT — use freely, attribution appreciated.

---

*Built by [Ethan Byrd](https://github.com/ethanbyrd03)*
