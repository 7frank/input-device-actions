import { useEffect, useRef, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { KeyBindingsEditor } from "@nk11/keyboard-interactions/ui";
import "@nk11/keyboard-interactions/ui/index.css";
import { useSvelteComponent } from "./useSvelteComponent";

function SvelteMount() {
  const ref = useSvelteComponent(KeyBindingsEditor);
  const [log, setLog] = useState("press a hotkey...");

  useEffect(() => {
    Hotkeys.clearRegistered();
    Hotkeys.register("save", "ctrl+s", { title: "Save", description: "Save the current file" });
    Hotkeys.register("undo", "ctrl+z", { title: "Undo", description: "Undo last action" });
    Hotkeys.register("redo", "ctrl+shift+z", { title: "Redo", description: "Redo last undone action" });
    const hk = new Hotkeys(window);
    const onSave = () => setLog("save triggered");
    const onUndo = () => setLog("undo triggered");
    const onRedo = () => setLog("redo triggered");
    hk.on("save", onSave);
    hk.on("undo", onUndo);
    hk.on("redo", onRedo);
    return () => {
      hk.off("save", onSave);
      hk.off("undo", onUndo);
      hk.off("redo", onRedo);
    };
  }, []);

  return (
    <div>
      <div ref={ref} />
      <pre style={{ marginTop: "1rem", padding: "0.5rem", background: "#f5f5f5" }}>
        {log}
      </pre>
    </div>
  );
}

export const Default = () => <SvelteMount />;
