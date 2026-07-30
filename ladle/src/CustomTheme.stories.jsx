import { useEffect, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { KeyBindingsEditor } from "@nk11/keyboard-interactions/ui";
import "@nk11/keyboard-interactions/ui/index.css";
import { useSvelteComponent } from "./useSvelteComponent";

const themes = {
  dark: {
    "--ki-bg":           "#13131f",
    "--ki-bg-raised":    "#1a1a2e",
    "--ki-border":       "#2a2a3e",
    "--ki-border-subtle":"#1e1e2e",
    "--ki-backdrop":     "rgba(0,0,0,0.6)",
    "--ki-text":         "#cbd5e1",
    "--ki-text-strong":  "#e2e8f0",
    "--ki-text-muted":   "#64748b",
    "--ki-accent":       "#7c6af7",
    "--ki-accent-glow":  "rgba(124,106,247,0.25)",
    "--ki-ok":           "#4ade80",
    "--ki-warn":         "#f59e0b",
    "--ki-log-msg":      "#94c6ff",
  },
  light: {
    "--ki-bg":           "#ffffff",
    "--ki-bg-raised":    "#f1f5f9",
    "--ki-border":       "#e2e8f0",
    "--ki-border-subtle":"#f1f5f9",
    "--ki-backdrop":     "rgba(0,0,0,0.35)",
    "--ki-text":         "#334155",
    "--ki-text-strong":  "#0f172a",
    "--ki-text-muted":   "#94a3b8",
    "--ki-accent":       "#6d56f5",
    "--ki-accent-glow":  "rgba(109,86,245,0.2)",
    "--ki-ok":           "#16a34a",
    "--ki-warn":         "#d97706",
    "--ki-log-msg":      "#3b6fd4",
  },
  forest: {
    "--ki-bg":           "#0d1f12",
    "--ki-bg-raised":    "#152b1c",
    "--ki-border":       "#2d4a35",
    "--ki-border-subtle":"#1a3322",
    "--ki-backdrop":     "rgba(0,0,0,0.6)",
    "--ki-text":         "#b7d9c0",
    "--ki-text-strong":  "#e0f2e9",
    "--ki-text-muted":   "#5a8a68",
    "--ki-accent":       "#4caf70",
    "--ki-accent-glow":  "rgba(76,175,112,0.25)",
    "--ki-ok":           "#6fcf97",
    "--ki-warn":         "#f2c94c",
    "--ki-log-msg":      "#81d4a0",
  },
};

function ThemeDemo({ themeName }) {
  const ref = useSvelteComponent(KeyBindingsEditor);
  const vars = themes[themeName];

  useEffect(() => {
    Hotkeys.clearRegistered();
    Hotkeys.register("save",   "ctrl+s",       { title: "Save",   description: "Save the current file" });
    Hotkeys.register("undo",   "ctrl+z",       { title: "Undo",   description: "Undo last action" });
    Hotkeys.register("redo",   "ctrl+shift+z", { title: "Redo",   description: "Redo last undone action" });
    Hotkeys.register("search", "ctrl+f",       { title: "Search", description: "Find in file" });
  }, []);

  return (
    <div style={{ padding: "1.5rem", background: vars["--ki-bg"], ...vars }}>
      <div ref={ref} />
    </div>
  );
}

export const Dark   = () => <ThemeDemo themeName="dark" />;
export const Light  = () => <ThemeDemo themeName="light" />;
export const Forest = () => <ThemeDemo themeName="forest" />;
