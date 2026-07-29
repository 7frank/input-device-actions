import Mousetrap from "mousetrap";
import { hasSecondHandler } from "./utils";
import type { ActionOptions, InputWrapper } from "./types";

export function getMousetrapInstance(options: ActionOptions): InputWrapper {
  const instance = new Mousetrap(options.target as Element);

  return {
    _instance: instance,
    bind(comboParam, handlerWrapper, handlerWrapper2) {
      if (!hasSecondHandler(options)) {
        instance.bind(comboParam, handlerWrapper);
      } else {
        instance.bind(comboParam, handlerWrapper, "keydown");
        instance.bind(comboParam, handlerWrapper2!, "keyup");
      }
    },
    unbind(prevCombo) {
      if (!hasSecondHandler(options)) {
        instance.unbind(prevCombo);
      } else {
        instance.unbind(prevCombo, "keydown");
        instance.unbind(prevCombo, "keyup");
      }
    },
    pause() {
      instance.pause();
    },
    unpause() {
      instance.unpause();
    },
  };
}
