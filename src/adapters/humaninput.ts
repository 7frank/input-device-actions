import HumanInput from "humaninput/dist/humaninput-1.1.15-full";
import { hasSecondHandler } from "../core/utils";
import type { ActionOptions, InputWrapper, HumanInputInstance } from "../core/types";

let HIDocumentInstance: HumanInputInstance | undefined;

export function getHumanInputInstance(options: ActionOptions): InputWrapper {
  let instance: HumanInputInstance;

  if (options.target === window) {
    if (!HIDocumentInstance) {
      (window as Window & { HI?: HumanInputInstance }).HI = HIDocumentInstance = instance = new HumanInput(window, { visualFeedback: false }) as HumanInputInstance;
    } else {
      instance = HIDocumentInstance;
    }
  } else {
    instance = new HumanInput(options.target, { visualFeedback: false });
  }

  return {
    _instance: instance,
    bind(comboParam, handlerWrapper) {
      const key = comboParam.replace(/\+/g, "-");
      if (!hasSecondHandler(options)) {
        instance.on(key, handlerWrapper);
      } else {
        instance.on(key, handlerWrapper);
        console.warn("the human input wrapper does not handle 'undo'-events like key/mouse- down/up");
      }
    },
    unbind(prevCombo) {
      const key = prevCombo.replace(/\+/g, "-");
      if (!hasSecondHandler(options)) {
        instance.off(key);
      } else {
        instance.off(key);
        console.warn("the human input wrapper does not handle 'undo'-events like key/mouse- down/up");
      }
    },
    pause() {
      instance.pause();
    },
    unpause() {
      instance.resume();
    },
  };
}
