export const WIDTH  = 480;
export const HEIGHT = 480;
export const TICK   = 1000 / 60;

export type Vec = { x: number; y: number };

export type Ship = {
  pos: Vec; vel: Vec; angle: number;
  thrusting: boolean; rotatingLeft: boolean; rotatingRight: boolean; shielding: boolean;
  shieldEnergy: number; dead: boolean; invincible: number;
};

export type Bullet = { pos: Vec; vel: Vec; life: number };

export type Asteroid = { pos: Vec; vel: Vec; radius: number; angle: number; spin: number };

export type State = {
  ship: Ship; bullets: Bullet[]; asteroids: Asteroid[];
  score: number; lives: number; paused: boolean; over: boolean;
};

function rnd(min: number, max: number) { return Math.random() * (max - min) + min; }
function wrap(v: number, max: number)  { return ((v % max) + max) % max; }

function spawnAsteroids(n: number, shipPos: Vec): Asteroid[] {
  return Array.from({ length: n }, () => {
    let pos: Vec;
    do { pos = { x: rnd(0, WIDTH), y: rnd(0, HEIGHT) }; }
    while (Math.hypot(pos.x - shipPos.x, pos.y - shipPos.y) < 100);
    const angle = rnd(0, Math.PI * 2);
    const speed = rnd(0.4, 1.2);
    return { pos, vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, radius: rnd(24, 40), angle: 0, spin: rnd(-0.03, 0.03) };
  });
}

export function initState(): State {
  const ship: Ship = {
    pos: { x: WIDTH / 2, y: HEIGHT / 2 }, vel: { x: 0, y: 0 }, angle: -Math.PI / 2,
    thrusting: false, rotatingLeft: false, rotatingRight: false, shielding: false,
    shieldEnergy: 1, dead: false, invincible: 0,
  };
  return { ship, bullets: [], asteroids: spawnAsteroids(5, ship.pos), score: 0, lives: 3, paused: false, over: false };
}

export function fire(state: State) {
  if (state.ship.dead || state.paused) return;
  const { pos, angle } = state.ship;
  state.bullets.push({
    pos: { x: pos.x + Math.cos(angle) * 16, y: pos.y + Math.sin(angle) * 16 },
    vel: { x: Math.cos(angle) * 7, y: Math.sin(angle) * 7 },
    life: 60,
  });
}

export function tick(state: State, onScore: (s: number) => void, onLivesChange: (l: number) => void) {
  if (state.paused || state.over) return;

  const { ship } = state;

  if (ship.rotatingLeft)  ship.angle -= 0.06;
  if (ship.rotatingRight) ship.angle += 0.06;

  if (ship.thrusting) {
    ship.vel.x += Math.cos(ship.angle) * 0.18;
    ship.vel.y += Math.sin(ship.angle) * 0.18;
  }

  ship.vel.x *= 0.98;
  ship.vel.y *= 0.98;
  ship.pos.x = wrap(ship.pos.x + ship.vel.x, WIDTH);
  ship.pos.y = wrap(ship.pos.y + ship.vel.y, HEIGHT);

  if (ship.shielding && ship.shieldEnergy > 0) {
    ship.shieldEnergy = Math.max(0, ship.shieldEnergy - 0.005);
  } else if (!ship.shielding) {
    ship.shieldEnergy = Math.min(1, ship.shieldEnergy + 0.002);
  }

  if (ship.invincible > 0) ship.invincible--;

  for (const b of state.bullets) {
    b.pos.x = wrap(b.pos.x + b.vel.x, WIDTH);
    b.pos.y = wrap(b.pos.y + b.vel.y, HEIGHT);
    b.life--;
  }
  state.bullets = state.bullets.filter(b => b.life > 0);

  for (const a of state.asteroids) {
    a.pos.x = wrap(a.pos.x + a.vel.x, WIDTH);
    a.pos.y = wrap(a.pos.y + a.vel.y, HEIGHT);
    a.angle += a.spin;
  }

  const nextAsteroids: Asteroid[] = [];
  let scored = false;
  for (const a of state.asteroids) {
    let hit = false;
    for (const b of state.bullets) {
      if (Math.hypot(b.pos.x - a.pos.x, b.pos.y - a.pos.y) < a.radius) {
        b.life = 0; hit = true; scored = true;
        state.score += Math.round(100 / a.radius * 10);
        if (a.radius > 14) {
          for (let i = 0; i < 2; i++) {
            const ang = rnd(0, Math.PI * 2);
            const spd = rnd(0.8, 1.8);
            nextAsteroids.push({ pos: { ...a.pos }, vel: { x: Math.cos(ang) * spd, y: Math.sin(ang) * spd }, radius: a.radius * 0.55, angle: 0, spin: rnd(-0.05, 0.05) });
          }
        }
      }
    }
    if (!hit) nextAsteroids.push(a);
  }
  if (scored) onScore(state.score);
  state.bullets = state.bullets.filter(b => b.life > 0);
  state.asteroids = nextAsteroids;

  if (!ship.dead && ship.invincible === 0) {
    const shielded = ship.shielding && ship.shieldEnergy > 0;
    for (const a of state.asteroids) {
      if (Math.hypot(ship.pos.x - a.pos.x, ship.pos.y - a.pos.y) < a.radius + 10) {
        if (shielded) continue;
        ship.dead = true;
        ship.vel = { x: 0, y: 0 };
        state.lives--;
        onLivesChange(state.lives);
        if (state.lives <= 0) { state.over = true; return; }
        setTimeout(() => {
          ship.pos = { x: WIDTH / 2, y: HEIGHT / 2 };
          ship.dead = false;
          ship.invincible = 120;
        }, 1500);
      }
    }
  }

  if (state.asteroids.length === 0) {
    state.asteroids = spawnAsteroids(5 + Math.floor(state.score / 500), ship.pos);
  }
}

export function draw(ctx: CanvasRenderingContext2D, state: State) {
  const { ship, bullets, asteroids, score, lives, paused, over } = state;

  ctx.fillStyle = "#0a0a1a";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  for (const a of asteroids) {
    ctx.save();
    ctx.translate(a.pos.x, a.pos.y);
    ctx.rotate(a.angle);
    ctx.strokeStyle = "#8899bb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const pts = 8;
    for (let i = 0; i < pts; i++) {
      const ang = (i / pts) * Math.PI * 2;
      const r = a.radius * (0.8 + 0.2 * Math.sin(i * 2.3));
      i === 0 ? ctx.moveTo(Math.cos(ang) * r, Math.sin(ang) * r) : ctx.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  for (const b of bullets) {
    ctx.fillStyle = "#ffee44";
    ctx.beginPath();
    ctx.arc(b.pos.x, b.pos.y, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!ship.dead && (ship.invincible === 0 || Math.floor(ship.invincible / 6) % 2 === 0)) {
    ctx.save();
    ctx.translate(ship.pos.x, ship.pos.y);
    ctx.rotate(ship.angle);
    ctx.strokeStyle = "#44eeff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(14, 0);
    ctx.lineTo(-10, -8);
    ctx.lineTo(-6, 0);
    ctx.lineTo(-10, 8);
    ctx.closePath();
    ctx.stroke();

    if (ship.thrusting) {
      ctx.strokeStyle = "#ff6622";
      ctx.beginPath();
      ctx.moveTo(-6, -4);
      ctx.lineTo(-14 - Math.random() * 6, 0);
      ctx.lineTo(-6, 4);
      ctx.stroke();
    }
    ctx.restore();

    if (ship.shielding && ship.shieldEnergy > 0) {
      ctx.save();
      ctx.translate(ship.pos.x, ship.pos.y);
      ctx.strokeStyle = `rgba(80,180,255,${ship.shieldEnergy * 0.8})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.fillStyle = "#aabbcc";
  ctx.font = "13px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Lives: ${"♥ ".repeat(lives)}`, 10, 38);

  const barW = 60;
  ctx.fillStyle = "#223";
  ctx.fillRect(WIDTH - barW - 10, 10, barW, 8);
  ctx.fillStyle = ship.shieldEnergy > 0.2 ? "#44aaff" : "#ff4444";
  ctx.fillRect(WIDTH - barW - 10, 10, barW * ship.shieldEnergy, 8);
  ctx.fillStyle = "#aabbcc";
  ctx.textAlign = "right";
  ctx.fillText("shield", WIDTH - 10, 30);

  if (paused) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 22px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED — press P", WIDTH / 2, HEIGHT / 2);
  }

  if (over) {
    ctx.fillStyle = "rgba(0,0,0,0.65)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = "#ff4455";
    ctx.font = "bold 28px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", WIDTH / 2, HEIGHT / 2 - 14);
    ctx.fillStyle = "#fff";
    ctx.font = "16px monospace";
    ctx.fillText(`Score: ${score}  —  press R to restart`, WIDTH / 2, HEIGHT / 2 + 20);
  }
}
