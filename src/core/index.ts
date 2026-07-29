import { onElementChange } from "./listeners";
import * as _ from "lodash";
import { assignIn as extend } from "lodash";
import Emitter_ from "tiny-emitter";
import { getMousetrapInstance } from "./mousetrap-wrapper";
import { hasSecondHandler } from "./utils";
import type { ActionOptions, ComboParam, InputWrapper, EventEmitter, JQueryLike, FocusableTarget, HotkeysInstance } from "./types";

export type { ActionOptions, ComboParam, InputWrapper, HotkeysInstance };

const Emitter = Emitter_ as unknown as new () => EventEmitter;

function fixFocusAndOtherThingsForNow(target: FocusableTarget) {
  if (target.__hasFocusFixed) return;
  if (target.hasAttribute && !target.hasAttribute("tabIndex"))
    target.setAttribute("tabIndex", "-1");
  if (target.style) target.style.outline = "none";
  target.addEventListener("mouseenter", () => target.focus());
  target.addEventListener("mouseleave", () => target.blur());
  target.__hasFocusFixed = true;
}

let debug = false;

const _keys: Record<string, ActionOptions> = {};
const _already_set_combos: Record<string, string> = {};
const _events = new Emitter();

export function Hotkeys(el: EventTarget | string = window): HotkeysInstance {
  let target: EventTarget;

  if (el === window || el instanceof HTMLElement) {
    target = window;
  } else if (typeof (el as unknown as JQueryLike).get === "function") {
    target = (el as unknown as JQueryLike).get(0);
  } else if (typeof el === "string") {
    target = document.querySelector(el) as EventTarget;
  } else {
    throw new Error("invalid Hotkeys target");
  }

  fixFocusAndOtherThingsForNow(target as FocusableTarget);

  const instance: HotkeysInstance = {
    on(action, handler, extra = null) {
      if (typeof handler !== "function") throw new Error("param 2 must be an instance of a function");
      if (extra != null && typeof extra !== "function") throw new Error("keyup handler, param 3 must be an instance of a function");

      let defaults = _keys[action];
      if (!defaults) {
        Hotkeys.register(action, "", { description: "not-registered", "not-registered": true } as Partial<ActionOptions>);
        defaults = _keys[action];
      }

      const options: ActionOptions = extend({}, defaults);
      options.handler = handler;
      options.extra = extra ?? undefined;
      options.target = target;
      options.el = getMousetrapInstance(options);

      defaults.elements.push(options);

      function applyHandlers() {
        if (debug) console.log("applyHandlers", options);
        bindAllCombos(options, options.combo);
      }

      applyHandlers();

      if (options.selector != null)
        onElementChange(target as Node, options.selector, function (_summaries: unknown[]) {
          applyHandlers();
        });

      return instance;
    },
    off(action, handler, _extra = null) {
      const defaults = _keys[action];
      if (!defaults) return instance;
      const idx = defaults.elements.findIndex((e) => e.handler === handler && e.target === target);
      if (idx === -1) return instance;
      const opt = defaults.elements[idx];
      opt.combo.forEach((comboParam) => {
        if (comboParam.combo != null) opt.el!.unbind(comboParam.combo.toLowerCase());
      });
      defaults.elements.splice(idx, 1);
      return instance;
    },
  };

  return instance;
}

Hotkeys.setDebug = function (doDebug: boolean) {
  debug = doDebug;
};

Hotkeys.register = function (
  action: string,
  combo: string | ComboParam | (string | ComboParam)[],
  options?: Partial<ActionOptions>
) {
  const defaults: ActionOptions = {
    action,
    combo: [],
    defaults: [],
    category: "default",
    selector: null,
    description: "",
    stopPropagation: true,
    preventDefault: true,
    error: false,
    title: action,
    elements: [],
  };

  const merged: ActionOptions = extend(defaults, options);
  merged.action = action;
  merged.combo = convertComboParams(combo);
  merged.defaults = _.values(extend({}, merged.combo));
  if (!merged.title) merged.title = action;

  if (_keys[action]) {
    if (_keys[action]["not-registered"]) {
      _keys[action] = merged;
      console.warn(`action '${action}' previously 'not-registered'`);
    } else {
      console.warn(`action '${action}' already set`);
    }
    return;
  }

  _keys[action] = merged;

  const t = hasSecondHandler(merged) ? "up/down" : "keypress";
  const comboKey = (typeof combo === "string" ? combo : "") + "-" + t;

  if (_already_set_combos[comboKey]) {
    _keys[action].error = `already set by '${_already_set_combos[comboKey]}'`;
    return;
  }
  _already_set_combos[comboKey] = action;

  _events.emit("change", { type: "register", action, combo });
};

Hotkeys.clearRegistered = function (): void {
  for (const key of Object.keys(_keys)) {
    if (!_keys[key].persistent) delete _keys[key];
  }
  for (const key of Object.keys(_already_set_combos)) {
    if (!_keys[_already_set_combos[key]]) delete _already_set_combos[key];
  }
  _events.emit("change", { type: "clear" });
};

Hotkeys.registerInputType = function (_type: string, _factory: unknown) {
  throw new Error("not yet supported in this version");
};

Hotkeys.onChange = function (handler: (e: unknown) => void) {
  _events.on("change", handler);
};

Hotkeys.onAction = function (handler: (e: unknown) => void) {
  _events.on("action", handler);
};

Hotkeys.getRegistered = getRegistered;

function convertComboParams(comboParams: string | ComboParam | (string | ComboParam)[]): ComboParam[] {
  function def(): ComboParam {
    return { type: "keyboard", combo: null };
  }
  function strToObj(s: string): ComboParam {
    return extend(def(), { combo: s });
  }

  if (typeof comboParams === "string") comboParams = [strToObj(comboParams)];

  return _.map(comboParams as (string | ComboParam)[], (p) =>
    typeof p === "string" ? strToObj(p) : extend(def(), p)
  );
}

function bindAllCombos(options: ActionOptions, comboParams: ComboParam[]) {
  _.each(comboParams, (comboParam) => bindSingleCombo(options, comboParam));
}

function bindSingleCombo(opt: ActionOptions, comboParam: ComboParam) {
  if (comboParam.combo == null) {
    console.warn("action " + opt.action + " invalid combo:", comboParam);
    return;
  }

  function handlerWrapper(e: Event) {
    if (opt.stopPropagation) e.stopPropagation();
    if (opt.preventDefault) e.preventDefault();
    opt.handler!.call(undefined, e);
    _events.emit("action", e);
  }

  function handlerWrapper2(e: Event) {
    if (opt.stopPropagation) e.stopPropagation();
    if (opt.preventDefault) e.preventDefault();
    opt.extra!.call(undefined, e);
    _events.emit("action", e);
  }

  opt.el!.bind(comboParam.combo!.toLowerCase(), handlerWrapper, handlerWrapper2);
}

export function isBound(combo: string): boolean {
  return _already_set_combos[combo] != null;
}

export function isBoundTo(combo: string): string | undefined {
  return _already_set_combos[combo];
}

export function getActionByName(action: string): ActionOptions {
  return _keys[action];
}

function unbind(opt: ActionOptions, prevCombo: ComboParam) {
  opt.elements.forEach((opt0) => {
    if (debug) console.log("unbind", opt0, prevCombo);
    opt0.el!.unbind(prevCombo.combo!.toLowerCase());
  });
}

export function rebind(action: string, entryID: number, newCombo: string) {
  if (typeof action !== "string") console.error("must be a valid action");
  if (typeof entryID !== "number") console.error("must be a number");
  if (typeof newCombo === "undefined") console.error("there must be a new combo specified");

  _already_set_combos[newCombo] = action;
  const opt = getActionByName(action);
  const prevCombo = opt.combo[entryID];

  if (typeof prevCombo !== "object") console.error("no combo found for params", action, entryID);

  unbind(opt, prevCombo);
  opt.combo[entryID] = convertComboParams(newCombo)[0];

  if (debug) console.log("action to rebind", action, opt.combo[entryID]);

  setTimeout(() => {
    opt.elements.forEach((opt0) => bindSingleCombo(opt0, opt.combo[entryID]));
    _events.emit("change", { type: "rebind", action, combo: newCombo, previous: prevCombo });
  }, 500);
}

export function resetActionCombosToDefault(action: string, comboID?: number) {
  const options = getActionByName(action);

  const reset = (val: ComboParam, key: number) => {
    if (options.defaults[key]) {
      rebind(action, key, options.defaults[key].combo!);
      options.combo[key] = cloneObject(options.defaults[key]);
    } else {
      unbind(options, options.combo[key]);
      delete options.combo[key];
    }
  };

  if (comboID != null) reset(options.combo[comboID], comboID);
  else _.each(options.combo, reset);

  options.combo = _.compact(options.combo);
  _events.emit("change", { type: "reset-to-defaults" });
}

export function addComboForAction(action: string): ComboParam {
  const options = getActionByName(action);
  const param = convertComboParams("")[0];
  param.error = "create a valid combo";
  options.combo.push(param);
  _events.emit("change", { type: "create-placeholder" });
  return param;
}

function cloneObject<T>(o: T): T {
  return extend({}, o) as T;
}

export function getRegistered(): Record<string, ActionOptions> {
  return _keys;
}
