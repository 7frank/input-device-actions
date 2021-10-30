<script lang="ts">
  import Target from "./ExampleTargetWidget.svelte";

  import { log } from "./Log.svelte";

  import { onMount } from "svelte";

  let target1;
  let targetWithinTarget;
  let targetWithinTargetT;

  function randomRGB() {
    var colorR = Math.floor(Math.random() * 256);
    var colorG = Math.floor(Math.random() * 256);
    var colorB = Math.floor(Math.random() * 256);
    return "rgb(" + colorR + "," + colorG + "," + colorB + ")";
  }

  /**
   *
   * an example action handler that changes the background color
   */
  function onHelloAction(e) {
    e.stopPropagation();

    log("triggered set-random-color-action on target");

    document
      .querySelector(e.target)
      .setAttribute("style", "background-color:" + randomRGB());
  }

  onMount(() => {
    Hotkeys(target1).on("set-random-color-action", onHelloAction);
    Hotkeys(targetWithinTarget).on("set-random-color-action", onHelloAction);
    Hotkeys(targetWithinTargetT).on(
      "set-random-color-action",
      onHelloAction,
      onHelloAction
    );
  });
</script>

<main>
  <Target bind:this={target1}
    >use the key combo for 'set-random-color-action' to toggle my color when
    hovering

    <Target bind:this={targetWithinTarget}
      >or here (you can change the key combo in the editor when pressing 'h')
      <Target bind:this={targetWithinTargetT}
        >I will toggle twice - when pressing & when releasing the combo keys</Target
      >
    </Target>
  </Target>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
