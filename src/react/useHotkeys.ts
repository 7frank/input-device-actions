import { useEffect, useRef, type RefObject } from "react";
import { Hotkeys } from "@nk11/keyboard-interactions";

export interface HotkeysDef {
  [action: string]: {
    keys: string | string[];
    title?: string;
    description?: string;
  };
}

type Fn = (e: Event) => void;

export type KeyHandler =
  | Fn
  | { keydown?: Fn; keyup?: Fn };

type Pending = [action: string, handler: Fn, extra?: Fn];

interface HotkeysBuilder<Def extends HotkeysDef> {
  on(action: keyof Def, handler: KeyHandler): HotkeysBuilder<Def>;
}

/**
 * Registers hotkey metadata from a `HotkeysDef` and returns a fluent builder
 * to attach handlers. Cleanup is automatic on unmount.
 *
 * @example
 * useHotkeys(myKeys, ref)
 *   .on("pause",  () => toggle())                              // keypress
 *   .on("thrust", { keydown: () => start(), keyup: () => stop() }); // held
 */
export function useHotkeys<Def extends HotkeysDef>(
  def: Def,
  ref?: RefObject<Element | null>
): HotkeysBuilder<Def> {
  const pendingRef = useRef<Pending[]>([]);

  useEffect(() => {
    const el: EventTarget = ref?.current ?? window;
    const hk = Hotkeys(el);

    pendingRef.current.forEach(([action, handler, extra]) => {
      const { keys, title, description } = def[action];
      Hotkeys.register(action, keys, { title, description });
      hk.on(action, handler, extra ?? null);
    });

    return () => {
      pendingRef.current.forEach(([action, handler]) => {
        hk.off(action, handler);
      });
    };
  }, []);

  const builder: HotkeysBuilder<Def> = {
    on(action, value) {
      if (typeof value === "function") {
        pendingRef.current.push([action as string, value]);
      } else {
        const { keydown, keyup } = value;
        if (keydown) pendingRef.current.push([action as string, keydown, keyup]);
        else if (keyup) pendingRef.current.push([action as string, () => {}, keyup]);
      }
      return builder;
    },
  };

  return builder;
}
