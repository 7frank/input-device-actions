<script lang="ts">
  export let comboConfig: { type: string; combo: string; locked?: boolean; error?: string };
  export let keyId: number;
  export let action: string;
  import { onInputPress } from "../utils";
</script>

<div class="item">
  <input
    value={comboConfig.combo}
    disabled={!!comboConfig.locked}
    title={comboConfig.error ? comboConfig.error : ""}
    on:keydown={(evt) => onInputPress(evt, keyId, action)}
  />
  {#if comboConfig.error}
    <span class="status error" title={comboConfig.error}>⚠</span>
  {:else}
    <span class="status ok">✓</span>
  {/if}
</div>

<style>
  .item {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  input {
    width: 8rem;
    padding: 0.2rem 0.4rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.85rem;
  }

  input:disabled {
    background: #f0f0f0;
    color: #888;
  }

  .status {
    font-size: 0.9rem;
  }

  .ok {
    color: green;
  }

  .error {
    color: orange;
  }
</style>
