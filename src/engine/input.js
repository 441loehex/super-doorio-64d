export class Input {
  constructor(bindings) {
    this.bindings = bindings;
    this.keys = new Set();
    this.mouseDeltaX = 0;
    this.shootHeld = false;
    this.wheel = 0;
    window.addEventListener('keydown', (e) => this.keys.add(e.code));
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement) this.mouseDeltaX += e.movementX;
    });
    window.addEventListener('mousedown', () => this.shootHeld = true);
    window.addEventListener('mouseup', () => this.shootHeld = false);
    window.addEventListener('wheel', (e) => this.wheel += Math.sign(e.deltaY));
  }

  getAxis() {
    let f = 0, s = 0;
    if (this.keys.has(this.bindings.forward)) f += 1;
    if (this.keys.has(this.bindings.back)) f -= 1;
    if (this.keys.has(this.bindings.right)) s += 1;
    if (this.keys.has(this.bindings.left)) s -= 1;
    return { f, s };
  }

  consumeLookDelta() {
    const v = this.mouseDeltaX;
    this.mouseDeltaX = 0;
    return v;
  }

  consumeWheel() {
    const v = this.wheel;
    this.wheel = 0;
    return v;
  }

  pressed(code) {
    return this.keys.has(code);
  }
}
