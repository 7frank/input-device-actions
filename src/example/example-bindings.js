import { Hotkeys } from "../core";
import * as _ from "lodash";

import { log } from "../example/Log.svelte";

/**
 *
 * create the example stuff
 */
export function loadExamples(event) {
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

  /**
   * register an action that shows the keybinding editor
   */
  Hotkeys.register("set-random-color-action", "ctrl+space", {
    description: "set random color for element",
  });
}
