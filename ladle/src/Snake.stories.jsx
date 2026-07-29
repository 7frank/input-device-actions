import { useEffect, useRef, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { KeybindingsEditorDialog } from "@nk11/keyboard-interactions/ui";
import "@nk11/keyboard-interactions/ui/index.css";
import { useSvelteComponent } from "./useSvelteComponent";

const COLS = 20;
const ROWS = 20;
const CELL = 20;
const TICK = 120;

function randomFood(snake) {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * COLS),
      y: Math.floor(Math.random() * ROWS),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

function initState() {
  const snake = [{ x: 10, y: 10 }];
  return { snake, food: randomFood(snake), dir: { x: 1, y: 0 }, next: { x: 1, y: 0 }, score: 0, dead: false, paused: false };
}

export const Default = () => {
  const dialogRef = useSvelteComponent(KeybindingsEditorDialog);
  const canvasRef = useRef(null);
  const stateRef = useRef(initState());
  const [display, setDisplay] = useState({ score: 0, dead: false, paused: false });

  useEffect(() => {
    Hotkeys.clearRegistered();
    Hotkeys.register("move-up",    ["up",    "w"], { title: "Move Up",    description: "Move snake up",    persistent: false });
    Hotkeys.register("move-down",  ["down",  "s"], { title: "Move Down",  description: "Move snake down",  persistent: false });
    Hotkeys.register("move-left",  ["left",  "a"], { title: "Move Left",  description: "Move snake left",  persistent: false });
    Hotkeys.register("move-right", ["right", "d"], { title: "Move Right", description: "Move snake right", persistent: false });
    Hotkeys.register("pause",      "p",            { title: "Pause",      description: "Pause / unpause",  persistent: false });
    Hotkeys.register("restart",    "r",            { title: "Restart",    description: "Restart the game", persistent: false });

    const hk = new Hotkeys(canvasRef.current);

    const setDir = (x, y) => {
      const { dir } = stateRef.current;
      if (dir.x === -x && dir.y === -y) return;
      stateRef.current.next = { x, y };
    };

    const onUp    = () => setDir(0, -1);
    const onDown  = () => setDir(0,  1);
    const onLeft  = () => setDir(-1, 0);
    const onRight = () => setDir( 1, 0);
    const onPause = () => {
      stateRef.current.paused = !stateRef.current.paused;
      setDisplay(d => ({ ...d, paused: stateRef.current.paused }));
    };
    const onRestart = () => {
      stateRef.current = initState();
      setDisplay({ score: 0, dead: false, paused: false });
    };

    hk.on("move-up",    onUp);
    hk.on("move-down",  onDown);
    hk.on("move-left",  onLeft);
    hk.on("move-right", onRight);
    hk.on("pause",      onPause);
    hk.on("restart",    onRestart);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    function draw() {
      const { snake, food, dead, paused, score } = stateRef.current;
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

    const interval = setInterval(() => {
      const s = stateRef.current;
      if (s.dead || s.paused) { draw(); return; }

      s.dir = s.next;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        s.dead = true;
        setDisplay(d => ({ ...d, dead: true }));
        draw();
        return;
      }

      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.score++;
        s.food = randomFood(s.snake);
        setDisplay(d => ({ ...d, score: s.score }));
      } else {
        s.snake.pop();
      }
      draw();
    }, TICK);

    canvasRef.current.focus();

    return () => {
      clearInterval(interval);
      hk.off("move-up",    onUp);
      hk.off("move-down",  onDown);
      hk.off("move-left",  onLeft);
      hk.off("move-right", onRight);
      hk.off("pause",      onPause);
      hk.off("restart",    onRestart);
    };
  }, []);

  return (
    <div style={{ fontFamily: "monospace", display: "inline-block" }}>
      <div style={{ marginBottom: "0.5rem", color: "#555", fontSize: "0.85rem" }}>
        Move: <kbd>↑↓←→</kbd> or <kbd>WASD</kbd> · Pause: <kbd>P</kbd> · Restart: <kbd>R</kbd> · Rebind: <kbd>H</kbd>
        <span style={{ float: "right" }}>Score: {display.score}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        style={{ display: "block", outline: "none", cursor: "default" }}
      />
      <div ref={dialogRef} />
    </div>
  );
};
