import $ from "cash-dom";
import {
  getRegistered,
  isBound,
  rebind,
  addComboForAction,
  resetActionCombosToDefault,
} from "../core";
import * as event2stringProto from "key-event-to-string";
import _ from "lodash";

export function getElementFromEvent(e) {
  return e.currentTarget || (e.path && e.path[0]);
}

/**
 * TODO split and refactor .. the event to string part should probably be put into the interactionss library as it is closer logically
 * @param {*} event
 * @param {number} id
 * @param {string} action
 * @returns
 */
export function onInputPress(event, id, action) {
  event.preventDefault();
  event.stopPropagation();

  let details = event2stringProto.details(event);

  console.log("onInputPress", details);

  var c = null;

  if (details.hasKey) {
    //use KeydownEvent.key as it is the currently suggested way
    if (!c && event.key && details.map.character != "Space") c = event.key;

    //making the best of it for legacy support
    if (!c) {
      console.warn(
        "missing feature: KeydownEvent.key - using backup for older browsers. This might fail with some special characters on non US keyboards."
      );
      c = details.map.character;
    }

    //should never happen
    if (!c) {
      console.warn("keyboard event: could not detect key");
    }
    if (c == "+") c = "Plus";
  }

  // modifiers to string
  var d = "";
  if (event.shiftKey == true) d = "Shift+" + d;
  if (event.altKey == true) d = "Alt+" + d;
  if (event.ctrlKey == true) d = "Ctrl+" + d;
  if (event.metaKey == true) d = "Meta+" + d;

  //merge character and modifiers
  if (c) c = d + c;
  else c = d.slice(0, -1);

  //write result into input element
  //TODO this didn't do anything in chrome because the event retargeting of the shadowdom interferes
  //but we clearly should have native access other than checking for  e.currentTarget ||  (e.path && e.path[0])
  //this is only a problem for when the dshadow dom is working in one browser and not being used in another
  //also the input iof our hotkey component doesnt work as intended with humaninput pluging start/stoprecording

  getElementFromEvent(event).value = c;

  //re-bind result

  if (!isBound(c)) {
    rebind(action, id, c);
  }

  return false;
}
