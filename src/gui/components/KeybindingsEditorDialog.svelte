<script lang="ts">
  import { Hotkeys } from "../../core";

  export let open = false;
  const toggle = () => (open = !open);

  Hotkeys(window).on("help-action", function (e) {
    e.stopPropagation();
    toggle();
  });
</script>

{#if open}
  <div class="modal-backdrop" on:click={toggle} />
  <div class="modal-dialog" role="dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Change your key bindings</h2>
        <button class="close-btn" on:click={toggle}>✕</button>
      </div>
      <div class="modal-body">
        <slot />
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }

  .modal-dialog {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1001;
    width: 90vw;
    max-width: 900px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
  }

  .modal-content {
    background: #fff;
    border-radius: 6px;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    max-height: 80vh;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #ddd;
  }

  h2 {
    margin: 0;
    color: #ff3e00;
    text-transform: uppercase;
    font-weight: 100;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 1.25rem;
    cursor: pointer;
    line-height: 1;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
  }
</style>
