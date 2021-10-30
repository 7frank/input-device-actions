import { getRegistered, Hotkeys, rebind } from "../src/index";
import {
  createRect,
  log,
  logHotkeyList,
  createHelp,
  randomRGB,
} from "./example-utils";
import * as _ from "lodash";

import $ from "cash-dom";

$("<link/>")
  .attr({
    rel: "stylesheet",
    type: "text/css",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  })
  .appendTo("head");

$(loadExamples);

function loadExamples(event) {
  window.HK = Hotkeys;

  logHotkeyList();

  Hotkeys.onChange(function () {
    log("rebind ok");
    console.log("rebind ok", arguments);
  });

  Hotkeys.onAction(function (e) {
    log("action triggered action", e.type, "with combo", e.detail.combo.combo);
    console.log("action triggered", e.type, e.detail.combo.combo);
  });

  //TODO create sample page with vue.js

  //bind the action to ctrl+space as default trigger
  //deprecated work flow
  //Hotkeys("hello-action", "ctrl+space", hello)
  Hotkeys.setDebug(true);

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

  Hotkeys.register("hello-action", "ctrl+space");

  var target1 = createRect("target1", 100, 300);
  $("body").append(target1);

  var targetWithinTarget = createRect("targetWithinTarget", 50, 50);
  target1.append(targetWithinTarget);

  var targetWithinTargetT = createRect("targetWithinTargetT", 50, 50);
  targetWithinTarget.append(targetWithinTargetT);

  function onHelloAction(e) {
    e.stopPropagation();

    log("triggered hello-action targetWithinTargetT");

    $(e.target).css("background-color", randomRGB());
  }

  Hotkeys(target1).on("hello-action", onHelloAction);
  Hotkeys(targetWithinTarget).on("hello-action", onHelloAction);
  Hotkeys(targetWithinTargetT).on("hello-action", onHelloAction, onHelloAction);

  //-------------------------

  log("trying to rebind to ctrl+c ...");
  rebind("hello-action", 0, "ctrl+c");

  //TODO we are currently unbinding all mousetrap events for( elements) which interferes with our overall goal to be able to have multiple combos per action
}
