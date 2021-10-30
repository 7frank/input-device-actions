import { Hotkeys } from "../src/index";
import {
  createRect,
  createExampleTargets,
  log,
  createHelp,
  randomRGB,
} from "./example-utils";
import * as _ from "lodash";
import $ from "cash-dom";

$(loadExamples);

/**
 *
 * an example action handler that changes the background color
 */
function onHelloAction(e) {
  e.stopPropagation();

  log("triggered set-random-color-action on target");

  $(e.target).css("background-color", randomRGB());
}

/**
 *
 * create the example stuff
 */
function loadExamples(event) {
  window.HK = Hotkeys;

  /**
   * attach listener when an action is bound to a new key combo
   */
  Hotkeys.onChange(function (combo) {
    log("rebind to: " + JSON.stringify(combo));
    console.log("rebind to", arguments);
  });

  /**
   * attach listener when an action triggered via a key combination
   */
  Hotkeys.onAction(function (e) {
    log("action triggered action", e.type, "with combo", e.detail.combo.combo);
    console.log("action triggered", e.type, e.detail.combo.combo);
  });

  Hotkeys.setDebug(true);

  /**
   * register an action that shows the keybinding editor
   */
  Hotkeys.register("help-action", ["h", "f1"], {
    description: "toggles a the keybinding editor dialog",
  });

  var help;
  function toggleHelp() {
    if (help) {
      help.remove();
      help = undefined;
    } else {
      help = createHelp();
      $("body").prepend(help);
    }
  }

  Hotkeys(window).on("help-action", function (e) {
    e.stopPropagation();
    toggleHelp();
  });

  /**
   * register an action that shows the keybinding editor
   */
  Hotkeys.register("set-random-color-action", "ctrl+space", {
    description: "set random color for element",
  });

  const [target1, targetWithinTarget, targetWithinTargetT] =
    createExampleTargets();

  Hotkeys(target1).on("set-random-color-action", onHelloAction);
  Hotkeys(targetWithinTarget).on("set-random-color-action", onHelloAction);
  Hotkeys(targetWithinTargetT).on(
    "set-random-color-action",
    onHelloAction,
    onHelloAction
  );
}
