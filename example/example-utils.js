import { getRegistered } from "../src/index";

export const createHTML = (domstring) => {
  if (domstring == null) throw new Error("needs param");
  let html = new DOMParser().parseFromString(domstring, "text/html");
  return html.body.firstChild;
};

let container = createHTML("<div>");

document.addEventListener("DOMContentLoaded", function (event) {
  document.body.appendChild(container);
});

export const log = (...args) => {
  let str = args.join(" ");
  let entry = createHTML(`<div>${str}</div>`);
  container.appendChild(entry);
};

//TODO
export const createSampleButton = (options) => {
  let entry = createHTML(`<button>${options.action}</button>`);

  entry.addEventListener("click", function () {
    log("TODO ...");
  });

  container.appendChild(entry);
};

export function logHotkeyList() {
  let entries = getRegistered();
  log("------------Hotkeys & Actions defined--------------");
  _.each(entries, function (val) {
    log(val.action, JSON.stringify(val.combo));
  });
  log("------------Hotkeys & Actions end--------------");
}

export function createRect(name, top, left) {
  return createHTML(
    `<div id="${name}" style='position:absolute;top:${top};left:${left};border:2px solid darkslategray;background-color:mediumslateblue'>${name}</div>`
  );
}
