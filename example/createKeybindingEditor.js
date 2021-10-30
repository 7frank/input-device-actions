import $ from "cash-dom";
import { getRegistered, isBound, rebind } from "../src/index";
import * as event2stringProto from "key-event-to-string";

export function getElementFromEvent(e) {
  return e.currentTarget || (e.path && e.path[0]);
}

/**
 * creates a single input element.
 *
 * @param {object} t - A configuration object.
 * @param {string} t.combo - A key combo.
 * @param {boolean} t.locked - Wheather the combo can be edited/removed or is fixed/locked.
 * @param keyID - the key or id within its parent(action) array (to be able to bind multiple combos to one action)
 * @param action
 * @returns {any}
 */
function createInputItem(t, keyID, action) {
  var iconTypes = { keyboard: "keyboard-o" };
  var icon = iconTypes[t.type];
  if (!icon) icon = "question";

  const input = $(`<input 
     value=${t.combo} 
     ${t.locked && "disabled"}
     title=${t.error ? t.error : ""}>
  </input>`).on("keydown", (evt) =>
    onInputPress.bind(this)(evt, keyID, action)
  );

  const $icon = $(` ${!t.error ? "icon-ok" : "icon-exclamation-triangle"}`);

  return $(`<div></div>`).append(input, $icon);
}

/**
 * TODO split and refactor .. the event to string part should probably be put into the interactionss library as it is closer logically
 * @param {*} event
 * @param {number} id
 * @param {string} action
 * @returns
 */
function onInputPress(event, id, action) {
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

export function createKeybindingEditor() {
  let entries = getRegistered();
  const rows = _.map(entries, (val) => {
    const res = $(`<tr>
        <td>${val.action}</td>
        <td id="edit"></td>
        <td>${val.description}</td>
    </tr>`);
    console.log(val);
    var items = val.combo.map((tag, key) =>
      createInputItem(tag, key, val.action)
    );

    res.find("#edit").append(...items);
    return res;
  });

  const table = $(`
<table class="table">
  <thead>
    <tr>
      <th scope="col">action</th>
      <th scope="col">combo</th>
      <th scope="col">description</th>
      <th scope="col">input new combo</th>
      <th scope="col">save new combo</th>
    </tr>
  </thead>
  <tbody>
  
  </tbody>
</table>
`);

  table.find("tbody").append(...rows);
  return table;
}
