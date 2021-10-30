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

  log("triggered hello-action targetWithinTargetT");

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
  Hotkeys.onChange(function () {
    log("rebind ok");
    console.log("rebind ok", arguments);
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
  Hotkeys.register("help-action", "h", {
    description: "toggles a the keybinding editor dialog",
  });

  var help;
  Hotkeys(window).on("help-action", function (e) {
    e.stopPropagation();

    if (help) {
      help.remove();
      help = undefined;
    } else {
      help = createHelp();
      $("body").prepend(help);
    }
  });

  /**
   * register an action that shows the keybinding editor
   */
  Hotkeys.register("hello-action", "ctrl+space");

  const [target1, targetWithinTarget, targetWithinTargetT] =
    createExampleTargets();

  Hotkeys(target1).on("hello-action", onHelloAction);
  Hotkeys(targetWithinTarget).on("hello-action", onHelloAction);
  Hotkeys(targetWithinTargetT).on("hello-action", onHelloAction, onHelloAction);
}
