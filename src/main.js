import { castRays } from './engine/raycaster.js';
import { Input } from './engine/input.js';
import { Game } from './game/game.js';
import { loadSave, writeSave, resetSave } from './game/save.js';
import { renderHUD, setupMenus, renderWeaponList } from './ui/ui.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const hud = document.getElementById('hud');
const startOverlay = document.getElementById('startOverlay');
const messageEl = document.getElementById('message');

const save = loadSave();
const game = new Game(save);
let input = new Input(save.keybinds);
let paused = true;
let last = performance.now();

function resize() {
  canvas.width = Math.floor(window.innerWidth);
  canvas.height = Math.floor(window.innerHeight);
}
window.addEventListener('resize', resize);
resize();

const menus = setupMenus({
  save,
  onResume: () => { paused = false; menus.hidePause(); canvas.requestPointerLock(); },
  onBackHub: () => { game.loadLevel('hub'); paused = false; menus.hidePause(); }
});

function showMessage(text) {
  if (!text) { messageEl.classList.remove('visible'); return; }
  messageEl.textContent = text;
  messageEl.classList.add('visible');
}

function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  if (!paused) {
    game.movePlayer(input, dt, save.sensitivity);
    game.update(dt, input);
    castRays(ctx, canvas, game.current, game.player, [...game.enemies, ...game.pickups], game.effects);
    renderHUD(hud, game);
    showMessage(game.messageTimer > 0 ? `${game.message} | Weapons: ${renderWeaponList(game)}` : '');
    writeSave(save);
  }

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

document.getElementById('startBtn').onclick = () => {
  paused = false;
  startOverlay.classList.remove('visible');
  if (canvas.requestPointerLock) canvas.requestPointerLock();
};

document.getElementById('resetSaveBtn').onclick = () => {
  resetSave();
  location.reload();
};

window.addEventListener('keydown', (e) => {
  if (e.code === save.keybinds.pause) {
    paused = !paused;
    if (paused) menus.showPause();
    else { menus.hidePause(); if (canvas.requestPointerLock) canvas.requestPointerLock(); }
  }
});
