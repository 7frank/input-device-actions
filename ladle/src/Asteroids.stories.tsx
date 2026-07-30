import { useEffect, useRef, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { KeybindingsEditorDialog } from "@nk11/keyboard-interactions/ui";
import "@nk11/keyboard-interactions/ui/index.css";
import { useSvelteComponent, useHotkeys, HotkeysDef } from "@nk11/keyboard-interactions/react";
import { WIDTH, HEIGHT, TICK, State, initState, fire, tick, draw } from "./asteroids-game";

const asteroidsKeys = {
  "thrust":       { keys: ["up",    "w"],     title: "Thrust",       description: "Accelerate forward"  },
  "rotate-left":  { keys: ["left",  "a"],     title: "Rotate Left",  description: "Rotate ship left"    },
  "rotate-right": { keys: ["right", "d"],     title: "Rotate Right", description: "Rotate ship right"   },
  "fire":         { keys: "space",            title: "Fire",         description: "Shoot a bullet"      },
  "shield":       { keys: "shift",            title: "Shield",       description: "Hold to activate"    },
  "pause":        { keys: "p",               title: "Pause",        description: "Pause / unpause"     },
  "restart":      { keys: "r",               title: "Restart",      description: "Restart the game"    },
} satisfies HotkeysDef;

export const Default = () => {
  const dialogRef = useSvelteComponent(KeybindingsEditorDialog);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef<State>(initState());
  const [display, setDisplay] = useState({ score: 0, lives: 3 });

  useEffect(() => { Hotkeys.clearRegistered(); }, []);

  useHotkeys(asteroidsKeys, canvasRef)
    .on("thrust",       { keydown: () => { stateRef.current.ship.thrusting      = true;  },
                          keyup:   () => { stateRef.current.ship.thrusting      = false; } })
    .on("rotate-left",  { keydown: () => { stateRef.current.ship.rotatingLeft   = true;  },
                          keyup:   () => { stateRef.current.ship.rotatingLeft   = false; } })
    .on("rotate-right", { keydown: () => { stateRef.current.ship.rotatingRight  = true;  },
                          keyup:   () => { stateRef.current.ship.rotatingRight  = false; } })
    .on("shield",       { keydown: () => { stateRef.current.ship.shielding      = true;  },
                          keyup:   () => { stateRef.current.ship.shielding      = false; } })
    .on("fire",    () => fire(stateRef.current))
    .on("pause",   () => { stateRef.current.paused = !stateRef.current.paused; })
    .on("restart", () => { stateRef.current = initState(); setDisplay({ score: 0, lives: 3 }); });

  useEffect(() => {
    const ctx = canvasRef.current!.getContext("2d")!;
    const interval = setInterval(() => {
      tick(stateRef.current,
        (score) => setDisplay(d => ({ ...d, score })),
        (lives) => setDisplay(d => ({ ...d, lives })),
      );
      draw(ctx, stateRef.current);
    }, TICK);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ fontFamily: "monospace", display: "inline-block" }}>
      <div style={{ marginBottom: "0.5rem", color: "#555", fontSize: "0.85rem" }}>
        Thrust: <kbd>↑/W</kbd> · Rotate: <kbd>←/A</kbd> <kbd>→/D</kbd> · Fire: <kbd>Space</kbd> · Shield: <kbd>Shift</kbd> · Pause: <kbd>P</kbd> · Rebind: <kbd>H</kbd>
      </div>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{ display: "block", outline: "none", cursor: "default" }}
      />
      <div ref={dialogRef} />
    </div>
  );
};
