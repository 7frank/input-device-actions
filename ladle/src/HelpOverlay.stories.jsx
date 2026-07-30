import { useEffect, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { KeybindingsEditorDialog } from "@nk11/keyboard-interactions/ui";
import "@nk11/keyboard-interactions/ui/index.css";
import { useSvelteComponent } from "@nk11/keyboard-interactions/react";

export const Default = () => {
  const dialogRef = useSvelteComponent(KeybindingsEditorDialog);
  const [nav, setNav] = useState(null);

  useEffect(() => {
    Hotkeys.clearRegistered();
    Hotkeys.register("go-home",    "g h", { title: "Go Home",    description: "Navigate to home" });
    Hotkeys.register("go-search",  "g s", { title: "Go Search",  description: "Navigate to search" });
    Hotkeys.register("go-profile", "g p", { title: "Go Profile", description: "Navigate to profile" });
    const hk = new Hotkeys(window);
    const onHome    = () => setNav("🏠 Home");
    const onSearch  = () => setNav("🔍 Search");
    const onProfile = () => setNav("👤 Profile");
    hk.on("go-home",    onHome);
    hk.on("go-search",  onSearch);
    hk.on("go-profile", onProfile);
    return () => {
      hk.off("go-home",    onHome);
      hk.off("go-search",  onSearch);
      hk.off("go-profile", onProfile);
    };
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 560 }}>
      <p style={{ color: "#555", marginTop: 0 }}>
        Press <kbd>H</kbd> to toggle the shortcuts overlay. Press <kbd>G H</kbd>, <kbd>G S</kbd>,
        or <kbd>G P</kbd> to navigate. All shortcuts are rebindable inside the overlay.
      </p>
      <div style={{ padding: "2rem", background: "#f8f8f8", borderRadius: 6, textAlign: "center", color: "#888" }}>
        A web page. Press <strong>H</strong> to see available shortcuts.
        {nav && <div style={{ marginTop: "1rem", fontSize: "1.5rem" }}>{nav}</div>}
      </div>
      <div ref={dialogRef} />
    </div>
  );
};
