import { useEffect, useRef, useState } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";
import { getHumanInputInstance } from "@nk11/keyboard-interactions/adapters/humaninput";
import { getKJSInstance } from "@nk11/keyboard-interactions/adapters/keypress";

Hotkeys.registerInputType("humaninput", getHumanInputInstance);
Hotkeys.registerInputType("keypress", getKJSInstance);

const PANEL_STYLE: React.CSSProperties = {
  fontFamily: "monospace",
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: "1rem",
  minWidth: 220,
  flex: "1 1 220px",
};

const LOG_STYLE: React.CSSProperties = {
  marginTop: "0.5rem",
  height: 120,
  overflowY: "auto",
  background: "#f5f5f5",
  padding: "0.25rem 0.5rem",
  fontSize: "0.8rem",
  borderRadius: 4,
};

function AdapterPanel({ adapterType, label }: { adapterType: string; label: string }) {
  const [log, setLog] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Hotkeys.clearRegistered();

    const action = `key-logged-${adapterType}`;

    Hotkeys.register(action, [{ type: adapterType, combo: "a" }, { type: adapterType, combo: "b" }, { type: adapterType, combo: "c" }], {
      title: `Key (${label})`,
      description: `Press A, B or C via ${label}`,
      preventDefault: false,
      stopPropagation: false,
    });

    const el: EventTarget = containerRef.current ?? window;
    const hk = Hotkeys(el);

    hk.on(action, (e) => {
      const key = (e as KeyboardEvent).key ?? "?";
      setLog((prev) => [`[${label}] key: ${key}`, ...prev].slice(0, 20));
    });

    return () => {
      hk.off(action, () => {});
    };
  }, []);

  return (
    <div style={PANEL_STYLE}>
      <strong>{label}</strong>
      <div style={{ fontSize: "0.75rem", color: "#888", marginBottom: "0.5rem" }}>
        adapter type: <code>{adapterType}</code>
      </div>
      <div ref={containerRef} tabIndex={-1} style={{ outline: "none" }}>
        <em style={{ fontSize: "0.8rem", color: "#555" }}>Focus here, then press A / B / C</em>
        <div style={LOG_STYLE}>
          {log.length === 0 ? <span style={{ color: "#aaa" }}>no keys yet</span> : log.map((l, i) => <div key={i}>{l}</div>)}
        </div>
      </div>
    </div>
  );
}

export const Default = () => (
  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", padding: "1rem" }}>
    <AdapterPanel adapterType="keyboard"   label="Mousetrap (default)" />
    <AdapterPanel adapterType="humaninput" label="HumanInput" />
    <AdapterPanel adapterType="keypress"   label="Keypress.js" />
  </div>
);
