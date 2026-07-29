// src/core/listeners.js
import MutationSummary from "mutation-summary";
function onElementChange(node = window.document, elem, handler) {
  var observer = new MutationSummary({
    callback: handler,
    // required
    rootNode: node,
    // optional, defaults to window.document
    //  observeOwnChanges: // optional, defaults to false
    // oldPreviousSibling: // optional, defaults to false
    queries: [
      {
        element: elem
        // '[' + elem + ']'
      }
    ]
  });
  return observer;
}

// src/core/index.js
import * as _ from "lodash";
import { assignIn as extend, forEach } from "lodash";
import Emitter from "tiny-emitter";

// src/core/mousetrap-wrapper.js
import Mousetrap from "mousetrap";

// src/core/utils.js
function hasSecondHandler(o) {
  return typeof o.extra == "function";
}

// src/core/mousetrap-wrapper.js
function getMousetrapInstance(options) {
  var instance = new Mousetrap(options.target);
  return {
    _instance: instance,
    //we'll expose the instance for customization
    bind(comboParam, handlerWrapper, handlerWrapper2) {
      if (!hasSecondHandler(options)) {
        instance.bind(comboParam, handlerWrapper);
      } else {
        instance.bind(comboParam, handlerWrapper, "keydown");
        instance.bind(comboParam, handlerWrapper2, "keyup");
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
    pause: function() {
      instance.pause();
    },
    unpause: function() {
      instance.unpause();
    }
  };
}

// src/core/index.js
function fixFocusAndOtherThingsForNow(target) {
  if (target.__hasFocusFixed) return;
  if (target.hasAttribute && !target.hasAttribute("tabIndex"))
    target.setAttribute("tabIndex", "-1");
  if (target.style) target.style.outline = "none";
  target.addEventListener("mouseenter", () => target.focus());
  target.addEventListener("mouseleave", () => target.blur());
  target.__hasFocusFixed = true;
}
var debug = false;
var _keys = {};
var _already_set_combos = {};
var _events = new Emitter();
function Hotkeys(el = window) {
  var that = this;
  let target;
  if (el == window || el instanceof HTMLElement) {
    target = window;
  } else if (typeof el.get == "function") {
    target = el.get(0);
  } else if (typeof el == "string") {
    target = document.querySelector(el);
  } else {
    throw new Error("invalid Hotkeys target");
  }
  fixFocusAndOtherThingsForNow(target);
  return {
    on: function(action, handler, extra = null) {
      if (typeof handler != "function")
        throw new Error("param 2 must be an instance of a function");
      if (extra != void 0 && typeof extra != "function")
        throw new Error(
          "keyup handler, param 3 must be an instance of a function"
        );
      let defaults = _keys[action];
      if (!defaults) {
        Hotkeys.register(action, "", {
          description: "this was not previously registered TODO mark with not-registered",
          "not-registered": true
        });
        defaults = _keys[action];
      }
      var options = extend({}, defaults);
      options.handler = handler;
      options.extra = extra;
      options.target = target;
      options.el = getMousetrapInstance(options);
      defaults.elements.push(options);
      function applyHandlers(target2) {
        if (debug) console.log("applyHandlers", options, options.combo, target2);
        bindAllCombos(options, options.combo);
      }
      applyHandlers(options.target);
      if (options.selector != null)
        onElementChange(
          options.target,
          options.selector,
          function onTargetChanged(arr) {
            if (debug) console.log("hotkeys target ...", arguments);
            applyHandlers(arr[0].added[0]);
          }
        );
      return that;
    },
    off: function(action, handler, extra = null) {
      throw new Error("implementation");
      return that;
    }
  };
}
Hotkeys.setDebug = function(doDebug) {
  debug = doDebug;
};
Hotkeys.register = function(action, combo, options) {
  var defaults = {
    category: "default",
    // target: window,
    selector: null,
    description: "",
    stopPropagation: true,
    //by default the human input (HI) will be caught and be converted into a bubbling action event thus we don't need to propagate the HI-event
    preventDefault: true,
    error: false,
    title: null,
    elements: []
  };
  options = extend(defaults, options);
  options.action = action;
  options.combo = convertComboParams(combo);
  options.defaults = _.values(extend({}, options.combo));
  if (!options.title) options.title = options.action;
  if (_keys[action]) {
    if (_keys[action]["not-registered"]) {
      _keys[action] = options;
      console.warn("action '" + action + "' previously 'not-registered'");
    } else {
      console.warn("action '" + action + "' already set");
    }
    return;
  }
  _keys[action] = options;
  var t = hasSecondHandler(options) ? "up/down" : "keypress";
  if (_already_set_combos[combo + "-" + t]) {
    _keys[action].error = "already set by '" + _already_set_combos[combo + "-" + t] + "'";
    return;
  }
  _already_set_combos[combo + "-" + t] = action;
  _events.emit("change", { type: "register", action, combo });
};
Hotkeys.registerInputType = function(type, factory) {
  throw new Error("not yet supported in this version");
};
Hotkeys.onChange = function(handler) {
  _events.on("change", handler);
};
Hotkeys.onAction = function(handler) {
  _events.on("action", handler);
};
Hotkeys.getRegistered = getRegistered;
function convertComboParams(comboParams) {
  function def() {
    var defaults = {
      type: "keyboard",
      combo: null
    };
    return defaults;
  }
  function strToObj(comboParam) {
    return extend(def(), { combo: comboParam });
  }
  if (typeof comboParams === "string") comboParams = [strToObj(comboParams)];
  comboParams = _.map(comboParams, (comboParam) => {
    if (typeof comboParam === "string") return strToObj(comboParam);
    else return extend(def(), comboParam);
  });
  return comboParams;
}
function bindAllCombos(options, comboParams, target) {
  _.each(comboParams, function(comboParam, k) {
    bindSingleCombo(options, comboParam);
  });
}
function bindSingleCombo(opt, comboParam) {
  if (comboParam.combo == null) {
    console.warn("action " + opt.action + " invalid combo:", comboParam);
    return;
  }
  function createCustomActionEvent(e, isFirstHandler) {
    var el = opt.target;
    if (opt.selector) el = el.querySelectorAll(opt.selector);
    else el = [el];
    forEach(el, function(val) {
      var path = e.path || e.composedPath && e.composedPath();
      var event = new CustomEvent(opt.action, {
        bubbles: true,
        target: val,
        path,
        currentTarget: path[0],
        detail: {
          isActionEvent: true,
          first: isFirstHandler,
          second: !isFirstHandler,
          combo: comboParam
        }
      });
      e.target.dispatchEvent(event);
    });
  }
  function handlerWrapper(e) {
    if (opt.stopPropagation) e.stopPropagation();
    if (opt.preventDefault) e.preventDefault();
    var ee = createCustomActionEvent(e, true);
  }
  function handlerWrapper2(e) {
    if (opt.stopPropagation) e.stopPropagation();
    if (opt.preventDefault) e.preventDefault();
    var ee = createCustomActionEvent(e, false);
  }
  var actionHandler = function actionHandler2(e) {
    if (!hasSecondHandler(opt)) {
      opt.handler.apply(this, arguments);
    } else {
      if (e.detail.first) opt.handler.apply(this, arguments);
      if (e.detail.second) opt.extra.apply(this, arguments);
    }
    _events.emit("action", e);
  };
  if (!opt.target.__actions__) opt.target.__actions__ = {};
  if (!opt.target.__actions__[opt.action]) {
    opt.target.addEventListener(opt.action, actionHandler);
    opt.target.__actions__[opt.action] = true;
  }
  var instance = opt.el;
  instance.bind(
    comboParam.combo.toLowerCase(),
    handlerWrapper,
    handlerWrapper2
  );
}
function isBound(combo) {
  return _already_set_combos[combo] != null;
}
function isBoundTo(combo) {
  return _already_set_combos[combo];
}
function getActionByName(action) {
  return _keys[action];
}
function unbind(opt, prevCombo) {
  var instance = opt.el;
  opt.elements.forEach((opt0) => {
    if (debug) console.log("unbind", opt0, prevCombo, opt0.el._instance.target);
    opt0.el.unbind(prevCombo.combo.toLowerCase());
  });
}
function rebind(action, entryID, newCombo) {
  if (typeof action != "string") console.error("must be a valid action");
  if (typeof entryID != "number") console.error("must be a number");
  if (typeof newCombo == "undefined")
    console.error("there must be a new combo specified to override old one");
  _already_set_combos[newCombo] = action;
  var opt = getActionByName(action);
  var prevCombo = opt.combo[entryID];
  if (typeof prevCombo != "object")
    console.error("no combo found for params", action, entryID);
  unbind(opt, prevCombo);
  opt.combo[entryID] = convertComboParams(newCombo)[0];
  if (debug) console.log("action to rebind", action, opt.combo[entryID]);
  setTimeout(function() {
    opt.elements.forEach(function(opt0) {
      bindSingleCombo(opt0, opt.combo[entryID]);
    });
    _events.emit("change", {
      type: "rebind",
      action,
      combo: newCombo,
      previous: prevCombo
    });
  }, 500);
}
function resetActionCombosToDefault(action, comboID) {
  var options = getActionByName(action);
  var reset = (val, key) => {
    if (options.defaults[key]) {
      rebind(action, key, options.defaults[key].combo);
      options.combo[key] = cloneObject(options.defaults[key]);
    } else {
      unbind(options, options.combo[key]);
      delete options.combo[key];
    }
  };
  if (comboID != null) reset(options.combo, comboID);
  else _.each(options.combo, reset);
  options.combo = _.compact(options.combo);
  _events.emit("change", { type: "reset-to-defaults" });
}
function addComboForAction(action) {
  var options = getActionByName(action);
  var param = convertComboParams("")[0];
  param.error = "create a valid combo";
  options.combo.push(param);
  _events.emit("change", { type: "create-placeholder" });
  return param;
}
function cloneObject(options) {
  return extend({}, options);
}
function getRegistered() {
  return _keys;
}
export {
  Hotkeys,
  addComboForAction,
  getActionByName,
  getRegistered,
  isBound,
  isBoundTo,
  rebind,
  resetActionCombosToDefault
};
