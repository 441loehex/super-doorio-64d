import { LEVEL_THEMES } from '../src/game/defs.js';

const parseMap = (rows) => rows.map((r) => r.split(''));

const levelTemplate = (id, name, themeColor, weaponId, objective, enemyMix, rows) => ({
  id, name, themeColor, weaponId, objective, enemyMix,
  map: parseMap(rows),
});

export const HUB_LEVEL = {
  id: 'hub',
  name: 'Portalkeep Great Hall',
  themeColor: '#7e6ad1',
  objective: 'Step into a painting portal to clear worlds. Complete all ten for the boss gate.',
  map: parseMap([
    '#########################',
    '#S...1....2....3....4..#',
    '#.......................#',
    '#..#####.........#####..#',
    '#..#...#.........#...#..#',
    '#..#...#....B....#...#..#',
    '#..#####.........#####..#',
    '#.......................#',
    '#..5....6....7....8.....#',
    '#.......................#',
    '#........9....0.........#',
    '#########################',
  ]),
  portals: {
    '1': 'level1', '2': 'level2', '3': 'level3', '4': 'level4', '5': 'level5',
    '6': 'level6', '7': 'level7', '8': 'level8', '9': 'level9', '0': 'level10', 'B': 'boss'
  }
};

export const LEVELS = [
  levelTemplate('level1', 'Amber Orchard Bastion', '#ef9f55', 'paintPopper', 'Collect the Orchard Sigil (K) and exit (E).', ['gobflare', 'blinkbat'], [
    '################', '#S....#....K..E#', '#.##..#..##....#', '#..!..#.....##.#', '#.##..###.#....#', '#....a....#..b.#', '################',
  ]),
  levelTemplate('level2', 'Cogwind Gallery', '#8e9aaa', 'clockworkRifle', 'Find the Wind Key (K), then open the brass gate (E).', ['tinKnight', 'blinkbat'], [
    '################', '#S..#....a....E#', '#.#.#.####.##..#', '#.#...K..#..!..#', '#.####.#.#.##..#', '#b.....#........#', '################',
  ]),
  levelTemplate('level3', 'Lumen Stacks', '#8a76e9', 'sunScepter', 'Light all runes by defeating enemies, then exit (E).', ['waxWisp', 'mirrorCrow'], [
    '################', '#S....#..a....E#', '#.##..#.####...#', '#....K#....#...#', '#.#######..#.!.#', '#b.......#......#', '################',
  ]),
  levelTemplate('level4', 'Caramel Underkeep', '#cf7b6d', 'candyCannon', 'Grab sweet key (K), avoid choke points, reach exit (E).', ['ironJester', 'murkToad'], [
    '################', '#S.a....#....E.#', '#.####..#..##..#', '#......K#..!..##', '#.##.####..##..#', '#..b...........#', '################',
  ]),
  levelTemplate('level5', 'Thorncloak Maze', '#4ba86e', 'thornLauncher', 'Slay both wardens (a,b), take key (K), escape (E).', ['murkToad', 'gobflare'], [
    '################', '#S...a.#.......#', '#.###..#.#####.#', '#...#..#....K#E#', '#.#.#.##.!....##', '#.#...b........#', '################',
  ]),
  levelTemplate('level6', 'Frostbell Nave', '#75bce8', 'frostBell', 'Collect frost key (K) and ring the bell at exit (E).', ['tinKnight', 'waxWisp'], [
    '################', '#S......#...a.E#', '#.####..#.##...#', '#....#..#K.#...#', '#.##.#.##..#.!.#', '#b...#.........#', '################',
  ]),
  levelTemplate('level7', 'Magma Pantry', '#e46a3a', 'magmaMandolin', 'Survive molten pantry, secure key (K), then exit (E).', ['emberMole', 'gobflare'], [
    '################', '#S......#....E.#', '#.####..#.##...#', '#a...#..#K.#...#', '#.##.#.##..#.!.#', '#....#....b....#', '################',
  ]),
  levelTemplate('level8', 'Mistvine Walkways', '#78b4a2', 'mistCarbine', 'Retrieve mist key (K) and leave via ivy gate (E).', ['mirrorCrow', 'murkToad'], [
    '################', '#S....#..a...E.#', '#.##..#.####...#', '#....K#....#...#', '#.#######..#.!.#', '#b.......#......#', '################',
  ]),
  levelTemplate('level9', 'Prism Playhouse', '#b980d8', 'bubbleBurst', 'Defeat prank duo, claim key (K), and exit (E).', ['ironJester', 'blinkbat'], [
    '################', '#S....#....K..E#', '#.##..#..##....#', '#..a..#.....##.#', '#.##..###.#....#', '#....b....#..!.#', '################',
  ]),
  levelTemplate('level10', 'Astral Belfry', '#8c96f7', 'starNeedler', 'Take astral key (K), survive sentries, use exit (E).', ['waxWisp', 'tinKnight'], [
    '################', '#S..#....a....E#', '#.#.#.####.##..#', '#.#...K..#..!..#', '#.####.#.#.##..#', '#b.....#........#', '################',
  ]),
];

export const BOSS_LEVEL = {
  id: 'boss',
  name: 'Canvaswyrm Throne',
  themeColor: '#6f1222',
  objective: 'Defeat the Archduke Canvaswyrm (3 phases) and claim the Prism Crown.',
  weaponId: 'prismBreaker',
  enemyMix: [],
  map: parseMap([
    '#####################',
    '#S..................#',
    '#..######..######...#',
    '#...................#',
    '#...####....####....#',
    '#...................#',
    '#.........X.........#',
    '#...................#',
    '#...####....####....#',
    '#..................E#',
    '#####################',
  ])
};

export const ALL_LEVEL_IDS = LEVELS.map((l) => l.id);
export const THEME_NAME_BY_LEVEL = Object.fromEntries(LEVELS.map((l, i) => [l.id, LEVEL_THEMES[i]]));
