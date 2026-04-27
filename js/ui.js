/**
 * ui.js
 * -----
 * All DOM rendering and UI interaction for the 2026 NBA Draft Impact Model.
 * Depends on: players.js, model.js, charts.js.
 *
 * Responsibilities:
 *   - Render / re-render the sortable Big Board table
 *   - Render Player Cards grid
 *   - Tab switching (board / charts / cards / methodology)
 *   - Hero summary metrics
 *   - Search, filter, and sort controls
 */

// ── TABLE COLUMN DEFINITIONS ───────────────────────────────────────────────

const BOARD_COLUMNS = [
  { key: 'tankRank',  label: 'Rank'     },
  { key: 'name',      label: 'Player'   },
  { key: 'pos',       label: 'Pos'      },
  { key: 'age',       label: 'Age'      },
  { key: 'sos',       label: 'SOS'      },
  { key: 'pts',       label: 'Pts/36'   },
  { key: 'reb',       label: 'Reb/36'   },
  { key: 'ast',       label: 'Ast/36'   },
  { key: 'ts',        label: 'TS%'      },
  { key: 'bpm',       label: 'BPM'      },
  { key: 'adj_bpm',   label: 'Adj BPM'  },
  { key: 'impact',    label: 'Impact'   },
  { key: 'bpm_delta', label: 'Δ Adj'    },
];

// ── HERO METRICS ───────────────────────────────────────────────────────────

/**
 * Populate the four summary stats in the hero section.
 * @param {Object[]} data - Adjusted prospect array
 */
function renderHeroMetrics(data) {
  const withBpm      = data.filter(d => !d.intl);
  const topImpact    = [...data].sort((a, b) => b.impact - a.impact)[0];
  const gainPlayer   = withBpm.reduce((best, p) => p.bpm_delta > best.bpm_delta ? p : best);
  const dropPlayer   = withBpm.reduce((best, p) => p.bpm_delta < best.bpm_delta ? p : best);

  document.getElementById('m-total').textContent = data.length;
  document.getElementById('m-top').textContent   = topImpact.name.split(' ').slice(-1)[0];

  document.getElementById('m-gain').textContent  = '+' + gainPlayer.bpm_delta.toFixed(1);
  const gainSub = document.getElementById('m-gain-name');
  if (gainSub) gainSub.textContent = gainPlayer.name.split(' ').slice(-1)[0];

  document.getElementById('m-drop').textContent  = dropPlayer.bpm_delta.toFixed(1);
  const dropSub = document.getElementById('m-drop-name');
  if (dropSub) dropSub.textContent = dropPlayer.name.split(' ').slice(-1)[0];
}

// ── BIG BOARD ─────────────────────────────────────────────────────────────

/**
 * Read all filter/sort controls and re-render the Big Board table.
 * @param {Object[]} data - Full adjusted dataset
 */
function renderBoard(data) {
  const sortKey = document.getElementById('sort-key').value;
  const posF    = document.getElementById('pos-f').value;
  const yrF     = document.getElementById('yr-f').value;
  const query   = document.getElementById('search').value.toLowerCase().trim();

  // Filter
  let filtered = data.filter(p => {
    if (posF !== 'all' && p.posGrp !== posF) return false;
    if (yrF  !== 'all' && p.yr    !== yrF)   return false;
    if (query && !p.name.toLowerCase().includes(query) && !p.school.toLowerCase().includes(query)) return false;
    return true;
  });

  // Sort
  filtered = sortProspects(filtered, sortKey);

  // Render header
  document.getElementById('thead-board').innerHTML =
    '<tr>' +
    BOARD_COLUMNS.map(col => {
      const active = col.key === sortKey ? ' sort-on' : '';
      return `<th class="${active}" onclick="sortBy('${col.key}')">${col.label}</th>`;
    }).join('') +
    '</tr>';

  // Render rows
  const maxImpact = Math.max(...data.map(d => d.impact || 0));
  let html = '';

  filtered.forEach(p => {
    const tier    = p.impact >= 10 ? 1 : p.impact >= 5 ? 2 : 3;
    const posCls  = _posClass(p.posGrp);
    const dStr    = fmtDelta(p.bpm_delta);
    const dCls    = deltaClass(p.bpm_delta);
    const barW    = Math.round((p.impact || 0) / maxImpact * 100);
    const barClr  = tier === 1 ? 'var(--accent)' : tier === 2 ? 'var(--blue)' : 'var(--dim)';

    html += `
      <tr>
        <td><span class="rank-num">${p.tankRank}</span></td>
        <td>
          <div class="player-name">${p.name}</div>
          <div class="player-meta">${p.school} · ${p.yr}</div>
        </td>
        <td><span class="pos-tag ${posCls}">${p.pos}</span></td>
        <td class="bpm-cell">${fmt(p.age, 1)}</td>
        <td class="bpm-cell">${fmt(p.sos, 1)}</td>
        <td class="bpm-cell">${fmt(p.pts, 1)}</td>
        <td class="bpm-cell">${fmt(p.reb, 1)}</td>
        <td class="bpm-cell">${fmt(p.ast, 1)}</td>
        <td class="bpm-cell">${fmt(p.ts,  1)}</td>
        <td class="bpm-cell">${fmt(p.bpm, 1)}</td>
        <td class="bpm-cell"><strong>${fmt(p.adj_bpm, 1)}</strong></td>
        <td>
          <div class="mini-bar-wrap">
            <div class="mini-bar-track">
              <div class="mini-bar-fill" style="width:${barW}%;background:${barClr}"></div>
            </div>
            <span class="${impactClass(p.impact || 0)}">${fmt(p.impact, 1)}</span>
          </div>
        </td>
        <td><span class="${dCls}">${dStr}</span></td>
      </tr>`;
  });

  document.getElementById('tbody-board').innerHTML = html;
}

// ── PLAYER CARDS ──────────────────────────────────────────────────────────

/**
 * Read filter/sort controls and re-render the Player Cards grid.
 * @param {Object[]} data - Full adjusted dataset
 */
function renderCards(data) {
  const posF    = document.getElementById('card-pos').value;
  const sortKey = document.getElementById('card-sort').value;

  let filtered = data.filter(p => posF === 'all' || p.posGrp === posF);
  filtered = sortProspects(filtered, sortKey);

  const maxImpact = Math.max(...data.map(d => d.impact || 0));

  document.getElementById('cards-grid').innerHTML = filtered.map(p => {
    const posCls     = _posClass(p.posGrp);
    const t1         = p.impact >= 10 ? 'tier1-card' : '';
    const scoreColor = p.impact >= 10 ? 'var(--accent)' : p.impact >= 5 ? 'var(--blue)' : 'var(--muted)';
    const dSign      = (p.bpm_delta || 0) >= 0 ? '+' : '';
    const dCls       = deltaClass(p.bpm_delta);

    return `
      <div class="pcard ${t1}">
        <div class="pcard-top">
          <div>
            <div class="pcard-name">${p.name}</div>
            <div class="pcard-meta">
              <span class="pos-tag ${posCls}" style="margin-right:5px">${p.pos}</span>${p.school} · ${p.yr}<br>
              Age ${p.age.toFixed(1)} · SOS ${p.sos.toFixed(1)} · #${p.tankRank} Tankathon
            </div>
          </div>
          <div class="pcard-score">
            <div class="pcard-score-val" style="color:${scoreColor}">${fmt(p.impact, 1)}</div>
            <div class="pcard-score-lbl">Impact</div>
          </div>
        </div>

        <div class="pcard-stats">
          <div class="ps-item">
            <div class="ps-lbl">Raw BPM</div>
            <div class="ps-val">${fmt(p.bpm, 1)}</div>
          </div>
          <div class="ps-item">
            <div class="ps-lbl">Adj BPM</div>
            <div class="ps-val">${fmt(p.adj_bpm, 1)}</div>
            <div class="ps-adj ${dCls}">${p.bpm_delta != null ? dSign + p.bpm_delta.toFixed(1) : '—'}</div>
          </div>
          <div class="ps-item">
            <div class="ps-lbl">Usage%</div>
            <div class="ps-val">${p.usg ? p.usg.toFixed(1) + '%' : '—'}</div>
          </div>
          <div class="ps-item">
            <div class="ps-lbl">OBPM→</div>
            <div class="ps-val" style="font-size:12px">
              ${fmt(p.obpm, 1)} <span style="color:var(--accent)">→ ${fmt(p.adj_obpm, 1)}</span>
            </div>
          </div>
          <div class="ps-item">
            <div class="ps-lbl">DBPM→</div>
            <div class="ps-val" style="font-size:12px">
              ${fmt(p.dbpm, 1)} <span style="color:var(--blue)">→ ${fmt(p.adj_dbpm, 1)}</span>
            </div>
          </div>
          <div class="ps-item">
            <div class="ps-lbl">TS%</div>
            <div class="ps-val">${p.ts ? p.ts.toFixed(1) : '—'}</div>
          </div>
        </div>

        <div class="pcard-bars">
          ${_bar('Pts/36', p.pts, 32,  '#60a5fa')}
          ${_bar('Reb/36', p.reb, 14,  '#4ade80')}
          ${_bar('Ast/36', p.ast, 10,  '#e8c547')}
          ${_bar('Blk/36', p.blk,  4,  '#a78bfa')}
        </div>
      </div>`;
  }).join('');
}

// ── TAB SWITCHING ─────────────────────────────────────────────────────────

const TAB_IDS = ['board', 'charts', 'cards', 'method'];

/**
 * Activate a tab panel. Lazily builds charts on first visit to the Charts tab.
 * @param {string} id - One of 'board' | 'charts' | 'cards' | 'method'
 */
function switchTab(id) {
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('on', TAB_IDS[i] === id);
  });
  document.querySelectorAll('.panel').forEach(panel => {
    panel.classList.remove('on');
  });
  document.getElementById('p-' + id).classList.add('on');

  // Build charts lazily on first open (DATA set in main.js)
  if (id === 'charts') buildAllCharts(DATA);
}

// ── PRIVATE HELPERS ────────────────────────────────────────────────────────

/** Returns CSS position class string for a posGrp value. */
function _posClass(posGrp) {
  return posGrp === 'G' ? 'pos-G' : posGrp === 'F' ? 'pos-F' : posGrp === 'C' ? 'pos-C' : 'pos-I';
}

/**
 * Returns HTML for a single stat bar row inside a player card.
 * @param {string} label
 * @param {number} val
 * @param {number} max    - Value treated as 100% width
 * @param {string} color  - CSS color string
 */
function _bar(label, val, max, color) {
  const w = Math.min(100, ((val || 0) / max) * 100).toFixed(0);
  return `
    <div class="pbar-row">
      <span class="pbar-lbl">${label}</span>
      <div class="pbar-track">
        <div class="pbar-fill" style="width:${w}%;background:${color}"></div>
      </div>
      <span class="pbar-val">${fmt(val, 1)}</span>
    </div>`;
}
