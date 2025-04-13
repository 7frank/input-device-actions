<script lang="ts">
  import KeyBindingsEditor from "./gui/components/KeyBindingsEditor.svelte";
  import ModalDialog from "./gui/components/KeybindingsEditorDialog.svelte";
  import Log from "./example/Log.svelte";
  import Examples from "./example/Examples.svelte";
  import ActionButton from "./ActionButton.svelte";
  export let name: string;
</script>

<main>
  <h1>KeyBindings - Editor {name}</h1>
  <h3>an exemplary implementation of a editor GUI</h3>
  <h3>Press 'h' for list of available commands</h3>
  <h4>
    <ActionButton action="(-1)move-left-action" /> to move the left side of the rectangle
    to the left
  </h4>
  <h4>
    <ActionButton action="(1)move-left-action" /> to move the left side of the rectangle
    to the right
  </h4>
  <div class="area">
    <Examples />
  </div>

  <ModalDialog  open={true}><KeyBindingsEditor /></ModalDialog>
  <Log />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  .area {
    position: relative;

    margin: 2em;
    padding: 0em;

    height: 600px;
    border: 2px solid #999;
    background-color: blanchedalmond;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
