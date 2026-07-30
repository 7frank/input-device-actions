export const COLS = 20;
export const ROWS = 20;
export const CELL = 20;
export const TICK = 120;

export type Vec = { x: number; y: number };
export type State = { snake: Vec[]; food: Vec; dir: Vec; next: Vec; score: number; dead: boolean; paused: boolean };

export function randomFood(snake: Vec[]): Vec {
  let pos: Vec;
  do {
    pos = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export function initState(): State {
  const snake = [{ x: 10, y: 10 }];
  return { snake, food: randomFood(snake), dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, score: 0, dead: false, paused: false };
}

export function draw(ctx: CanvasRenderingContext2D, state: State) {
  const { snake, food, dead, paused, score } = state;

  ctx.fillStyle = "#1a1a2e";
  ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

  ctx.fillStyle = "#e94560";
  ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);

  snake.forEach((s, i) => {
    ctx.fillStyle = i === 0 ? "#0f9b8e" : "#16c79a";
    ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
  });

  if (dead) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.fillStyle = "#e94560";
    ctx.font = "bold 24px monospace";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", COLS * CELL / 2, ROWS * CELL / 2 - 10);
    ctx.fillStyle = "#fff";
    ctx.font = "14px monospace";
    ctx.fillText(`Score: ${score}  —  press R to restart`, COLS * CELL / 2, ROWS * CELL / 2 + 20);
  } else if (paused) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("PAUSED — press P", COLS * CELL / 2, ROWS * CELL / 2);
  }
}

export function tick(s: State, onEat: (score: number) => void, onDie: () => void) {
  if (s.dead || s.paused) return;
  s.dir = s.next;
  const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    s.dead = true;
    onDie();
    return;
  }
  s.snake.unshift(head);
  if (head.x === s.food.x && head.y === s.food.y) {
    s.score++;
    s.food = randomFood(s.snake);
    onEat(s.score);
  } else {
    s.snake.pop();
  }
}
