import $ from "cash-dom";

import { getRegistered,rebind, } from "../src/index";

$("<link/>")
  .attr({
    rel: "stylesheet",
    type: "text/css",
    href: "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  })
  .appendTo("head");

export const createHTML = (domstring) => {
  if (domstring == null) throw new Error("needs param");
  let html = new DOMParser().parseFromString(domstring, "text/html");
  return html.body.firstChild;
};

let container = createHTML("<div style='position:relative;'>");

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
  return $(
    `<div id="${name}" style='position:relative;top:${top};left:${left};border:2px solid darkslategray;padding:1em;background-color:mediumslateblue'>${name}</div>`
  );
}

function createCard({
  title = "Keyboard Binding Editor",
  subTitle = "an exemplary implementation of a editor GUI",
  text = "",
}) {
  return $(`<div class="card" >
 <div class="card-body">
 <h5 class="card-title">${title}</h5>
   <h6 class="card-subtitle mb-2 text-muted">${subTitle}</h6>
   <p class="card-text">${text}</p>
   <a href="#" class="card-link">Card link</a>
 </div>
</div>`);
}

export function createHelp() {
  let entries = getRegistered();

  //log("trying to rebind to ctrl+c ...");
  //TODO we are currently unbinding all mousetrap events for( elements) which interferes with our overall goal to be able to have multiple combos per action
  //rebind("hello-action", 0, "ctrl+c");


  const rows = _.map(entries, (val) =>
    $(`<tr>
        <td>${val.action}</td>
        <td>${val.combo}</td>
        <td>${val.description}</td>
        <td><input></input></td>
        <td><button>save</button></td>
    </tr>`)
  );

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

  const card = createCard({});
  card.find(".card-text").append(table);

  return card;
}

export function randomRGB() {
  var colorR = Math.floor(Math.random() * 256);
  var colorG = Math.floor(Math.random() * 256);
  var colorB = Math.floor(Math.random() * 256);
  return "rgb(" + colorR + "," + colorG + "," + colorB + ")";
}

export function createExampleTargets() {
  var target1 = createRect("target1", 100, 300).css({ margin: "18rem" });
  $("body").prepend(target1);

  var targetWithinTarget = createRect("targetWithinTarget", 50, 50);
  target1.append(targetWithinTarget);

  var targetWithinTargetT = createRect("targetWithinTargetT", 50, 50);
  targetWithinTarget.append(targetWithinTargetT);

  return [target1, targetWithinTarget, targetWithinTargetT];
}
