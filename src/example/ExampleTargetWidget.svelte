<script lang="ts">
  import { onMount } from "svelte";

  import { log } from "./Log.svelte";
  import { Hotkeys } from "../core";

  function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
      (
        c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
      ).toString(16)
    );
  }

  function randomRGB() {
    var colorR = Math.floor(Math.random() * 256);
    var colorG = Math.floor(Math.random() * 256);
    var colorB = Math.floor(Math.random() * 256);
    return "rgb(" + colorR + "," + colorG + "," + colorB + ")";
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  let top = getRandomInt(10, 30) + "%";
  let left = getRandomInt(10, 30) + "%";

  let bottom = getRandomInt(20, 50) + "%";
  let right = getRandomInt(20, 50) + "%";

  let bgColor = randomRGB();

  let uuid = "id-" + uuidv4();

  $: styles = {
    top,
    left,
    bottom,
    right,
    "background-color": bgColor,
  };

  $: cssVarStyles = Object.entries(styles)
    .map(([key, value]) => `${key}:${value}`)
    .join(";");

  /**
   *
   * an example action handler that changes the background color
   */
  function onHelloAction(e) {
    e.stopPropagation();

    log("triggered set-random-color-action on target");

    bgColor = randomRGB();
  }

  function move(direction, amount) {
    return function (e) {
      e.stopPropagation();

      switch (direction) {
        case "left":
          left = parseInt(left) + amount + "%";
          break;
        case "right":
          right = parseInt(right) + amount + "%";
          break;
        case "bottom":
          bottom = parseInt(bottom) + amount + "%";
          break;
        case "top":
          top = parseInt(top) + amount + "%";
          break;
      }
    };
  }

  onMount(() => {
    const data = [
      { hk: "a", text: "left", amount: -1 },
      { hk: "d", text: "right", amount: -1 },
      { hk: "w", text: "top", amount: -1 },
      { hk: "s", text: "bottom", amount: -1 },

      // { hk: "ArrowLeft", text: "left", amount: 1 },
      // { hk: "ArrowRight", text: "right", amount: 1 },
      // { hk: "ArrowUp", text: "top", amount: 1 },
      // { hk: "ArrowDown", text: "bottom", amount: 1 },
    ];

    data.forEach(({ hk, text, amount }) => {
      const name = `(${amount})move-${text}-action`;
      Hotkeys.register(name, hk, {
        description: `move the target to the ${text} by amount ${amount}`,
      });
      Hotkeys("#" + uuid).on(name, move(text, amount));
    });

    Hotkeys("#" + uuid).on("set-random-color-action", onHelloAction);

    // TODO showcase keyup / keydown 
    // Hotkeys(targetWithinTargetT).on(
    //   "set-random-color-action",
    //   onHelloAction,
    //   onHelloAction
    // );
  });
</script>

<main id={uuid} style={cssVarStyles}>
  {bgColor}
  <slot />
</main>

<style>
  main {
    border: 1px solid grey;
    position: absolute;
  }
</style>
