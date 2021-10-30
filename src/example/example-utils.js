import $ from "cash-dom";

let container = $(
  "<div style='position:relative; border-top:2px solid black'>"
);

$("body").append(container);

export const log = (...args) => {
  let str = args.join(" ");
  let entry = $(`<div>${str}</div>`);
  container.prepend(entry);
};

export function createRect(name, top, left) {
  return $(
    `<div style='position:relative;top:${top};left:${left};border:2px solid darkslategray;padding:1em;background-color:mediumslateblue'>${name}</div>`
  );
}

export function randomRGB() {
  var colorR = Math.floor(Math.random() * 256);
  var colorG = Math.floor(Math.random() * 256);
  var colorB = Math.floor(Math.random() * 256);
  return "rgb(" + colorR + "," + colorG + "," + colorB + ")";
}

export function createExampleTargets() {
  var header = $("<h3>Press 'h' for help</h3>");

  var target1 = createRect(
    "use the key combo for 'set-random-color-action' to toggle my color when hovering ",
    100,
    300
  ).css({
    margin: "2rem",
    marginLeft: "18rem",
  });
  $("body").prepend(header, target1);

  var targetWithinTarget = createRect(
    "or here (you can change the key combo in the editor when pressing 'h')",
    50,
    50
  );
  target1.append(targetWithinTarget);

  var targetWithinTargetT = createRect(
    "I will toggle twice - when pressing & when releasing the combo keys",
    50,
    50
  );
  targetWithinTarget.append(targetWithinTargetT);

  return [target1, targetWithinTarget, targetWithinTargetT];
}
