import { useEffect, useRef, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";

export const Default = () => {
  const windowRef = useRef(null);
  const outerRef = useRef(null);
  const innerRef = useRef(null);

  const [windowColor, setWindowColor] = useState("#e8f4f8");
  const [outerColor, setOuterColor] = useState("#fde8e8");
  const [innerColor, setInnerColor] = useState("#e8fde8");

  useEffect(() => {
    Hotkeys.clearRegistered();
    Hotkeys.register("toggle-color", "1", { title: "Toggle Color", description: "Toggle the focused panel color" });

    const onWindow = () => setWindowColor(c => c === "#e8f4f8" ? "#ffd700" : "#e8f4f8");
    const onOuter  = () => setOuterColor(c  => c === "#fde8e8" ? "#ff6b6b" : "#fde8e8");
    const onInner  = () => setInnerColor(c  => c === "#e8fde8" ? "#51cf66" : "#e8fde8");

    const hkWindow = new Hotkeys(windowRef.current);
    const hkOuter  = new Hotkeys(outerRef.current);
    const hkInner  = new Hotkeys(innerRef.current);

    hkWindow.on("toggle-color", onWindow);
    hkOuter.on("toggle-color",  onOuter);
    hkInner.on("toggle-color",  onInner);

    return () => {
      hkWindow.off("toggle-color", onWindow);
      hkOuter.off("toggle-color",  onOuter);
      hkInner.off("toggle-color",  onInner);
    };
  }, []);

  const panelBase = {
    padding: "1.5rem",
    borderRadius: "6px",
    border: "2px solid rgba(0,0,0,0.15)",
    transition: "background 0.2s",
    cursor: "default",
    outline: "none",
  };

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 560 }}>
      <p style={{ color: "#555", marginTop: 0 }}>
        All panels share the same key <kbd>1</kbd> — hover a panel and press it.
        Only the hovered panel reacts because each scope stops propagation.
      </p>

      <div
        ref={windowRef}
        style={{ ...panelBase, background: windowColor, padding: "2rem" }}
      >
        <strong>Window panel</strong> — hover &amp; press <kbd>1</kbd>
        <div
          ref={outerRef}
          style={{ ...panelBase, background: outerColor, marginTop: "1rem", padding: "1.5rem" }}
        >
          <strong>Outer panel</strong> — hover &amp; press <kbd>1</kbd>
          <div
            ref={innerRef}
            style={{ ...panelBase, background: innerColor, marginTop: "1rem", padding: "1rem" }}
          >
            <strong>Inner panel</strong> — hover &amp; press <kbd>1</kbd>
          </div>
        </div>
      </div>
    </div>
  );
};
