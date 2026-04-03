const SAVE_KEY = 'portalkeep_save_v1';

const defaultSave = () => ({
  completed: {},
  unlockedWeapons: ['peashooter'],
  keybinds: { forward: 'KeyW', back: 'KeyS', left: 'KeyA', right: 'KeyD', interact: 'KeyE', pause: 'Escape' },
  sensitivity: 0.003,
  volume: 0.5,
});

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    return { ...defaultSave(), ...JSON.parse(raw) };
  } catch {
    return defaultSave();
  }
}

export function writeSave(save) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save));
}

export function resetSave() {
  localStorage.removeItem(SAVE_KEY);
}
