export const WEAPONS = {
  peashooter: { id: 'peashooter', name: 'Pea Shooter', ammoType: 'light', damage: 12, cooldown: 0.36, spread: 0.01, range: 10, color: '#f7e58c' },
  paintPopper: { id: 'paintPopper', name: 'Paint Popper', ammoType: 'paint', damage: 22, cooldown: 0.48, spread: 0.03, range: 9, color: '#ff7f7f' },
  bubbleBurst: { id: 'bubbleBurst', name: 'Bubble Burst', ammoType: 'bubble', damage: 7, pellets: 6, cooldown: 0.75, spread: 0.2, range: 6, color: '#95e3ff' },
  clockworkRifle: { id: 'clockworkRifle', name: 'Clockwork Rifle', ammoType: 'gear', damage: 30, cooldown: 0.65, spread: 0.02, range: 12, color: '#e0d3aa' },
  sunScepter: { id: 'sunScepter', name: 'Sun Scepter', ammoType: 'sun', damage: 20, cooldown: 0.25, spread: 0.02, range: 9, color: '#ffc14f' },
  frostBell: { id: 'frostBell', name: 'Frost Bell', ammoType: 'frost', damage: 16, cooldown: 0.2, spread: 0.015, range: 8, color: '#a5dbff' },
  thornLauncher: { id: 'thornLauncher', name: 'Thorn Launcher', ammoType: 'thorn', damage: 34, cooldown: 0.95, spread: 0.04, range: 11, color: '#8ad067' },
  candyCannon: { id: 'candyCannon', name: 'Candy Cannon', ammoType: 'candy', damage: 42, cooldown: 1.1, spread: 0.07, range: 7, color: '#ff87f8' },
  mistCarbine: { id: 'mistCarbine', name: 'Mist Carbine', ammoType: 'mist', damage: 18, cooldown: 0.18, spread: 0.035, range: 10, color: '#d6f1ff' },
  magmaMandolin: { id: 'magmaMandolin', name: 'Magma Mandolin', ammoType: 'magma', damage: 26, cooldown: 0.42, spread: 0.06, range: 8, color: '#ff7644' },
  starNeedler: { id: 'starNeedler', name: 'Star Needler', ammoType: 'star', damage: 58, cooldown: 1.3, spread: 0.02, range: 14, color: '#e4deff' },
  prismBreaker: { id: 'prismBreaker', name: 'Prism Breaker', ammoType: 'prism', damage: 90, cooldown: 1.8, spread: 0.01, range: 15, color: '#fff' },
};

export const ENEMY_TYPES = {
  gobflare: { name: 'Gobflare', hp: 40, speed: 1.4, damage: 7, range: 1.5, color: '#ff8f63', score: 10 },
  blinkbat: { name: 'Blink Bat', hp: 28, speed: 1.9, damage: 5, range: 1.2, color: '#9d87ff', score: 12 },
  tinKnight: { name: 'Tin Knight', hp: 80, speed: 1.0, damage: 12, range: 1.4, color: '#b8c7ce', score: 20 },
  murkToad: { name: 'Murk Toad', hp: 56, speed: 1.25, damage: 9, range: 1.5, color: '#68a96b', score: 18 },
  waxWisp: { name: 'Wax Wisp', hp: 34, speed: 1.6, damage: 8, range: 1.8, color: '#ffdc7a', score: 15 },
  ironJester: { name: 'Iron Jester', hp: 70, speed: 1.3, damage: 11, range: 1.3, color: '#ff6fcb', score: 24 },
  emberMole: { name: 'Ember Mole', hp: 75, speed: 1.15, damage: 14, range: 1.3, color: '#ff704e', score: 28 },
  mirrorCrow: { name: 'Mirror Crow', hp: 48, speed: 1.75, damage: 10, range: 1.7, color: '#a7d7ff', score: 20 },
  boss: { name: 'Archduke Canvaswyrm', hp: 1200, speed: 1.0, damage: 18, range: 2.2, color: '#e90', score: 1000 },
};

export const LEVEL_THEMES = [
  'Sunset Courtyard', 'Clocktower Workshop', 'Moonlit Library', 'Candy Catacombs', 'Verdant Atrium',
  'Frost Gallery', 'Magma Kitchen', 'Storm Conservatory', 'Mirror Theater', 'Star Observatory'
];
