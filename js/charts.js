/**
 * charts.js
 * ---------
 * All Chart.js chart builders for the 2026 NBA Draft Impact Model.
 * Depends on: model.js (for DATA, fmt), Chart.js (CDN).
 *
 * Chart instances are stored in module-level variables so they can
 * be destroyed and rebuilt when the tab is revisited or filters change.
 */

// ── SHARED CHART DEFAULTS ──────────────────────────────────────────────────

const CHART_COLORS = {
  accent:       '#e8c547',
  accentFaded:  'rgba(232,197,71,0.22)',
  accentBubble: 'rgba(232,197,71,0.45)',
  accentBorder: '#c9a72f',
  blue:         '#60a5fa',
  green:        '#4ade80',
  red:          'rgba(248,113,113,0.70)',
  greenBar:     'rgba(74,222,128,0.70)',
  dim:          '#3f3e3b',
  gridLine:     'rgba(255,255,255,0.04)',
  tickColor:    '#7a7870',
};

const CHART_TICK_STYLE = {
  color: CHART_COLORS.tickColor,
  font:  { size: 10 },
};

const CHART_GRID_STYLE = {
  color: CHART_COLORS.gridLine,
};

// ── CHART INSTANCES ────────────────────────────────────────────────────────

let cImpact  = null;
let cOd      = null;
let cScatter = null;
let cDelta   = null;

// Tracks whether we're showing raw or adjusted OBPM/DBPM in the O/D chart
let odMode = 'adj';

// ── PUBLIC API ─────────────────────────────────────────────────────────────

/**
 * Build (or rebuild) all four charts using the current DATA array.
 * Call this the first time the Charts tab is opened.
 * @param {Object[]} data - Fully adjusted prospect array from buildDataset()
 */
function buildAllCharts(data) {
  _buildImpactChart(data);
  _buildOdChart(data);
  _buildScatterChart(data);
  _buildDeltaChart(data);
}

/**
 * Toggle the O/D chart between adjusted and raw BPM and rebuild it.
 * @param {'adj'|'raw'} mode
 * @param {Object[]} data
 */
function setOdMode(mode, data) {
  odMode = mode;
  document.getElementById('pill-adj').classList.toggle('on', mode === 'adj');
  document.getElementById('pill-raw').classList.toggle('on', mode === 'raw');
  _buildOdChart(data);
}

// ── PRIVATE CHART BUILDERS ─────────────────────────────────────────────────

/**
 * Impact score bar chart — top 25 prospects sorted by impact score.
 * Overlays raw BPM as a faded comparison bar.
 */
function _buildImpactChart(data) {
  const top25  = [...data].filter(d => !d.intl).sort((a, b) => b.impact - a.impact).slice(0, 25);
  const labels = top25.map(p => p.name.split(' ').slice(-1)[0]);

  if (cImpact) cImpact.destroy();
  cImpact = new Chart(document.getElementById('c-impact'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Impact score',
          data:  top25.map(p => +p.impact.toFixed(1)),
          backgroundColor: CHART_COLORS.accent,
          borderRadius: 3,
        },
        {
          label: 'Raw BPM',
          data:  top25.map(p => +(p.bpm || 0).toFixed(1)),
          backgroundColor: CHART_COLORS.accentFaded,
          borderRadius: 3,
        },
      ],
    },
    options: {
      responsive:           true,
      maintainAspectRatio:  false,
      plugins: {
        legend:  { display: false },
        tooltip: { callbacks: { title: items => top25[items[0].dataIndex].name } },
      },
      scales: {
        x: { ticks: { ...CHART_TICK_STYLE, maxRotation: 38, autoSkip: false }, grid: { display: false } },
        y: { ticks: CHART_TICK_STYLE, grid: CHART_GRID_STYLE },
      },
    },
  });
}

/**
 * Stacked offense/defense BPM chart — top 20 by impact score.
 * Rebuilds when toggled between raw and adjusted.
 */
function _buildOdChart(data) {
  const top20  = [...data].filter(d => !d.intl).sort((a, b) => b.impact - a.impact).slice(0, 20);
  const labels = top20.map(p => p.name.split(' ').slice(-1)[0]);
  const oKey   = odMode === 'adj' ? 'adj_obpm' : 'obpm';
  const dKey   = odMode === 'adj' ? 'adj_dbpm' : 'dbpm';

  if (cOd) cOd.destroy();
  cOd = new Chart(document.getElementById('c-od'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'OBPM',
          data:  top20.map(p => +(p[oKey] || 0).toFixed(1)),
          backgroundColor: CHART_COLORS.blue,
          borderRadius: 3,
          stack: 's',
        },
        {
          label: 'DBPM',
          data:  top20.map(p => +(p[dKey] || 0).toFixed(1)),
          backgroundColor: CHART_COLORS.green,
          borderRadius: 3,
          stack: 's',
        },
      ],
    },
    options: {
      responsive:           true,
      maintainAspectRatio:  false,
      plugins: {
        legend:  { display: false },
        tooltip: { callbacks: { title: items => top20[items[0].dataIndex].name } },
      },
      scales: {
        x: { stacked: true, ticks: { ...CHART_TICK_STYLE, maxRotation: 38, autoSkip: false }, grid: { display: false } },
        y: { stacked: true, ticks: CHART_TICK_STYLE, grid: CHART_GRID_STYLE },
      },
    },
  });
}

/**
 * Bubble scatter — age (x) vs impact score (y), bubble radius = raw BPM magnitude.
 * Useful for spotting who benefits most from the youth adjustment.
 */
function _buildScatterChart(data) {
  const pts = data
    .filter(d => !d.intl)
    .map(p => ({
      x:       +p.age.toFixed(1),
      y:       +p.impact.toFixed(1),
      r:       Math.max(4, Math.abs(p.bpm || 0) * 0.45),
      name:    p.name,
      bpm:     p.bpm,
      adj_bpm: p.adj_bpm,
    }));

  if (cScatter) cScatter.destroy();
  cScatter = new Chart(document.getElementById('c-scatter'), {
    type: 'bubble',
    data: {
      datasets: [{
        label: 'Prospects',
        data:  pts,
        backgroundColor: CHART_COLORS.accentBubble,
        borderColor:     CHART_COLORS.accentBorder,
        borderWidth: 1,
      }],
    },
    options: {
      responsive:           true,
      maintainAspectRatio:  false,
      plugins: {
        legend:  { display: false },
        tooltip: {
          callbacks: {
            label: ctx => {
              const d = ctx.raw;
              return [
                d.name,
                `Age: ${d.x}  Impact: ${d.y}`,
                `Raw BPM: ${(d.bpm || 0).toFixed(1)}  Adj: ${(d.adj_bpm || 0).toFixed(1)}`,
              ];
            },
          },
        },
      },
      scales: {
        x: {
          title: { display: true, text: 'Age', color: CHART_COLORS.tickColor, font: { size: 11 } },
          min: 18, max: 25.2,
          ticks: CHART_TICK_STYLE,
          grid:  CHART_GRID_STYLE,
        },
        y: {
          title: { display: true, text: 'Impact score', color: CHART_COLORS.tickColor, font: { size: 11 } },
          ticks: CHART_TICK_STYLE,
          grid:  CHART_GRID_STYLE,
        },
      },
      layout: { padding: 10 },
    },
  });
}

/**
 * BPM delta bar chart — shows every college prospect's adjustment gain/loss.
 * Green = benefited from adjustments, red = penalized.
 */
function _buildDeltaChart(data) {
  const sorted = [...data]
    .filter(d => !d.intl)
    .sort((a, b) => b.bpm_delta - a.bpm_delta);

  const labels = sorted.map(p => p.name.split(' ').slice(-1)[0]);
  const deltas = sorted.map(p => +p.bpm_delta.toFixed(1));
  const colors = deltas.map(v => v >= 0 ? CHART_COLORS.greenBar : CHART_COLORS.red);

  if (cDelta) cDelta.destroy();
  cDelta = new Chart(document.getElementById('c-delta'), {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'BPM delta',
        data:  deltas,
        backgroundColor: colors,
        borderRadius: 3,
      }],
    },
    options: {
      responsive:           true,
      maintainAspectRatio:  false,
      plugins: {
        legend:  { display: false },
        tooltip: { callbacks: { title: items => sorted[items[0].dataIndex].name } },
      },
      scales: {
        x: { ticks: { ...CHART_TICK_STYLE, font: { size: 9 }, maxRotation: 45, autoSkip: false }, grid: { display: false } },
        y: { ticks: CHART_TICK_STYLE, grid: CHART_GRID_STYLE },
      },
    },
  });
}
