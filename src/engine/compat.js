export function applyBrowserCompat(canvas) {
  if (!window.structuredClone) {
    window.structuredClone = (value) => JSON.parse(JSON.stringify(value));
  }
  if (!window.crypto?.randomUUID) {
    window.crypto = window.crypto || {};
    window.crypto.randomUUID = () => `e_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
  }
  if (!canvas.requestPointerLock) {
    canvas.requestPointerLock = () => {};
  }
}
