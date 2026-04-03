# Portalkeep Blaster

Portalkeep Blaster is a complete vanilla JavaScript 2.5D raycast FPS inspired by classic 90s maze shooters and whimsical storybook fantasy platformer tone.

## Features
- Raycast renderer (Doom-like 2.5D) with hitscan combat.
- Hub castle with 10 portal paintings selectable in non-linear order.
- 10 handcrafted biomes, each with two unique enemy mixes, a unique weapon pickup, objective flow, and exit gate.
- Persistent progression and unlocks via `localStorage`.
- Final boss portal unlocks after all ten worlds are complete.
- Multi-phase boss fight with escalating pressure.
- HUD, pause menu, controls panel, remappable keys, sensitivity and volume settings.

## Run
From repo root:

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

No build step required.

## Controls
- Move: WASD (remappable)
- Look: Mouse (pointer lock)
- Fire: Left mouse button
- Interact: E (remappable)
- Switch weapons: Mouse wheel or number keys 1-9
- Pause: Escape (remappable)

## Project Structure
- `index.html`
- `styles.css`
- `src/main.js`
- `src/engine/*`
- `src/game/*`
- `src/ui/*`
- `data/levels.js`

## Content Summary
- Hub: Portalkeep Great Hall
- Worlds: Amber Orchard Bastion, Cogwind Gallery, Lumen Stacks, Caramel Underkeep, Thorncloak Maze, Frostbell Nave, Magma Pantry, Mistvine Walkways, Prism Playhouse, Astral Belfry.
- Boss: Archduke Canvaswyrm (3 phases)

