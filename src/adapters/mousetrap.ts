import Mousetrap from "mousetrap";
import { hasSecondHandler } from "../core/utils";
import type { ActionOptions, InputWrapper } from "../core/types";

const _mousetrapByTarget = new WeakMap<EventTarget, InstanceType<typeof Mousetrap>>();

function getOrCreateMousetrap(target: EventTarget): InstanceType<typeof Mousetrap> {
  if (!_mousetrapByTarget.has(target)) {
    _mousetrapByTarget.set(target, new Mousetrap(target as Element));
  }
  return _mousetrapByTarget.get(target)!;
}

export function getMousetrapInstance(options: ActionOptions): InputWrapper {
  const instance = getOrCreateMousetrap(options.target!);

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
