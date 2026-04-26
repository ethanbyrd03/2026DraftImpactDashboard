/**
 * model.js
 * --------
 * Age + Strength-of-Schedule adjustment engine and composite impact score.
 *
 * Methodology:
 *   1. Raw BPM (Box Plus/Minus) from BartTorvik — measures per-100-possession
 *      impact relative to a college average player.
 *
 *   2. Age adjustment (Engelmann / Royce Webb):
 *      Each year younger than a 19.0-year-old baseline adds +0.55 to OBPM
 *      and +0.35 to DBPM. Older players are penalized symmetrically.
 *      Reference: https://www.roycewebb.com/p/how-to-adjust-college-stats-featuring
 *
 *   3. SOS adjustment:
 *      The average SOS for drafted players is ~+7.0 SRS. Each SRS point
 *      above the baseline adds +0.40 to adj_OBPM (reward for harder schedules).
 *      Softer schedules subtract accordingly.
 *
 *   4. Composite impact score:
 *      Weighted blend of adjusted metrics, scaled relative to the class.
 *      adj_BPM (40%) + adj_OBPM (25%) + adj_DBPM (20%) + age_factor (10%) + usage_factor (5%)
 *
 *   International players without BPM data receive an estimated score
 *   based on per-36 raw stats and age only.
 */

// ── CONSTANTS ──────────────────────────────────────────────────────────────

const MODEL_CONFIG = {
  AGE_BASELINE:    19.0,  // Reference age (years). Younger = bonus, older = penalty.
  SOS_BASELINE:    7.0,   // Average opponent SRS for historical draft classes.

  // Age adjustment per year away from baseline
  AGE_OBPM_RATE:   0.55,
  AGE_DBPM_RATE:   0.35,

  // SOS adjustment per SRS point above baseline (applied to OBPM only)
  SOS_OBPM_RATE:   0.40,

  // Impact score weights (must sum to 1.0)
  WEIGHT_ADJ_BPM:  0.40,
  WEIGHT_ADJ_OBPM: 0.25,
  WEIGHT_ADJ_DBPM: 0.20,
  WEIGHT_AGE:      0.10,
  WEIGHT_USAGE:    0.05,

  // Age factor: 19-year-old = 5.0 on a 0–10 scale
  AGE_FACTOR_BASE: 5.0,
  AGE_FACTOR_RATE: 1.2,   // Points added per year younger than baseline

  // Usage factor: 35% usage = 10.0 on a 0–10 scale
  USAGE_MAX:       35.0,
};

// ── CORE COMPUTATION ───────────────────────────────────────────────────────

/**
 * Applies age and SOS adjustments to a single raw prospect object.
 * Returns a new object with all original fields plus computed adj_* fields.
 *
 * @param {Object} prospect - One entry from RAW_PROSPECTS in players.js
 * @returns {Object} - Adjusted prospect with impact score
 */
function computeAdjustments(prospect) {
  const p = prospect;
  const cfg = MODEL_CONFIG;
  const s = getSOS(p.school);   // getSOS() defined in players.js

  // ── International / no BPM path ───────────────────────────────────────
  if (p.bpm === null) {
    const ageDelta    = cfg.AGE_BASELINE - p.age;
    // Rough BPM estimate from per-36 raw stats (very conservative)
    const estBpm      = Math.max(-5, (p.pts * 0.20 + p.reb * 0.10 + p.ast * 0.15) - 8);
    const adj_bpm     = +(estBpm + ageDelta * (cfg.AGE_OBPM_RATE + cfg.AGE_DBPM_RATE)).toFixed(2);
    const ageFactor   = _clamp(cfg.AGE_FACTOR_BASE + ageDelta * cfg.AGE_FACTOR_RATE, 0, 10);
    const usageFactor = p.usg ? _clamp(p.usg / cfg.USAGE_MAX * 10, 0, 10) : 3.0;
    const impact      = +(adj_bpm * 0.65 + ageFactor * 0.25 + usageFactor * 0.10).toFixed(1);

    return {
      ...p,
      sos:       +s.toFixed(1),
      adj_obpm:  null,
      adj_dbpm:  null,
      adj_bpm,
      bpm_delta: +(adj_bpm - estBpm).toFixed(2),
      ageFactor: +ageFactor.toFixed(2),
      impact,
      intl:      true,
    };
  }

  // ── College player path ────────────────────────────────────────────────
  const ageDelta    = cfg.AGE_BASELINE - p.age;
  const sosDelta    = (s - cfg.SOS_BASELINE) * cfg.SOS_OBPM_RATE;

  const adj_obpm    = +(p.obpm + ageDelta * cfg.AGE_OBPM_RATE + sosDelta).toFixed(2);
  const adj_dbpm    = +(p.dbpm + ageDelta * cfg.AGE_DBPM_RATE).toFixed(2);
  const adj_bpm     = +(adj_obpm + adj_dbpm).toFixed(2);
  const bpm_delta   = +(adj_bpm - p.bpm).toFixed(2);

  const ageFactor   = _clamp(cfg.AGE_FACTOR_BASE + ageDelta * cfg.AGE_FACTOR_RATE, 0, 10);
  const usageFactor = p.usg ? _clamp(p.usg / cfg.USAGE_MAX * 10, 0, 10) : 5.0;

  const impact = +(
    adj_bpm     * cfg.WEIGHT_ADJ_BPM  +
    adj_obpm    * cfg.WEIGHT_ADJ_OBPM +
    adj_dbpm    * cfg.WEIGHT_ADJ_DBPM +
    ageFactor   * cfg.WEIGHT_AGE      +
    usageFactor * cfg.WEIGHT_USAGE
  ).toFixed(1);

  return {
    ...p,
    sos: +s.toFixed(1),
    adj_obpm,
    adj_dbpm,
    adj_bpm,
    bpm_delta,
    ageFactor: +ageFactor.toFixed(2),
    impact,
    intl: false,
  };
}

/**
 * Processes the full RAW_PROSPECTS array and returns adjusted data.
 * Call this once on page load.
 *
 * @returns {Object[]} Fully adjusted prospect array, sorted by tankRank by default.
 */
function buildDataset() {
  return RAW_PROSPECTS.map(computeAdjustments);
}

// ── HELPERS ────────────────────────────────────────────────────────────────

/** Clamp a value between min and max. */
function _clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

/**
 * Format a number to N decimal places, returning '—' for null/undefined.
 * @param {number|null} v
 * @param {number} decimals
 */
function fmt(v, decimals = 1) {
  return v == null ? '—' : Number(v).toFixed(decimals);
}

/**
 * Returns CSS class name for a player's impact score.
 * @param {number} v
 */
function impactClass(v) {
  if (v >= 9) return 'impact-high';
  if (v >= 4) return 'impact-mid';
  return 'impact-low';
}

/**
 * Returns the CSS class for a BPM delta value.
 * @param {number|null} delta
 */
function deltaClass(delta) {
  if (delta == null) return 'delta-neu';
  if (delta >=  0.3) return 'delta-pos';
  if (delta <= -0.3) return 'delta-neg';
  return 'delta-neu';
}

/**
 * Returns a formatted delta string like "+2.3" or "−1.1".
 * @param {number|null} delta
 */
function fmtDelta(delta) {
  if (delta == null) return '—';
  return (delta >= 0 ? '+' : '') + delta.toFixed(1);
}

/**
 * Sorts a prospect array in place.
 * @param {Object[]} data
 * @param {string} key  - Field name to sort by
 * @param {'asc'|'desc'} dir
 */
function sortProspects(data, key, dir = 'desc') {
  const asc = dir === 'asc';
  // Keys where smaller = better (ascending order is "best first")
  const ascKeys = new Set(['tankRank', 'age']);
  const isAsc = asc || ascKeys.has(key);

  return [...data].sort((a, b) => {
    const av = a[key] ?? -Infinity;
    const bv = b[key] ?? -Infinity;
    return isAsc ? av - bv : bv - av;
  });
}
