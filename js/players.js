/**
 * players.js
 * ----------
 * Raw prospect database for the 2026 NBA Draft Impact Model.
 *
 * Data sourced from Tankathon / BartTorvik (2025-26 season, per-36 min basis).
 * Last updated: March 2026.
 *
 * Fields:
 *   tankRank  — Tankathon big board rank (1 = projected #1 pick)
 *   name      — Full player name
 *   school    — College program or international club/league
 *   pos       — Position string shown in UI (e.g. "PF", "SG/PG")
 *   posGrp    — Simplified position group: "G" | "F" | "C" | "I" (international)
 *   yr        — Class year: "FR" | "SO" | "JR" | "SR" | "INT"
 *   age       — Possession-weighted average age during 2025-26 season
 *   pts       — Points per 36 minutes
 *   reb       — Rebounds per 36 minutes
 *   ast       — Assists per 36 minutes
 *   blk       — Blocks per 36 minutes
 *   stl       — Steals per 36 minutes
 *   ts        — True shooting percentage (0-100 scale)
 *   usg       — Usage rate percentage (null for some internationals)
 *   obpm      — Offensive Box Plus/Minus (null for internationals without college stats)
 *   dbpm      — Defensive Box Plus/Minus (null for internationals)
 *   bpm       — Total Box Plus/Minus = obpm + dbpm (null for internationals)
 */

const SOS_MAP = {
  'Duke':          9.0,
  'Kansas':        9.8,
  'BYU':           6.8,
  'North Carolina':5.8,
  'Houston':       9.5,
  'Arkansas':      7.2,
  'Illinois':      7.8,
  'Arizona':       7.5,
  'Louisville':    6.2,
  'Tennessee':     8.8,
  'Alabama':       7.5,
  'Michigan':      7.4,
  'Washington':    5.5,
  'Kentucky':      8.2,
  'Iowa':          5.5,
  'Texas Tech':    7.2,
  'Baylor':        7.4,
  'Santa Clara':   4.0,
  'Vanderbilt':    6.0,
  'Iowa State':    8.2,
  "St. John's":    8.0,
  'Wake Forest':   5.8,
  'Stanford':      6.5,
  'USC':           6.5,
  'UConn':         7.8,
  'Texas':         7.2,
  'Michigan State':7.5,
  'Ohio State':    7.5,
  'Purdue':        7.6,
  'NC State':      6.5,
  'Florida':       8.0,
  'Cincinnati':    6.8,
  'Auburn':        7.8,
  'Oregon':        6.5,
  'San Diego State':6.8,
  'Indiana':       7.0,
  'Miami':         7.2,
  'Missouri':      7.0,
  'Butler':        5.5,
  // International clubs (estimated from competition level)
  'New Zealand':   5.5,
  'Valencia':      7.2,
  'Melbourne':     6.5,
  'Joventut':      6.5,
  'Reggio Emilia': 6.5,
};

/**
 * Returns the estimated SOS for a given school.
 * Falls back to 7.0 (the draft-class average) if not in the map.
 */
function getSOS(school) {
  return SOS_MAP[school] ?? 7.0;
}

const RAW_PROSPECTS = [
  // ── TIER 1 ──
  { tankRank:1,  name:'Cameron Boozer',     school:'Duke',           pos:'PF',    posGrp:'F', yr:'FR',  age:18.9, pts:22.5, reb:10.2, ast:4.1, blk:0.6, stl:1.4, ts:65.3, usg:29.9, obpm:12.7, dbpm:6.0,  bpm:18.7 },
  { tankRank:2,  name:'Darryn Peterson',    school:'Kansas',         pos:'SG/PG', posGrp:'G', yr:'FR',  age:19.4, pts:20.2, reb:4.2,  ast:1.6, blk:0.6, stl:1.4, ts:57.8, usg:33.5, obpm:9.3,  dbpm:4.8,  bpm:14.1 },
  { tankRank:3,  name:'AJ Dybantsa',        school:'BYU',            pos:'SF',    posGrp:'F', yr:'FR',  age:19.4, pts:25.5, reb:6.8,  ast:3.7, blk:0.3, stl:1.1, ts:60.0, usg:33.9, obpm:9.5,  dbpm:2.2,  bpm:11.7 },

  // ── TIER 2 ──
  { tankRank:4,  name:'Caleb Wilson',       school:'North Carolina', pos:'SF/PF', posGrp:'F', yr:'FR',  age:19.9, pts:19.8, reb:9.4,  ast:2.7, blk:1.4, stl:1.5, ts:62.6, usg:28.7, obpm:8.7,  dbpm:5.3,  bpm:14.0 },
  { tankRank:5,  name:'Kingston Flemings',  school:'Houston',        pos:'PG',    posGrp:'G', yr:'FR',  age:19.5, pts:16.1, reb:4.1,  ast:5.2, blk:0.3, stl:1.5, ts:56.3, usg:26.0, obpm:6.6,  dbpm:6.0,  bpm:12.6 },
  { tankRank:6,  name:'Darius Acuff ',   school:'Arkansas',       pos:'PG',    posGrp:'G', yr:'FR',  age:19.6, pts:23.5, reb:3.1,  ast:6.4, blk:0.3, stl:0.8, ts:60.4, usg:29.5, obpm:9.4,  dbpm:0.7,  bpm:10.1 },
  { tankRank:7,  name:'Keaton Wagler',      school:'Illinois',       pos:'SG/PG', posGrp:'G', yr:'FR',  age:19.4, pts:17.9, reb:5.1,  ast:4.2, blk:0.4, stl:0.9, ts:59.6, usg:25.2, obpm:8.8,  dbpm:3.5,  bpm:12.3 },

  // ── THE REST ──
  { tankRank:8,  name:'Brayden Burries',    school:'Arizona',        pos:'SG/PG', posGrp:'G', yr:'FR',  age:20.8, pts:16.1, reb:4.9,  ast:2.4, blk:0.2, stl:1.5, ts:61.6, usg:23.2, obpm:6.0,  dbpm:5.7,  bpm:11.7 },
  { tankRank:9,  name:'Mikel Brown',    school:'Louisville',     pos:'PG',    posGrp:'G', yr:'FR',  age:20.2, pts:18.2, reb:3.3,  ast:4.7, blk:0.1, stl:1.2, ts:57.7, usg:31.4, obpm:4.9,  dbpm:1.7,  bpm:6.6  },
  { tankRank:10, name:'Nate Ament',         school:'Tennessee',      pos:'SF',    posGrp:'F', yr:'FR',  age:19.5, pts:16.7, reb:6.3,  ast:2.3, blk:0.6, stl:1.0, ts:53.4, usg:29.0, obpm:5.1,  dbpm:3.3,  bpm:8.4  },
  { tankRank:11, name:'Labaron Philon', school:'Alabama',        pos:'PG',    posGrp:'G', yr:'SO',  age:20.6, pts:22.0, reb:3.5,  ast:5.0, blk:0.2, stl:1.2, ts:62.6, usg:30.0, obpm:9.2,  dbpm:2.1,  bpm:11.3 },
  { tankRank:12, name:'Yaxel Lendeborg',    school:'Michigan',       pos:'PF',    posGrp:'F', yr:'SR',  age:23.7, pts:15.1, reb:6.8,  ast:3.2, blk:1.2, stl:1.1, ts:64.6, usg:20.4, obpm:9.8,  dbpm:6.9,  bpm:16.7 },
  { tankRank:13, name:'Hannes Steinbach',   school:'Washington',     pos:'PF',    posGrp:'F', yr:'FR',  age:20.1, pts:18.5, reb:11.8, ast:1.6, blk:1.2, stl:1.1, ts:63.6, usg:23.9, obpm:7.7,  dbpm:2.4,  bpm:10.1 },
  { tankRank:14, name:'Karim López',        school:'New Zealand',    pos:'SF',    posGrp:'F', yr:'INT', age:19.2, pts:11.9, reb:6.1,  ast:1.9, blk:1.0, stl:1.2, ts:58.0, usg:19.5, obpm:null, dbpm:null, bpm:null },
  { tankRank:15, name:'Chris Cenac',    school:'Houston',        pos:'PF/C',  posGrp:'C', yr:'FR',  age:19.4, pts:9.5,  reb:7.9,  ast:0.7, blk:0.5, stl:0.8, ts:54.6, usg:19.9, obpm:3.7,  dbpm:3.8,  bpm:7.5  },
  { tankRank:16, name:'Tounde Yessoufou',   school:'Baylor',         pos:'SG/SF', posGrp:'F', yr:'FR',  age:20.1, pts:17.8, reb:5.9,  ast:1.6, blk:0.6, stl:2.0, ts:55.0, usg:26.9, obpm:4.4,  dbpm:1.7,  bpm:6.1  },
  { tankRank:17, name:'Koa Peat',           school:'Arizona',        pos:'PF',    posGrp:'F', yr:'FR',  age:19.4, pts:14.1, reb:5.6,  ast:2.6, blk:0.7, stl:0.6, ts:55.7, usg:24.5, obpm:4.8,  dbpm:3.9,  bpm:8.8  },
  { tankRank:18, name:'Jayden Quaintance',  school:'Kentucky',       pos:'PF',    posGrp:'F', yr:'SO',  age:18.9, pts:5.0,  reb:5.0,  ast:0.5, blk:0.8, stl:0.5, ts:49.6, usg:19.2, obpm:0.0,  dbpm:1.8,  bpm:1.9  },
  { tankRank:19, name:'Bennett Stirtz',     school:'Iowa',           pos:'PG',    posGrp:'G', yr:'SR',  age:22.7, pts:19.8, reb:2.6,  ast:4.4, blk:0.2, stl:1.4, ts:60.7, usg:26.9, obpm:7.7,  dbpm:2.5,  bpm:10.2 },
  { tankRank:20, name:'Christian Anderson', school:'Texas Tech',     pos:'PG',    posGrp:'G', yr:'SO',  age:20.2, pts:18.5, reb:3.6,  ast:7.4, blk:0.2, stl:1.5, ts:62.6, usg:23.8, obpm:7.1,  dbpm:2.3,  bpm:9.4  },
  { tankRank:21, name:'Cameron Carr',       school:'Baylor',         pos:'SG',    posGrp:'G', yr:'SO',  age:21.6, pts:18.9, reb:5.8,  ast:2.6, blk:1.3, stl:0.9, ts:62.2, usg:25.3, obpm:6.9,  dbpm:2.3,  bpm:9.2  },
  { tankRank:22, name:'Allen Graves',       school:'Santa Clara',    pos:'PF',    posGrp:'F', yr:'FR',  age:19.9, pts:11.8, reb:6.5,  ast:1.8, blk:0.9, stl:1.9, ts:61.3, usg:21.9, obpm:8.7,  dbpm:4.7,  bpm:13.4 },
  { tankRank:23, name:'Isaiah Evans',       school:'Duke',           pos:'SF',    posGrp:'F', yr:'SO',  age:20.5, pts:15.0, reb:3.2,  ast:1.3, blk:0.7, stl:0.7, ts:59.0, usg:24.9, obpm:6.5,  dbpm:3.3,  bpm:9.8  },
  { tankRank:24, name:'Aday Mara',          school:'Michigan',       pos:'C',     posGrp:'C', yr:'JR',  age:21.2, pts:12.1, reb:6.8,  ast:2.4, blk:2.6, stl:0.4, ts:65.9, usg:23.1, obpm:5.8,  dbpm:8.4,  bpm:14.3 },
  { tankRank:25, name:'Tyler Tanner',       school:'Vanderbilt',     pos:'PG',    posGrp:'G', yr:'SO',  age:20.4, pts:19.5, reb:3.6,  ast:5.1, blk:0.3, stl:2.4, ts:61.2, usg:26.3, obpm:7.7,  dbpm:4.6,  bpm:12.3 },
  { tankRank:26, name:'Joshua Jefferson',   school:'Iowa State',     pos:'PF/SF', posGrp:'F', yr:'SR',  age:22.6, pts:16.4, reb:7.4,  ast:4.8, blk:0.8, stl:1.6, ts:56.0, usg:27.6, obpm:7.0,  dbpm:6.1,  bpm:13.0 },
  { tankRank:27, name:'Amari Allen',        school:'Alabama',        pos:'SF',    posGrp:'F', yr:'FR',  age:20.4, pts:11.4, reb:6.9,  ast:3.1, blk:0.7, stl:1.0, ts:57.0, usg:18.6, obpm:4.2,  dbpm:3.6,  bpm:7.8  },
  { tankRank:28, name:'Morez Johnson',  school:'Michigan',       pos:'PF',    posGrp:'F', yr:'SO',  age:20.4, pts:13.1, reb:7.3,  ast:1.2, blk:1.1, stl:0.7, ts:67.7, usg:21.3, obpm:6.4,  dbpm:5.4,  bpm:11.8 },
  { tankRank:29, name:'Dailyn Swain',       school:'Texas',          pos:'SG/SF', posGrp:'F', yr:'JR',  age:20.9, pts:17.3, reb:7.5,  ast:3.6, blk:0.3, stl:1.6, ts:63.6, usg:24.6, obpm:6.9,  dbpm:3.6,  bpm:10.5 },
  { tankRank:30, name:'Ebuka Okorie',       school:'Stanford',       pos:'PG',    posGrp:'G', yr:'FR',  age:19.2, pts:23.2, reb:3.6,  ast:3.6, blk:0.3, stl:1.6, ts:58.9, usg:31.0, obpm:8.4,  dbpm:2.2,  bpm:10.6 },
  { tankRank:31, name:'Meleek Thomas',      school:'Arkansas',       pos:'SG/PG', posGrp:'G', yr:'FR',  age:19.9, pts:15.6, reb:3.8,  ast:2.5, blk:0.2, stl:1.5, ts:55.9, usg:23.6, obpm:4.8,  dbpm:2.3,  bpm:7.0  },
  { tankRank:32, name:'Alex Karaban',       school:'UConn',          pos:'SF/PF', posGrp:'F', yr:'SR',  age:23.6, pts:13.2, reb:5.3,  ast:2.4, blk:0.8, stl:0.8, ts:59.0, usg:18.4, obpm:5.4,  dbpm:3.6,  bpm:9.0  },
  { tankRank:33, name:'Henri Veesaar',      school:'North Carolina', pos:'C',     posGrp:'C', yr:'JR',  age:22.2, pts:17.0, reb:8.7,  ast:2.1, blk:1.2, stl:0.6, ts:66.4, usg:23.3, obpm:7.0,  dbpm:3.8,  bpm:10.7 },
  { tankRank:34, name:'Motiejus Krivas',    school:'Arizona',        pos:'C',     posGrp:'C', yr:'JR',  age:21.6, pts:10.4, reb:8.2,  ast:1.1, blk:1.9, stl:0.7, ts:63.8, usg:17.9, obpm:5.0,  dbpm:5.9,  bpm:10.9 },
  { tankRank:35, name:'Alijah Arenas',      school:'USC',            pos:'SG',    posGrp:'G', yr:'FR',  age:19.3, pts:14.1, reb:2.9,  ast:2.1, blk:0.5, stl:0.9, ts:45.3, usg:31.5, obpm:-0.9, dbpm:-0.1, bpm:-0.9 },
  { tankRank:36, name:'Flory Bidunga',      school:'Kansas',         pos:'C',     posGrp:'C', yr:'SO',  age:21.1, pts:13.3, reb:9.0,  ast:1.5, blk:2.6, stl:0.7, ts:64.7, usg:19.1, obpm:5.1,  dbpm:5.6,  bpm:10.7 },
  { tankRank:37, name:'Tarris Reed',    school:'UConn',          pos:'C',     posGrp:'C', yr:'SR',  age:22.9, pts:14.7, reb:9.0,  ast:2.3, blk:2.0, stl:0.9, ts:61.4, usg:26.1, obpm:6.7,  dbpm:6.1,  bpm:12.9 },
  { tankRank:38, name:'Sergio de Larrea',   school:'Valencia',       pos:'PG/SG', posGrp:'G', yr:'INT', age:20.5, pts:6.7,  reb:2.0,  ast:2.8, blk:0.2, stl:0.5, ts:60.5, usg:22.4, obpm:null, dbpm:null, bpm:null },
  { tankRank:39, name:'Zuby Ejiofor',       school:"St. John's",     pos:'PF',    posGrp:'F', yr:'SR',  age:22.2, pts:16.3, reb:7.3,  ast:3.5, blk:2.1, stl:1.2, ts:60.9, usg:24.8, obpm:8.5,  dbpm:6.0,  bpm:14.5 },
  { tankRank:40, name:'Juke Harris',        school:'Wake Forest',    pos:'SG',    posGrp:'G', yr:'SO',  age:20.9, pts:21.4, reb:6.5,  ast:1.9, blk:0.2, stl:1.3, ts:58.1, usg:28.8, obpm:6.4,  dbpm:0.7,  bpm:7.1  },
  { tankRank:41, name:'Richie Saunders',    school:'BYU',            pos:'SG',    posGrp:'G', yr:'SR',  age:24.8, pts:18.0, reb:5.8,  ast:2.1, blk:0.3, stl:1.7, ts:63.2, usg:24.5, obpm:7.8,  dbpm:2.9,  bpm:10.7 },
  { tankRank:42, name:'Dash Daniels',       school:'Melbourne',      pos:'SG',    posGrp:'G', yr:'INT', age:18.5, pts:4.2,  reb:2.3,  ast:0.8, blk:0.2, stl:0.7, ts:48.2, usg:14.6, obpm:null, dbpm:null, bpm:null },
  { tankRank:43, name:'Ryan Conwell',       school:'Louisville',     pos:'SG',    posGrp:'G', yr:'SR',  age:22.0, pts:18.8, reb:4.8,  ast:2.7, blk:0.2, stl:1.1, ts:56.6, usg:29.5, obpm:5.1,  dbpm:2.2,  bpm:7.3  },
  { tankRank:44, name:'JT Toppin',          school:'Texas Tech',     pos:'PF',    posGrp:'F', yr:'JR',  age:21.0, pts:21.8, reb:10.8, ast:2.1, blk:1.7, stl:1.4, ts:57.1, usg:31.3, obpm:6.4,  dbpm:3.4,  bpm:9.8  },
  { tankRank:45, name:'Jaden Bradley',      school:'Arizona',        pos:'PG',    posGrp:'G', yr:'SR',  age:22.8, pts:13.3, reb:3.4,  ast:4.4, blk:0.1, stl:1.4, ts:56.8, usg:20.9, obpm:3.7,  dbpm:5.3,  bpm:9.0  },
  { tankRank:46, name:'Rueben Chinyelu',    school:'Florida',        pos:'C',     posGrp:'C', yr:'JR',  age:22.7, pts:10.9, reb:11.2, ast:0.7, blk:1.0, stl:0.8, ts:61.0, usg:19.4, obpm:4.6,  dbpm:4.0,  bpm:8.6  },
  { tankRank:47, name:'JoJo Tugler',        school:'Houston',        pos:'PF',    posGrp:'F', yr:'JR',  age:21.1, pts:8.4,  reb:5.3,  ast:1.3, blk:1.5, stl:1.3, ts:60.1, usg:18.1, obpm:3.7,  dbpm:6.9,  bpm:10.5 },
  { tankRank:48, name:'Milan Momcilovic',   school:'Iowa State',     pos:'SF/PF', posGrp:'F', yr:'JR',  age:21.7, pts:16.9, reb:3.1,  ast:1.0, blk:0.2, stl:0.8, ts:69.3, usg:21.2, obpm:8.5,  dbpm:2.9,  bpm:11.4 },
  { tankRank:49, name:'Bruce Thornton',     school:'Ohio State',     pos:'PG',    posGrp:'G', yr:'SR',  age:22.8, pts:19.9, reb:5.1,  ast:3.9, blk:0.2, stl:1.1, ts:66.5, usg:23.6, obpm:9.5,  dbpm:3.2,  bpm:12.7 },
  { tankRank:50, name:'Emanuel Sharp',      school:'Houston',        pos:'SG',    posGrp:'G', yr:'SR',  age:22.3, pts:15.5, reb:3.0,  ast:1.7, blk:0.1, stl:1.2, ts:58.2, usg:25.0, obpm:5.9,  dbpm:4.8,  bpm:10.7 },
  { tankRank:51, name:'Braden Smith',       school:'Purdue',         pos:'PG',    posGrp:'G', yr:'SR',  age:22.9, pts:14.3, reb:3.5,  ast:8.8, blk:0.2, stl:1.7, ts:55.1, usg:24.0, obpm:6.8,  dbpm:3.0,  bpm:9.8  },
  { tankRank:52, name:'Trevon Brazile',     school:'Arkansas',       pos:'PF',    posGrp:'F', yr:'SR',  age:23.4, pts:13.0, reb:7.3,  ast:1.6, blk:1.6, stl:1.5, ts:61.9, usg:17.6, obpm:5.4,  dbpm:3.9,  bpm:9.3  },
  { tankRank:53, name:'Paul McNeil',    school:'NC State',       pos:'SG',    posGrp:'G', yr:'SO',  age:20.2, pts:13.8, reb:3.6,  ast:0.8, blk:0.4, stl:0.6, ts:63.5, usg:20.0, obpm:7.1,  dbpm:0.5,  bpm:7.6  },
  { tankRank:54, name:'Otega Oweh',         school:'Kentucky',       pos:'SG',    posGrp:'G', yr:'SR',  age:22.9, pts:18.6, reb:4.8,  ast:2.7, blk:0.3, stl:1.8, ts:55.4, usg:28.4, obpm:4.0,  dbpm:3.4,  bpm:7.4  },
  { tankRank:55, name:'Tamin Lipsey',       school:'Iowa State',     pos:'PG',    posGrp:'G', yr:'SR',  age:22.9, pts:13.5, reb:3.9,  ast:5.1, blk:0.0, stl:2.3, ts:54.0, usg:22.1, obpm:5.5,  dbpm:5.8,  bpm:11.3 },
  { tankRank:56, name:'Baba Miller',        school:'Cincinnati',     pos:'SF',    posGrp:'F', yr:'SR',  age:22.4, pts:13.0, reb:10.3, ast:3.7, blk:1.2, stl:0.7, ts:57.6, usg:21.1, obpm:3.7,  dbpm:5.8,  bpm:9.4  },
  { tankRank:57, name:'Mouhamed Faye',      school:'Reggio Emilia',  pos:'C',     posGrp:'C', yr:'INT', age:21.4, pts:4.9,  reb:5.1,  ast:0.2, blk:1.0, stl:0.5, ts:65.8, usg:12.0, obpm:null, dbpm:null, bpm:null },
  { tankRank:58, name:'Keyshawn Hall',      school:'Auburn',         pos:'SF',    posGrp:'F', yr:'SR',  age:23.2, pts:19.3, reb:7.1,  ast:2.6, blk:0.6, stl:0.7, ts:60.6, usg:26.7, obpm:6.5,  dbpm:1.0,  bpm:7.5  },
  { tankRank:59, name:'Nate Bittle',        school:'Oregon',         pos:'C',     posGrp:'C', yr:'SR',  age:23.0, pts:16.8, reb:6.9,  ast:2.6, blk:1.8, stl:0.9, ts:56.3, usg:28.2, obpm:6.1,  dbpm:2.9,  bpm:9.0  },
  { tankRank:60, name:'Milos Uzan',         school:'Houston',        pos:'PG',    posGrp:'G', yr:'SR',  age:23.5, pts:11.1, reb:2.7,  ast:4.0, blk:0.1, stl:1.0, ts:49.3, usg:19.6, obpm:2.6,  dbpm:3.8,  bpm:6.4  },
  { tankRank:61, name:'Jeremy Fears',   school:'Michigan State', pos:'PG',    posGrp:'G', yr:'SO',  age:21.2, pts:15.2, reb:2.4,  ast:9.4, blk:0.0, stl:1.3, ts:57.6, usg:24.3, obpm:7.3,  dbpm:4.3,  bpm:11.6 },
  { tankRank:62, name:'Dillon Mitchell',    school:"St. John's",     pos:'SF',    posGrp:'F', yr:'SR',  age:22.7, pts:8.3,  reb:7.0,  ast:3.0, blk:0.7, stl:1.3, ts:55.5, usg:14.5, obpm:3.9,  dbpm:5.3,  bpm:9.3  },
  { tankRank:63, name:'Miles Byrd',         school:'San Diego State',pos:'SG',    posGrp:'G', yr:'JR',  age:21.8, pts:10.4, reb:4.7,  ast:2.6, blk:1.2, stl:1.9, ts:52.8, usg:21.2, obpm:2.5,  dbpm:6.0,  bpm:8.5  },
  { tankRank:64, name:'Kylan Boswell',      school:'Illinois',       pos:'PG',    posGrp:'G', yr:'SR',  age:21.2, pts:12.3, reb:4.0,  ast:3.0, blk:0.0, stl:0.7, ts:55.9, usg:20.4, obpm:3.9,  dbpm:3.1,  bpm:7.0  },
  { tankRank:65, name:'Coen Carr',          school:'Michigan State', pos:'SF/PF', posGrp:'F', yr:'JR',  age:21.6, pts:12.0, reb:5.4,  ast:1.2, blk:0.8, stl:0.5, ts:57.4, usg:20.4, obpm:3.0,  dbpm:3.6,  bpm:6.6  },
  { tankRank:66, name:'Darrion Williams',   school:'NC State',       pos:'SF',    posGrp:'F', yr:'SR',  age:23.2, pts:14.0, reb:4.6,  ast:2.8, blk:0.3, stl:1.1, ts:53.3, usg:24.6, obpm:4.0,  dbpm:1.2,  bpm:5.2  },
  { tankRank:67, name:'Bryce Hopkins',      school:"St. John's",     pos:'SF',    posGrp:'F', yr:'SR',  age:23.8, pts:13.6, reb:6.2,  ast:1.9, blk:0.3, stl:1.1, ts:55.8, usg:22.4, obpm:5.0,  dbpm:3.5,  bpm:8.5  },
  { tankRank:68, name:'Tucker DeVries',     school:'Indiana',        pos:'SG/SF', posGrp:'G', yr:'SR',  age:23.5, pts:13.7, reb:5.3,  ast:3.3, blk:0.6, stl:1.1, ts:54.6, usg:21.9, obpm:3.9,  dbpm:3.0,  bpm:6.9  },
  { tankRank:69, name:'Malik Reneau',       school:'Miami',          pos:'PF',    posGrp:'F', yr:'SR',  age:23.2, pts:18.9, reb:6.5,  ast:2.1, blk:0.8, stl:1.1, ts:61.8, usg:30.6, obpm:6.0,  dbpm:2.5,  bpm:8.5  },
  { tankRank:70, name:'Mark Mitchell',      school:'Missouri',       pos:'SF/PF', posGrp:'F', yr:'SR',  age:22.8, pts:18.3, reb:5.2,  ast:3.6, blk:0.5, stl:0.7, ts:60.6, usg:25.5, obpm:6.8,  dbpm:0.9,  bpm:7.7  },
  { tankRank:71, name:'Michael Ruzic',      school:'Joventut',       pos:'PF',    posGrp:'F', yr:'INT', age:19.7, pts:6.3,  reb:3.8,  ast:0.5, blk:0.5, stl:0.1, ts:66.2, usg:null,  obpm:null, dbpm:null, bpm:null },
];
