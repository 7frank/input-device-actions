import { useEffect } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { DebugLog, debugLog } from "@nk11/keyboard-interactions/ui";
import "@nk11/keyboard-interactions/ui/index.css";
import { useSvelteComponent } from "./useSvelteComponent";

function LogDemo() {
  const logRef = useSvelteComponent(DebugLog);

  useEffect(() => {
    Hotkeys.clearRegistered();
    Hotkeys.register("greet",  "g",         { title: "Greet",   description: "Log a greeting"   });
    Hotkeys.register("count",  "c",         { title: "Count",   description: "Log a counter"    });
    Hotkeys.register("reset",  "r",         { title: "Reset",   description: "Reset the counter" });

    let counter = 0;
    const hk = new Hotkeys(window);
    hk.on("greet",  () => debugLog("hello from hotkey!"));
    hk.on("count",  () => debugLog("count →", ++counter));
    hk.on("reset",  () => { counter = 0; debugLog("counter reset"); });

    return () => hk.destroy?.();
  }, []);

  return (
    <div style={{ padding: "1rem", maxWidth: 480 }}>
      <p style={{ marginBottom: "0.75rem", fontSize: "0.85rem", color: "#666" }}>
        Press <kbd>G</kbd> to greet, <kbd>C</kbd> to count, <kbd>R</kbd> to reset.
      </p>
      <div ref={logRef} />
    </div>
  );
}

export const Default = () => <LogDemo />;
