import { useEffect, useRef, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { KeybindingsEditorDialog } from "@nk11/keyboard-interactions/ui";
import "@nk11/keyboard-interactions/ui/index.css";
import { useSvelteComponent, useHotkeys, HotkeysDef } from "@nk11/keyboard-interactions/react";
import { COLS, ROWS, CELL, TICK, State, initState, draw, tick } from "./snake-game";

const snakeKeys = {
  "move-up":    { keys: ["up",    "w"], title: "Move Up",    description: "Move snake up"    },
  "move-down":  { keys: ["down",  "s"], title: "Move Down",  description: "Move snake down"  },
  "move-left":  { keys: ["left",  "a"], title: "Move Left",  description: "Move snake left"  },
  "move-right": { keys: ["right", "d"], title: "Move Right", description: "Move snake right" },
  "pause":      { keys: "p",            title: "Pause",      description: "Pause / unpause"  },
  "restart":    { keys: "r",            title: "Restart",    description: "Restart the game" },
} satisfies HotkeysDef;

export const Default = () => {
  const dialogRef = useSvelteComponent(KeybindingsEditorDialog);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State>(initState());
  const [display, setDisplay] = useState({ score: 0, dead: false, paused: false });

  useEffect(() => { Hotkeys.clearRegistered(); }, []);

  const setDir = (x: number, y: number) => {
    const { dir } = stateRef.current;
    if (dir.x === -x && dir.y === -y) return;
    stateRef.current.next = { x, y };
  };

  useHotkeys(snakeKeys, canvasRef)
    .on("move-up",    () => setDir(0, -1))
    .on("move-down",  () => setDir(0,  1))
    .on("move-left",  () => setDir(-1, 0))
    .on("move-right", () => setDir( 1, 0))
    .on("pause",      () => {
      stateRef.current.paused = !stateRef.current.paused;
      setDisplay(d => ({ ...d, paused: stateRef.current.paused }));
    })
    .on("restart",    () => {
      stateRef.current = initState();
      setDisplay({ score: 0, dead: false, paused: false });
    });

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d")!;
    const interval = setInterval(() => {
      tick(stateRef.current,
        (score) => setDisplay(d => ({ ...d, score })),
        ()      => setDisplay(d => ({ ...d, dead: true })),
      );
      draw(ctx, stateRef.current);
    }, TICK);
    return () => clearInterval(interval);
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
