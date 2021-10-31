<script lang="ts">
  import Target from "./ExampleTargetWidget.svelte";
</script>

<main>
  <Target
    >use the key combo for 'set-random-color-action' to toggle my color when
    hovering

    <Target
      >or here (you can change the key combo in the editor when pressing 'h')
      <Target
        >I will toggle twice - when pressing & when releasing the combo keys</Target
      >
    </Target>
  </Target>
</main>

<style>
  main {
    text-align: left;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
</style>
