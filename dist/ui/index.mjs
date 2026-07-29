// src/gui/components/KeyBindingsEditor.svelte
import {
  SvelteComponent as SvelteComponent2,
  append as append2,
  attr as attr2,
  check_outros,
  create_component,
  destroy_component,
  destroy_each,
  detach as detach2,
  element as element2,
  ensure_array_like,
  group_outros,
  init as init2,
  insert as insert2,
  listen as listen2,
  mount_component,
  safe_not_equal as safe_not_equal2,
  set_data,
  space as space2,
  text as text2,
  transition_in,
  transition_out
} from "svelte/internal";
import "svelte/internal/disclose-version";

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
  var instance4 = new Mousetrap(options.target);
  return {
    _instance: instance4,
    //we'll expose the instance for customization
    bind(comboParam, handlerWrapper, handlerWrapper2) {
      if (!hasSecondHandler(options)) {
        instance4.bind(comboParam, handlerWrapper);
      } else {
        instance4.bind(comboParam, handlerWrapper, "keydown");
        instance4.bind(comboParam, handlerWrapper2, "keyup");
      }
    },
    unbind(prevCombo) {
      if (!hasSecondHandler(options)) {
        instance4.unbind(prevCombo);
      } else {
        instance4.unbind(prevCombo, "keydown");
        instance4.unbind(prevCombo, "keyup");
      }
    },
    pause: function() {
      instance4.pause();
    },
    unpause: function() {
      instance4.unpause();
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
  var instance4 = opt.el;
  instance4.bind(
    comboParam.combo.toLowerCase(),
    handlerWrapper,
    handlerWrapper2
  );
}
function isBound(combo) {
  return _already_set_combos[combo] != null;
}
function getActionByName(action) {
  return _keys[action];
}
function unbind(opt, prevCombo) {
  var instance4 = opt.el;
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

// src/gui/components/KeyBindingsInputItem.svelte
import {
  SvelteComponent,
  append,
  attr,
  detach,
  element,
  init,
  insert,
  listen,
  noop,
  safe_not_equal,
  space,
  text
} from "svelte/internal";
import "svelte/internal/disclose-version";

// src/gui/utils.js
import * as event2stringProto from "key-event-to-string";
import _2 from "lodash";
function getElementFromEvent(e) {
  return e.currentTarget || e.path && e.path[0];
}
function onInputPress(event, id, action) {
  event.preventDefault();
  event.stopPropagation();
  let details2 = event2stringProto.details(event);
  console.log("onInputPress", details2, "action", action);
  var c = null;
  if (details2.hasKey) {
    if (!c && event.key && details2.map.character != "Space") c = event.key;
    if (!c) {
      console.warn(
        "missing feature: KeydownEvent.key - using backup for older browsers. This might fail with some special characters on non US keyboards."
      );
      c = details2.map.character;
    }
    if (!c) {
      console.warn("keyboard event: could not detect key");
    }
    if (c == "+") c = "Plus";
  }
  var d = "";
  if (event.shiftKey == true) d = "Shift+" + d;
  if (event.altKey == true) d = "Alt+" + d;
  if (event.ctrlKey == true) d = "Ctrl+" + d;
  if (event.metaKey == true) d = "Meta+" + d;
  if (c) c = d + c;
  else c = d.slice(0, -1);
  getElementFromEvent(event).value = c;
  if (!isBound(c)) {
    rebind(action, id, c);
  }
  return false;
}

// src/gui/components/KeyBindingsInputItem.svelte
function create_else_block(ctx) {
  let span;
  return {
    c() {
      span = element("span");
      span.textContent = "\u2713";
      attr(span, "class", "status ok svelte-lsp546");
    },
    m(target, anchor) {
      insert(target, span, anchor);
    },
    p: noop,
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_if_block(ctx) {
  let span;
  let t;
  let span_title_value;
  return {
    c() {
      span = element("span");
      t = text("\u26A0");
      attr(span, "class", "status error svelte-lsp546");
      attr(span, "title", span_title_value = /*comboConfig*/
      ctx[0].error);
    },
    m(target, anchor) {
      insert(target, span, anchor);
      append(span, t);
    },
    p(ctx2, dirty) {
      if (dirty & /*comboConfig*/
      1 && span_title_value !== (span_title_value = /*comboConfig*/
      ctx2[0].error)) {
        attr(span, "title", span_title_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach(span);
      }
    }
  };
}
function create_fragment(ctx) {
  let div;
  let input;
  let input_value_value;
  let input_disabled_value;
  let input_title_value;
  let t;
  let mounted;
  let dispose;
  function select_block_type(ctx2, dirty) {
    if (
      /*comboConfig*/
      ctx2[0].error
    ) return create_if_block;
    return create_else_block;
  }
  let current_block_type = select_block_type(ctx, -1);
  let if_block = current_block_type(ctx);
  return {
    c() {
      div = element("div");
      input = element("input");
      t = space();
      if_block.c();
      input.value = input_value_value = /*comboConfig*/
      ctx[0].combo;
      input.disabled = input_disabled_value = !!/*comboConfig*/
      ctx[0].locked;
      attr(input, "title", input_title_value = /*comboConfig*/
      ctx[0].error ? (
        /*comboConfig*/
        ctx[0].error
      ) : "");
      attr(input, "class", "svelte-lsp546");
      attr(div, "class", "item svelte-lsp546");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, input);
      append(div, t);
      if_block.m(div, null);
      if (!mounted) {
        dispose = listen(
          input,
          "keydown",
          /*keydown_handler*/
          ctx[3]
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & /*comboConfig*/
      1 && input_value_value !== (input_value_value = /*comboConfig*/
      ctx2[0].combo) && input.value !== input_value_value) {
        input.value = input_value_value;
      }
      if (dirty & /*comboConfig*/
      1 && input_disabled_value !== (input_disabled_value = !!/*comboConfig*/
      ctx2[0].locked)) {
        input.disabled = input_disabled_value;
      }
      if (dirty & /*comboConfig*/
      1 && input_title_value !== (input_title_value = /*comboConfig*/
      ctx2[0].error ? (
        /*comboConfig*/
        ctx2[0].error
      ) : "")) {
        attr(input, "title", input_title_value);
      }
      if (current_block_type === (current_block_type = select_block_type(ctx2, dirty)) && if_block) {
        if_block.p(ctx2, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx2);
        if (if_block) {
          if_block.c();
          if_block.m(div, null);
        }
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) {
        detach(div);
      }
      if_block.d();
      mounted = false;
      dispose();
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let { comboConfig } = $$props;
  let { keyId } = $$props;
  let { action } = $$props;
  const keydown_handler = (evt) => onInputPress(evt, keyId, action);
  $$self.$$set = ($$props2) => {
    if ("comboConfig" in $$props2) $$invalidate(0, comboConfig = $$props2.comboConfig);
    if ("keyId" in $$props2) $$invalidate(1, keyId = $$props2.keyId);
    if ("action" in $$props2) $$invalidate(2, action = $$props2.action);
  };
  return [comboConfig, keyId, action, keydown_handler];
}
var KeyBindingsInputItem = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, { comboConfig: 0, keyId: 1, action: 2 });
  }
};
var KeyBindingsInputItem_default = KeyBindingsInputItem;

// src/gui/components/KeyBindingsEditor.svelte
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[5] = list[i];
  child_ctx[7] = i;
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[8] = list[i];
  child_ctx[10] = i;
  return child_ctx;
}
function create_each_block_1(ctx) {
  let keybindingsinputitem;
  let current;
  keybindingsinputitem = new KeyBindingsInputItem_default({
    props: {
      comboConfig: (
        /*comboConfig*/
        ctx[8]
      ),
      keyId: (
        /*key*/
        ctx[10]
      ),
      action: (
        /*t*/
        ctx[5].action
      )
    }
  });
  return {
    c() {
      create_component(keybindingsinputitem.$$.fragment);
    },
    m(target, anchor) {
      mount_component(keybindingsinputitem, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const keybindingsinputitem_changes = {};
      if (dirty & /*entries*/
      1) keybindingsinputitem_changes.comboConfig = /*comboConfig*/
      ctx2[8];
      if (dirty & /*entries*/
      1) keybindingsinputitem_changes.action = /*t*/
      ctx2[5].action;
      keybindingsinputitem.$set(keybindingsinputitem_changes);
    },
    i(local) {
      if (current) return;
      transition_in(keybindingsinputitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(keybindingsinputitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(keybindingsinputitem, detaching);
    }
  };
}
function create_if_block2(ctx) {
  let button;
  let t_1;
  let button_title_value;
  let mounted;
  let dispose;
  function click_handler_1() {
    return (
      /*click_handler_1*/
      ctx[3](
        /*t*/
        ctx[5]
      )
    );
  }
  return {
    c() {
      button = element2("button");
      t_1 = text2("\u21A9");
      attr2(button, "class", "icon-btn svelte-c2ncxm");
      attr2(button, "title", button_title_value = "reset to defaults: " + /*t*/
      ctx[5].defaults.map(func).join(" "));
    },
    m(target, anchor) {
      insert2(target, button, anchor);
      append2(button, t_1);
      if (!mounted) {
        dispose = listen2(button, "click", click_handler_1);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & /*entries*/
      1 && button_title_value !== (button_title_value = "reset to defaults: " + /*t*/
      ctx[5].defaults.map(func).join(" "))) {
        attr2(button, "title", button_title_value);
      }
    },
    d(detaching) {
      if (detaching) {
        detach2(button);
      }
      mounted = false;
      dispose();
    }
  };
}
function create_each_block(ctx) {
  let tr;
  let td0;
  let span;
  let t0_value = (
    /*t*/
    ctx[5].title + ""
  );
  let t0;
  let span_title_value;
  let t1;
  let td1;
  let t2;
  let button;
  let t4;
  let show_if = !/*isArrayEqual*/
  ctx[1](
    /*t*/
    ctx[5].combo,
    /*t*/
    ctx[5].defaults
  );
  let t5;
  let td2;
  let t6_value = (
    /*t*/
    ctx[5].description + ""
  );
  let t6;
  let t7;
  let current;
  let mounted;
  let dispose;
  let each_value_1 = ensure_array_like(
    /*t*/
    ctx[5].combo
  );
  let each_blocks = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  function click_handler() {
    return (
      /*click_handler*/
      ctx[2](
        /*t*/
        ctx[5]
      )
    );
  }
  let if_block = show_if && create_if_block2(ctx);
  return {
    c() {
      tr = element2("tr");
      td0 = element2("td");
      span = element2("span");
      t0 = text2(t0_value);
      t1 = space2();
      td1 = element2("td");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      t2 = space2();
      button = element2("button");
      button.textContent = "+";
      t4 = space2();
      if (if_block) if_block.c();
      t5 = space2();
      td2 = element2("td");
      t6 = text2(t6_value);
      t7 = space2();
      attr2(span, "title", span_title_value = /*t*/
      ctx[5].action);
      attr2(td0, "class", "svelte-c2ncxm");
      attr2(button, "class", "icon-btn svelte-c2ncxm");
      attr2(button, "title", "add combo");
      attr2(td1, "class", "combo-cell svelte-c2ncxm");
      attr2(td2, "class", "svelte-c2ncxm");
    },
    m(target, anchor) {
      insert2(target, tr, anchor);
      append2(tr, td0);
      append2(td0, span);
      append2(span, t0);
      append2(tr, t1);
      append2(tr, td1);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(td1, null);
        }
      }
      append2(td1, t2);
      append2(td1, button);
      append2(td1, t4);
      if (if_block) if_block.m(td1, null);
      append2(tr, t5);
      append2(tr, td2);
      append2(td2, t6);
      append2(tr, t7);
      current = true;
      if (!mounted) {
        dispose = listen2(button, "click", click_handler);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if ((!current || dirty & /*entries*/
      1) && t0_value !== (t0_value = /*t*/
      ctx[5].title + "")) set_data(t0, t0_value);
      if (!current || dirty & /*entries*/
      1 && span_title_value !== (span_title_value = /*t*/
      ctx[5].action)) {
        attr2(span, "title", span_title_value);
      }
      if (dirty & /*entries*/
      1) {
        each_value_1 = ensure_array_like(
          /*t*/
          ctx[5].combo
        );
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx, each_value_1, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block_1(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(td1, t2);
          }
        }
        group_outros();
        for (i = each_value_1.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
      if (dirty & /*entries*/
      1) show_if = !/*isArrayEqual*/
      ctx[1](
        /*t*/
        ctx[5].combo,
        /*t*/
        ctx[5].defaults
      );
      if (show_if) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block2(ctx);
          if_block.c();
          if_block.m(td1, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if ((!current || dirty & /*entries*/
      1) && t6_value !== (t6_value = /*t*/
      ctx[5].description + "")) set_data(t6, t6_value);
    },
    i(local) {
      if (current) return;
      for (let i = 0; i < each_value_1.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach2(tr);
      }
      destroy_each(each_blocks, detaching);
      if (if_block) if_block.d();
      mounted = false;
      dispose();
    }
  };
}
function create_fragment2(ctx) {
  let div;
  let table;
  let thead;
  let t5;
  let tbody;
  let current;
  let each_value = ensure_array_like(
    /*entries*/
    ctx[0]
  );
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }
  const out = (i) => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });
  return {
    c() {
      div = element2("div");
      table = element2("table");
      thead = element2("thead");
      thead.innerHTML = `<tr><th class="svelte-c2ncxm">action</th> <th class="svelte-c2ncxm">combo</th> <th class="svelte-c2ncxm">description</th></tr>`;
      t5 = space2();
      tbody = element2("tbody");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr2(table, "class", "svelte-c2ncxm");
      attr2(div, "class", "editor svelte-c2ncxm");
    },
    m(target, anchor) {
      insert2(target, div, anchor);
      append2(div, table);
      append2(table, thead);
      append2(table, t5);
      append2(table, tbody);
      for (let i = 0; i < each_blocks.length; i += 1) {
        if (each_blocks[i]) {
          each_blocks[i].m(tbody, null);
        }
      }
      current = true;
    },
    p(ctx2, [dirty]) {
      if (dirty & /*entries, isArrayEqual*/
      3) {
        each_value = ensure_array_like(
          /*entries*/
          ctx2[0]
        );
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(tbody, null);
          }
        }
        group_outros();
        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }
      current = true;
    },
    o(local) {
      each_blocks = each_blocks.filter(Boolean);
      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach2(div);
      }
      destroy_each(each_blocks, detaching);
    }
  };
}
var func = (el) => el.combo;
function instance2($$self, $$props, $$invalidate) {
  let entries;
  const reloadEntries = () => $$invalidate(0, entries = Object.values(getRegistered()));
  reloadEntries();
  Hotkeys.onChange(reloadEntries);
  const isArrayEqual = (x, y) => x.length === y.length && x.every((a, i) => JSON.stringify(a) === JSON.stringify(y[i]));
  const click_handler = (t) => addComboForAction(t.action);
  const click_handler_1 = (t) => resetActionCombosToDefault(t.action);
  return [entries, isArrayEqual, click_handler, click_handler_1];
}
var KeyBindingsEditor = class extends SvelteComponent2 {
  constructor(options) {
    super();
    init2(this, options, instance2, create_fragment2, safe_not_equal2, {});
  }
};
var KeyBindingsEditor_default = KeyBindingsEditor;

// src/gui/components/KeybindingsEditorDialog.svelte
import {
  SvelteComponent as SvelteComponent3,
  append as append3,
  attr as attr3,
  check_outros as check_outros2,
  create_slot,
  detach as detach3,
  element as element3,
  empty,
  get_all_dirty_from_scope,
  get_slot_changes,
  group_outros as group_outros2,
  init as init3,
  insert as insert3,
  listen as listen3,
  run_all,
  safe_not_equal as safe_not_equal3,
  space as space3,
  transition_in as transition_in2,
  transition_out as transition_out2,
  update_slot_base
} from "svelte/internal";
import "svelte/internal/disclose-version";
function create_if_block3(ctx) {
  let div0;
  let t0;
  let div4;
  let div3;
  let div1;
  let h2;
  let t2;
  let button;
  let t4;
  let div2;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = (
    /*#slots*/
    ctx[3].default
  );
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/
    ctx[2],
    null
  );
  return {
    c() {
      div0 = element3("div");
      t0 = space3();
      div4 = element3("div");
      div3 = element3("div");
      div1 = element3("div");
      h2 = element3("h2");
      h2.textContent = "Change your key bindings";
      t2 = space3();
      button = element3("button");
      button.textContent = "\u2715";
      t4 = space3();
      div2 = element3("div");
      if (default_slot) default_slot.c();
      attr3(div0, "class", "modal-backdrop svelte-1pvi2q9");
      attr3(h2, "class", "svelte-1pvi2q9");
      attr3(button, "class", "close-btn svelte-1pvi2q9");
      attr3(div1, "class", "modal-header svelte-1pvi2q9");
      attr3(div2, "class", "modal-body svelte-1pvi2q9");
      attr3(div3, "class", "modal-content svelte-1pvi2q9");
      attr3(div4, "class", "modal-dialog svelte-1pvi2q9");
      attr3(div4, "role", "dialog");
    },
    m(target, anchor) {
      insert3(target, div0, anchor);
      insert3(target, t0, anchor);
      insert3(target, div4, anchor);
      append3(div4, div3);
      append3(div3, div1);
      append3(div1, h2);
      append3(div1, t2);
      append3(div1, button);
      append3(div3, t4);
      append3(div3, div2);
      if (default_slot) {
        default_slot.m(div2, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen3(
            div0,
            "click",
            /*toggle*/
            ctx[1]
          ),
          listen3(
            button,
            "click",
            /*toggle*/
            ctx[1]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/
        4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            /*$$scope*/
            ctx2[2],
            !current ? get_all_dirty_from_scope(
              /*$$scope*/
              ctx2[2]
            ) : get_slot_changes(
              default_slot_template,
              /*$$scope*/
              ctx2[2],
              dirty,
              null
            ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in2(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out2(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach3(div0);
        detach3(t0);
        detach3(div4);
      }
      if (default_slot) default_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment3(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*open*/
    ctx[0] && create_if_block3(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert3(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, [dirty]) {
      if (
        /*open*/
        ctx2[0]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty & /*open*/
          1) {
            transition_in2(if_block, 1);
          }
        } else {
          if_block = create_if_block3(ctx2);
          if_block.c();
          transition_in2(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros2();
        transition_out2(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros2();
      }
    },
    i(local) {
      if (current) return;
      transition_in2(if_block);
      current = true;
    },
    o(local) {
      transition_out2(if_block);
      current = false;
    },
    d(detaching) {
      if (detaching) {
        detach3(if_block_anchor);
      }
      if (if_block) if_block.d(detaching);
    }
  };
}
function instance3($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { open = false } = $$props;
  const toggle = () => $$invalidate(0, open = !open);
  Hotkeys(window).on("help-action", function(e) {
    e.stopPropagation();
    toggle();
  });
  $$self.$$set = ($$props2) => {
    if ("open" in $$props2) $$invalidate(0, open = $$props2.open);
    if ("$$scope" in $$props2) $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [open, toggle, $$scope, slots];
}
var KeybindingsEditorDialog = class extends SvelteComponent3 {
  constructor(options) {
    super();
    init3(this, options, instance3, create_fragment3, safe_not_equal3, { open: 0 });
  }
};
var KeybindingsEditorDialog_default = KeybindingsEditorDialog;
export {
  KeyBindingsEditor_default as KeyBindingsEditor,
  KeyBindingsInputItem_default as KeyBindingsInputItem,
  KeybindingsEditorDialog_default as KeybindingsEditorDialog
};
