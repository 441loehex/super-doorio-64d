import { HUB_LEVEL, LEVELS, BOSS_LEVEL, ALL_LEVEL_IDS, THEME_NAME_BY_LEVEL } from '../../data/levels.js';
import { ENEMY_TYPES, WEAPONS } from './defs.js';

const rand = (a, b) => a + Math.random() * (b - a);

export class Game {
  constructor(save) {
    this.save = save;
    this.player = {
      x: 2.5, y: 2.5, dir: 0,
      speed: 3.2,
      health: 100,
      armor: 25,
      ammo: { light: 999, paint: 40, bubble: 20, gear: 30, sun: 50, frost: 45, thorn: 24, candy: 18, mist: 70, magma: 38, star: 16, prism: 20 },
      weapons: [...new Set(['peashooter', ...save.unlockedWeapons])],
      weaponIndex: 0,
      shotCooldown: 0,
      keys: 0,
      score: 0,
    };
    this.current = null;
    this.enemies = [];
    this.effects = [];
    this.pickups = [];
    this.message = '';
    this.messageTimer = 0;
    this.objectiveDone = false;
    this.levelStartId = 'hub';
    this.boss = null;
    this.won = false;
    this.loadLevel('hub');
  }

  get currentWeapon() {
    return WEAPONS[this.player.weapons[this.player.weaponIndex]];
  }

  allTenCleared() {
    return ALL_LEVEL_IDS.every((id) => this.save.completed[id]);
  }

  loadLevel(id) {
    this.objectiveDone = false;
    this.player.keys = 0;
    this.enemies = [];
    this.pickups = [];
    this.effects = [];
    this.boss = null;

    const level = id === 'hub' ? HUB_LEVEL : id === 'boss' ? BOSS_LEVEL : LEVELS.find((l) => l.id === id);
    this.current = structuredClone(level);
    this.levelStartId = id;
    for (let y = 0; y < this.current.map.length; y++) {
      for (let x = 0; x < this.current.map[y].length; x++) {
        const c = this.current.map[y][x];
        if (c === 'S') {
          this.player.x = x + 0.5; this.player.y = y + 0.5; this.current.map[y][x] = '.';
        }
        if (['a', 'b', '!', 'X'].includes(c)) {
          this.spawnEnemyByChar(c, x + 0.5, y + 0.5);
          this.current.map[y][x] = '.';
        }
      }
    }

    if (this.current.weaponId && !this.player.weapons.includes(this.current.weaponId)) {
      this.pickups.push({ type: 'weapon', weaponId: this.current.weaponId, x: this.player.x + 1.2, y: this.player.y + 0.2, color: WEAPONS[this.current.weaponId].color });
    }
    this.pickups.push({ type: 'health', amount: 25, x: this.player.x + 0.6, y: this.player.y + 1.1, color: '#5cff8d' });
    this.pickups.push({ type: 'ammo', ammoType: this.current.weaponId ? WEAPONS[this.current.weaponId].ammoType : 'light', amount: 24, x: this.player.x - 0.8, y: this.player.y + 1.2, color: '#ffd86f' });

    this.flash(`${this.current.name} — ${id === 'hub' ? 'Choose a portal painting.' : this.current.objective}`);
  }

  spawnEnemyByChar(ch, x, y) {
    if (ch === 'X') {
      this.boss = { ...ENEMY_TYPES.boss, x, y, maxHp: ENEMY_TYPES.boss.hp, hp: ENEMY_TYPES.boss.hp, phase: 1, attackTimer: 0, color: '#ff9544' };
      this.enemies.push(this.boss);
      return;
    }
    const mix = this.current.enemyMix || ['gobflare', 'blinkbat'];
    const typeId = ch === 'a' ? mix[0] : ch === 'b' ? mix[1] : mix[Math.floor(Math.random() * mix.length)];
    const type = ENEMY_TYPES[typeId];
    this.enemies.push({ id: crypto.randomUUID(), typeId, x, y, hp: type.hp, maxHp: type.hp, cooldown: rand(0.1, 0.8), ...type });
  }

  flash(text, t = 2.6) { this.message = text; this.messageTimer = t; }

  isWall(x, y) {
    const cell = this.current.map[Math.floor(y)]?.[Math.floor(x)] ?? '#';
    return cell === '#';
  }

  movePlayer(input, dt, sensitivity) {
    const look = input.consumeLookDelta();
    this.player.dir += look * sensitivity;
    const { f, s } = input.getAxis();
    const dirX = Math.cos(this.player.dir), dirY = Math.sin(this.player.dir);
    const sideX = Math.cos(this.player.dir + Math.PI / 2), sideY = Math.sin(this.player.dir + Math.PI / 2);
    const nx = this.player.x + (dirX * f + sideX * s) * this.player.speed * dt;
    const ny = this.player.y + (dirY * f + sideY * s) * this.player.speed * dt;
    if (!this.isWall(nx, this.player.y)) this.player.x = nx;
    if (!this.isWall(this.player.x, ny)) this.player.y = ny;
  }

  update(dt, input) {
    if (this.messageTimer > 0) this.messageTimer -= dt;
    this.player.shotCooldown -= dt;

    const wheel = input.consumeWheel();
    if (wheel !== 0) {
      const len = this.player.weapons.length;
      this.player.weaponIndex = (this.player.weaponIndex + (wheel > 0 ? 1 : -1) + len) % len;
    }
    for (let i = 0; i < 9; i++) if (input.pressed(`Digit${i + 1}`) && this.player.weapons[i]) this.player.weaponIndex = i;

    if (input.shootHeld) this.tryShoot();

    this.updateEnemies(dt);
    this.collectPickups();
    this.checkTiles(input);
    if (this.player.health <= 0) {
      this.flash('You were splatted! Returning to hub...');
      this.player.health = 100; this.player.armor = 25;
      this.loadLevel('hub');
    }
  }

  tryShoot() {
    const w = this.currentWeapon;
    if (!w || this.player.shotCooldown > 0) return;
    const ammoType = w.ammoType;
    if ((this.player.ammo[ammoType] ?? 0) <= 0) { this.flash('Out of ammo!'); return; }
    this.player.shotCooldown = w.cooldown;
    this.player.ammo[ammoType]--;

    const shots = w.pellets || 1;
    for (let i = 0; i < shots; i++) {
      const angle = this.player.dir + rand(-w.spread, w.spread);
      let best = null;
      for (const e of this.enemies) {
        if (e.hp <= 0) continue;
        const dx = e.x - this.player.x, dy = e.y - this.player.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > w.range) continue;
        const a = Math.atan2(dy, dx);
        const delta = Math.abs(Math.atan2(Math.sin(a - angle), Math.cos(a - angle)));
        if (delta < 0.14 && (!best || dist < best.dist)) best = { e, dist };
      }
      if (best) {
        best.e.hp -= w.damage;
        this.effects.push({ x: best.e.x, y: best.e.y, ttl: 0.15, color: '#fff' });
        if (best.e.hp <= 0) {
          this.player.score += best.e.score || 10;
          if (best.e === this.boss && this.boss.phase >= 3) {
            this.won = true;
            this.flash('Canvaswyrm defeated! The Prism Crown is yours!');
          }
        }
      }
    }
  }

  updateEnemies(dt) {
    for (const e of this.enemies) {
      if (e.hp <= 0) continue;
      const dx = this.player.x - e.x, dy = this.player.y - e.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (e === this.boss) {
        const ratio = e.hp / e.maxHp;
        const nextPhase = ratio < 0.66 ? (ratio < 0.33 ? 3 : 2) : 1;
        if (nextPhase !== e.phase) {
          e.phase = nextPhase;
          this.flash(`Boss phase ${e.phase}!`);
        }
        const speed = 0.7 + e.phase * 0.35;
        if (dist > 3) {
          const nx = e.x + (dx / dist) * speed * dt;
          const ny = e.y + (dy / dist) * speed * dt;
          if (!this.isWall(nx, e.y)) e.x = nx;
          if (!this.isWall(e.x, ny)) e.y = ny;
        }
        e.attackTimer -= dt;
        if (e.attackTimer <= 0) {
          e.attackTimer = Math.max(0.4, 1.8 - e.phase * 0.45);
          this.damagePlayer(8 + e.phase * 6);
        }
        continue;
      }

      if (dist < 8) {
        if (dist > e.range) {
          const nx = e.x + (dx / dist) * e.speed * dt;
          const ny = e.y + (dy / dist) * e.speed * dt;
          if (!this.isWall(nx, e.y)) e.x = nx;
          if (!this.isWall(e.x, ny)) e.y = ny;
        }
        e.cooldown -= dt;
        if (dist <= e.range && e.cooldown <= 0) {
          this.damagePlayer(e.damage);
          e.cooldown = rand(0.8, 1.5);
        }
      }
    }

    this.effects = this.effects.filter((fx) => (fx.ttl -= dt) > 0);
    this.enemies = this.enemies.filter((e) => e.hp > 0 || e === this.boss);

    if (this.current.id !== 'hub' && this.current.id !== 'boss') {
      const allDead = this.enemies.every((e) => e.hp <= 0);
      if (allDead) this.objectiveDone = true;
    }
  }

  damagePlayer(raw) {
    let dmg = raw;
    if (this.player.armor > 0) {
      const absorb = Math.min(this.player.armor, raw * 0.5);
      this.player.armor -= absorb;
      dmg -= absorb;
    }
    this.player.health -= dmg;
  }

  collectPickups() {
    this.pickups = this.pickups.filter((p) => {
      const dx = p.x - this.player.x, dy = p.y - this.player.y;
      if (Math.sqrt(dx * dx + dy * dy) > 0.7) return true;
      if (p.type === 'health') this.player.health = Math.min(100, this.player.health + p.amount);
      if (p.type === 'ammo') this.player.ammo[p.ammoType] = (this.player.ammo[p.ammoType] || 0) + p.amount;
      if (p.type === 'weapon') {
        if (!this.player.weapons.includes(p.weaponId)) {
          this.player.weapons.push(p.weaponId);
          this.save.unlockedWeapons = [...new Set([...this.save.unlockedWeapons, p.weaponId])];
          this.flash(`Unlocked ${WEAPONS[p.weaponId].name}!`);
        }
      }
      return false;
    });
  }

  checkTiles(input) {
    const cell = this.current.map[Math.floor(this.player.y)]?.[Math.floor(this.player.x)] || '.';
    if (cell === 'K') {
      this.player.keys = 1;
      this.current.map[Math.floor(this.player.y)][Math.floor(this.player.x)] = '.';
      this.objectiveDone = true;
      this.flash('Objective item collected. Reach exit.');
    }

    if (this.current.id === 'hub') {
      const target = HUB_LEVEL.portals[cell];
      if (target && input.pressed(this.save.keybinds.interact)) {
        if (target === 'boss' && !this.allTenCleared()) this.flash('Final portal remains sealed.');
        else this.loadLevel(target);
      }
      return;
    }

    if (cell === 'E' && input.pressed(this.save.keybinds.interact)) {
      if (this.current.id === 'boss') {
        if (this.won) {
          this.loadLevel('hub');
          this.flash('You won! Continue exploring the realms.');
        } else this.flash('Defeat the boss first!');
        return;
      }

      if (this.objectiveDone || this.player.keys > 0) {
        this.save.completed[this.current.id] = true;
        this.flash(`${THEME_NAME_BY_LEVEL[this.current.id]} cleared! Returning to hub.`);
        this.loadLevel('hub');
      } else {
        this.flash('Objective incomplete.');
      }
    }
  }
}
