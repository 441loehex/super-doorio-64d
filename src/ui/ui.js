import { WEAPONS } from '../game/defs.js';

export function renderHUD(el, game) {
  const w = game.currentWeapon;
  const ammo = game.player.ammo[w.ammoType] ?? 0;
  const completed = Object.keys(game.save.completed).length;
  el.innerHTML = `
    <div><strong>${game.current.name}</strong><br/>HP ${Math.round(game.player.health)} | Armor ${Math.round(game.player.armor)} | Score ${game.player.score}</div>
    <div>Weapon: ${w.name} (${ammo})<br/>Objective: ${game.current.objective}</div>
    <div>Worlds Cleared: ${completed}/10<br/>Boss Portal: ${game.allTenCleared() ? 'Unlocked' : 'Locked'}</div>
  `;
}

export function setupMenus({ save, onResume, onBackHub }) {
  const pauseMenu = document.getElementById('pauseMenu');
  const controlsPanel = document.getElementById('controlsPanel');
  const sensitivity = document.getElementById('sensitivity');
  const volume = document.getElementById('volume');
  const keybinds = document.getElementById('keybinds');

  sensitivity.value = save.sensitivity;
  volume.value = save.volume;

  sensitivity.oninput = () => save.sensitivity = Number(sensitivity.value);
  volume.oninput = () => save.volume = Number(volume.value);

  document.getElementById('resumeBtn').onclick = onResume;
  document.getElementById('hubBtn').onclick = () => {
    if (confirm('Return to hub immediately?')) onBackHub();
  };

  document.getElementById('controlsBtn').onclick = () => controlsPanel.classList.add('visible');
  document.getElementById('closeControlsBtn').onclick = () => controlsPanel.classList.remove('visible');

  keybinds.innerHTML = '';
  Object.entries(save.keybinds).forEach(([k, code]) => {
    const row = document.createElement('div');
    row.textContent = `${k}: ${code}`;
    const b = document.createElement('button');
    b.textContent = 'Rebind';
    b.onclick = () => {
      row.textContent = `${k}: ...press key...`;
      const handler = (e) => {
        save.keybinds[k] = e.code;
        row.textContent = `${k}: ${e.code}`;
        row.appendChild(b);
        window.removeEventListener('keydown', handler);
      };
      window.addEventListener('keydown', handler);
    };
    row.appendChild(b);
    keybinds.appendChild(row);
  });

  return {
    showPause() { pauseMenu.classList.add('visible'); },
    hidePause() { pauseMenu.classList.remove('visible'); controlsPanel.classList.remove('visible'); },
  };
}

export function renderWeaponList(game) {
  return game.player.weapons.map((id, i) => `${i + 1}:${WEAPONS[id].name}`).join(', ');
}
