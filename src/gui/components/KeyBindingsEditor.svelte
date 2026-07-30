<script lang="ts">
  import {
    getRegistered,
    rebind,
    addComboForAction,
    resetActionCombosToDefault,
    Hotkeys,
  } from "../../core";
  import type { ActionOptions } from "../../core";

  import KeyBindingsInputItem from "./KeyBindingsInputItem.svelte";

  let entries: ActionOptions[] = $state(Object.values(getRegistered()));

  const reloadEntries = () => (entries = Object.values(getRegistered()));

  Hotkeys.onChange(reloadEntries);

  const isArrayEqual = (x: unknown[], y: unknown[]) =>
    x.length === y.length && x.every((a, i) => JSON.stringify(a) === JSON.stringify(y[i]));
</script>

<div class="editor">
  <div class="header">
    <h3>Key Bindings</h3>
  </div>
  <ul class="binding-list">
    {#each entries as t}
      <li class="binding-row">
        <div class="binding-info">
          <span class="action-title" title={t.action}>{t.title}</span>
          {#if t.description}
            <span class="action-desc">{t.description}</span>
          {/if}
        </div>
        <div class="binding-controls">
          <div class="combos">
            {#each t.combo as comboConfig, key}
              <KeyBindingsInputItem
                {comboConfig}
                keyId={key}
                action={t.action}
              />
            {/each}
            <button class="add-btn" onclick={() => addComboForAction(t.action)} title="Add another shortcut">
              + Add
            </button>
          </div>
          {#if !isArrayEqual(t.combo, t.defaults)}
            <button
              class="reset-btn"
              onclick={() => resetActionCombosToDefault(t.action)}
              title={"Reset to: " + t.defaults.map((el) => el.combo).join(", ")}
            >
              Reset
            </button>
          {/if}
        </div>
      </li>
    {/each}
  </ul>
</div>

<style>
  .editor {
    width: 100%;
    background: var(--ki-bg);
    border-radius: 10px;
    border: 1px solid var(--ki-border);
    overflow: hidden;
    font-size: 0.9rem;
    color: var(--ki-text);
  }

  .header {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid var(--ki-border);
    background: var(--ki-bg-raised);
  }

  h3 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--ki-text-muted);
  }

  .binding-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .binding-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.65rem 1.25rem;
    border-bottom: 1px solid var(--ki-border-subtle);
    transition: background 0.1s;
  }

  .binding-row:last-child {
    border-bottom: none;
  }

  .binding-row:hover {
    background: var(--ki-bg-raised);
  }

  .binding-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 8rem;
  }

  .action-title {
    font-weight: 600;
    color: var(--ki-text-strong);
    font-size: 0.875rem;
  }

  .action-desc {
    font-size: 0.75rem;
    color: var(--ki-text-muted);
  }

  .binding-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .combos {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    flex-wrap: wrap;
  }

  .add-btn {
    background: transparent;
    border: 1.5px dashed var(--ki-border);
    border-radius: 6px;
    color: var(--ki-text-muted);
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .add-btn:hover {
    border-color: var(--ki-accent);
    color: var(--ki-accent);
  }

  .reset-btn {
    background: transparent;
    border: 1px solid var(--ki-border);
    border-radius: 6px;
    color: var(--ki-text-muted);
    font-size: 0.72rem;
    padding: 0.18rem 0.5rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .reset-btn:hover {
    border-color: var(--ki-warn);
    color: var(--ki-warn);
  }
</style>
