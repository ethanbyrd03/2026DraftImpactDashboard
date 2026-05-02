/**
 * Load order (see index.html):
 *   1. players.js  — RAW_PROSPECTS array + SOS_MAP + getSOS()
 *   2. model.js    — computeAdjustments(), buildDataset(), fmt(), etc.
 *   3. charts.js   — buildAllCharts(), setOdMode()
 *   4. ui.js       — renderBoard(), renderCards(), switchTab(), etc.
 *   5. main.js     — this file, runs after everything else is ready
 *
 * DATA is intentionally global so ui.js and charts.js can reference it
 * without passing it through every event handler call chain.
 */

// ── GLOBAL DATASET ─────────────────────────────────────────────────────────

/** @type {Object[]} Fully adjusted prospect array — set once on init. */
let DATA = [];

// ── BOOT ──────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Build the adjusted dataset from raw player data
  DATA = buildDataset();

  // Populate hero summary stats
  renderHeroMetrics(DATA);

  // Render the default view (Big Board tab)
  renderBoard(DATA);
  renderCards(DATA);
});

// ── EVENT HANDLERS ─────────────────────────────────────────────────────────
// These are called from inline onchange / oninput / onclick attributes in
// index.html, so they must remain in global scope.

/** Re-render the board whenever any filter or sort control changes. */
function onBoardFilterChange() {
  renderBoard(DATA);
}

/** Re-render the cards whenever any card filter changes. */
function onCardFilterChange() {
  renderCards(DATA);
}

/**
 * Column header click handler — updates the sort dropdown and re-renders.
 * Exposed globally because it's called from dynamically generated HTML.
 * @param {string} key - The column key to sort by
 */
function sortBy(key) {
  document.getElementById('sort-key').value = key;
  renderBoard(DATA);
}

/**
 * Toggle the O/D chart between adjusted and raw BPM.
 * @param {'adj'|'raw'} mode
 */
function onOdModeChange(mode) {
  setOdMode(mode, DATA);
}
