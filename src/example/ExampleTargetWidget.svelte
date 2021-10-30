<script lang="ts">
  import {onMount} from "svelte"

  import { log } from "./Log.svelte";
  import { Hotkeys } from "../core";

  function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
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

  const top = getRandomInt(30, 60) + "%";
  const left = getRandomInt(30, 60) + "%";

  const height = getRandomInt(30, 60) + "%";
  const width = getRandomInt(30, 60) + "%";

  let bgColor = randomRGB();

  let uuid="id-"+uuidv4()

  let styles = {
    top,
    left,
    height,
    width,
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


  onMount(()=>{
    Hotkeys("#"+uuid).on("set-random-color-action", onHelloAction);
  // Hotkeys(targetWithinTarget).on("set-random-color-action", onHelloAction);
  // Hotkeys(targetWithinTargetT).on(
  //   "set-random-color-action",
  //   onHelloAction,
  //   onHelloAction
  // );
  })


</script>

<main id={uuid} style={cssVarStyles}>
  <slot />
</main>

<style>
  main {
    border: 1px solid grey;
    position: absolute;
  }
</style>
