import { useEffect, useRef } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";

/**
 * Binds hotkey actions to a DOM element ref.
 * Handles registration, binding and cleanup automatically.
 *
 * @param {Record<string, (e: Event) => void>} actionsMap - map of action name to handler
 * @param {React.RefObject} [ref] - optional existing ref; if omitted a new one is created
 * @returns {React.RefObject} - attach to a div/canvas to scope bindings to that element
 *
 * @example
 * const ref = useHotkeys({
 *   "move-up":   () => moveUp(),
 *   "move-down": () => moveDown(),
 * });
 * return <div ref={ref} />;
 */
export function useHotkeys(actionsMap, ref) {
  const internalRef = useRef(null);
  const targetRef = ref ?? internalRef;

  useEffect(() => {
    const el = targetRef.current ?? window;
    const hk = new Hotkeys(el);
    const entries = Object.entries(actionsMap);
    entries.forEach(([action, handler]) => hk.on(action, handler));
    return () => entries.forEach(([action, handler]) => hk.off(action, handler));
  }, []);

  return targetRef;
}
