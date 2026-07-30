import { useEffect, useRef, RefObject } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";

export interface HotkeysDef {
  [action: string]: {
    keys: string | string[];
    title?: string;
    description?: string;
  };
}

interface HotkeysBuilder<Def extends HotkeysDef> {
  on(action: keyof Def, handler: (e: Event) => void): HotkeysBuilder<Def>;
}

/**
 * Registers hotkey metadata from a `HotkeysDef` and returns a fluent builder
 * to attach handlers. Cleanup is automatic on unmount.
 *
 * @example
 * const myKeys: HotkeysDef = {
 *   "move-up": { keys: ["up", "w"], title: "Move Up", description: "Move snake up" },
 * };
 *
 * // inside component:
 * useHotkeys(myKeys, canvasRef)
 *   .on("move-up", () => moveUp());
 */
export function useHotkeys<Def extends HotkeysDef>(
  def: Def,
  ref?: RefObject<Element | null>
): HotkeysBuilder<Def> {
  const pendingRef = useRef<[string, (e: Event) => void][]>([]);

  useEffect(() => {
    const el: EventTarget = ref?.current ?? window;
    const hk = new Hotkeys(el);

    pendingRef.current.forEach(([action, handler]) => {
      const { keys, title, description } = def[action];
      Hotkeys.register(action, keys, { title, description });
      hk.on(action, handler);
    });

    return () => {
      pendingRef.current.forEach(([action, handler]) => {
        hk.off(action, handler);
      });
    };
  }, []);

  const builder: HotkeysBuilder<Def> = {
    on(action, handler) {
      pendingRef.current.push([action as string, handler]);
      return builder;
    },
  };

  return builder;
}
