<script lang="ts">
  import KeyBindingsEditor from "./gui/components/KeyBindingsEditor.svelte";
  import ModalDialog from "./gui/components/KeybindingsEditorDialog.svelte";

  export let name: string;
</script>

<main>
  <h1>KeyBindings - Editor {name}</h1>
  <h3>an exemplary implementation of a editor GUI</h3>
  <ModalDialog><KeyBindingsEditor /></ModalDialog>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
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
