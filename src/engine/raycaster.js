const FOV = Math.PI / 3;

export function castRays(ctx, canvas, world, player, enemies, projectiles = []) {
  const w = canvas.width, h = canvas.height;
  ctx.fillStyle = world.themeColor || '#557';
  ctx.fillRect(0, 0, w, h / 2);
  ctx.fillStyle = '#2f2822';
  ctx.fillRect(0, h / 2, w, h / 2);

  const z = new Float32Array(w);
  for (let x = 0; x < w; x++) {
    const cameraX = (2 * x / w - 1) * Math.tan(FOV / 2);
    const rayDirX = Math.cos(player.dir) + cameraX * Math.cos(player.dir + Math.PI / 2);
    const rayDirY = Math.sin(player.dir) + cameraX * Math.sin(player.dir + Math.PI / 2);
    let mapX = Math.floor(player.x), mapY = Math.floor(player.y);

    const deltaDistX = Math.abs(1 / (rayDirX || 0.0001));
    const deltaDistY = Math.abs(1 / (rayDirY || 0.0001));
    let stepX, stepY, sideDistX, sideDistY;

    if (rayDirX < 0) { stepX = -1; sideDistX = (player.x - mapX) * deltaDistX; }
    else { stepX = 1; sideDistX = (mapX + 1 - player.x) * deltaDistX; }
    if (rayDirY < 0) { stepY = -1; sideDistY = (player.y - mapY) * deltaDistY; }
    else { stepY = 1; sideDistY = (mapY + 1 - player.y) * deltaDistY; }

    let hit = false, side = 0;
    while (!hit) {
      if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0; }
      else { sideDistY += deltaDistY; mapY += stepY; side = 1; }
      const cell = world.map[mapY]?.[mapX] ?? '#';
      if (cell === '#') hit = true;
    }

    const perp = side === 0
      ? (mapX - player.x + (1 - stepX) / 2) / (rayDirX || 0.0001)
      : (mapY - player.y + (1 - stepY) / 2) / (rayDirY || 0.0001);

    const lineHeight = Math.min(h, Math.floor(h / Math.max(0.001, perp)));
    const y0 = Math.floor((h - lineHeight) / 2);
    const shade = Math.max(40, 220 - perp * 22 - side * 30);
    ctx.fillStyle = `rgb(${shade},${shade * 0.9},${shade * 0.8})`;
    ctx.fillRect(x, y0, 1, lineHeight);
    z[x] = perp;
  }

  const sprites = [...enemies, ...projectiles].map((e) => ({ ...e, dist: (e.x - player.x) ** 2 + (e.y - player.y) ** 2 }))
    .sort((a, b) => b.dist - a.dist);

  for (const sp of sprites) {
    const dx = sp.x - player.x, dy = sp.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const ang = Math.atan2(dy, dx) - player.dir;
    const normAng = Math.atan2(Math.sin(ang), Math.cos(ang));
    if (Math.abs(normAng) > FOV * 0.7) continue;
    const screenX = (0.5 + normAng / FOV) * w;
    const size = Math.max(6, h / (dist + 0.2));
    const x0 = Math.floor(screenX - size / 2);
    const y0 = Math.floor(h / 2 - size / 2);
    for (let sx = 0; sx < size; sx++) {
      const px = x0 + sx;
      if (px < 0 || px >= w || z[px] < dist) continue;
      ctx.fillStyle = sp.color || '#f00';
      ctx.fillRect(px, y0, 1, size);
    }
    if (sp.hp && dist < 8) {
      ctx.fillStyle = '#000';
      ctx.fillRect(x0, y0 - 8, size, 4);
      ctx.fillStyle = '#f44';
      ctx.fillRect(x0, y0 - 8, size * (sp.hp / sp.maxHp), 4);
    }
  }

  ctx.strokeStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(w / 2 - 8, h / 2); ctx.lineTo(w / 2 + 8, h / 2);
  ctx.moveTo(w / 2, h / 2 - 8); ctx.lineTo(w / 2, h / 2 + 8);
  ctx.stroke();
}
