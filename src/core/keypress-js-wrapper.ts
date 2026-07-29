import * as keypress from "keypress.js";
import type { ActionOptions, InputWrapper, KeypressListener } from "./types";

export function getKJSInstance(options: ActionOptions): InputWrapper {
  const instance = new (keypress as unknown as { Listener: new (target: EventTarget | undefined) => KeypressListener }).Listener(options.target);

  return {
    _instance: instance,
    bind(comboParam, handlerWrapper) {
      const keys = comboParam.replace(/\+/g, " ");
      instance.register_combo({
        keys,
        on_keydown: handlerWrapper,
        on_keyup: options.extra,
        prevent_default: options.preventDefault,
      });
    },
    unbind(prevCombo) {
      const keys = prevCombo.replace(/\+/g, " ");
      instance.unregister_combo(keys);
    },
    pause() {
      instance.stop_listening();
    },
    unpause() {
      instance.listen();
    },
  };
}
