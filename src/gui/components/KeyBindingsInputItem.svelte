<script lang="ts">
  import { onInputPress } from "../utils";
  import type { ComboParam } from "../../core";

  let { comboConfig, keyId, action }: {
    comboConfig: ComboParam;
    keyId: number;
    action: string;
  } = $props();

  let focused = $state(false);
</script>

<div class="key-item" class:has-error={!!comboConfig.error} class:is-locked={!!comboConfig.locked}>
  <div class="key-badge" class:focused>
    <input
      value={comboConfig.combo}
      disabled={!!comboConfig.locked}
      title={comboConfig.error ?? "Press a key combination"}
      onkeydown={(evt) => onInputPress(evt, keyId, action)}
      onfocus={() => (focused = true)}
      onblur={() => (focused = false)}
      placeholder="click to set"
      readonly
    />
    {#if comboConfig.error}
      <span class="indicator error" title={comboConfig.error}>!</span>
    {:else if comboConfig.locked}
      <span class="indicator locked" title="locked">&#x1F512;</span>
    {:else}
      <span class="indicator ok">&#x2713;</span>
    {/if}
  </div>
</div>

<style>
  .key-item {
    display: inline-flex;
  }

  .key-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    background: var(--ki-bg-raised);
    border: 1.5px solid var(--ki-border);
    border-radius: 6px;
    padding: 0.2rem 0.5rem;
    transition: border-color 0.15s, box-shadow 0.15s;
  }

  .key-badge.focused {
    border-color: var(--ki-accent);
    box-shadow: 0 0 0 2px var(--ki-accent-glow);
  }

  .has-error .key-badge {
    border-color: var(--ki-warn);
  }

  input {
    background: transparent;
    border: none;
    outline: none;
    color: var(--ki-text-strong);
    font-family: ui-monospace, "Cascadia Code", monospace;
    font-size: 0.8rem;
    width: 7rem;
    cursor: pointer;
    text-align: center;
  }

  input::placeholder {
    color: var(--ki-text-muted);
    font-style: italic;
  }

  input:disabled {
    color: var(--ki-text-muted);
    cursor: not-allowed;
  }

  .indicator {
    font-size: 0.7rem;
    font-weight: 700;
    flex-shrink: 0;
  }

  .ok {
    color: var(--ki-ok);
  }

  .error {
    color: var(--ki-warn);
    font-size: 0.8rem;
  }

  .locked {
    font-size: 0.65rem;
    opacity: 0.5;
  }
</style>
