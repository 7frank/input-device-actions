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
    background: #13131f;
    border-radius: 10px;
    border: 1px solid #2a2a3e;
    overflow: hidden;
    font-size: 0.9rem;
    color: #cbd5e1;
  }

  .header {
    padding: 0.75rem 1.25rem;
    border-bottom: 1px solid #2a2a3e;
    background: #1a1a2e;
  }

  h3 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
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
    border-bottom: 1px solid #1e1e2e;
    transition: background 0.1s;
  }

  .binding-row:last-child {
    border-bottom: none;
  }

  .binding-row:hover {
    background: #1a1a2e;
  }

  .binding-info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 8rem;
  }

  .action-title {
    font-weight: 600;
    color: #e2e8f0;
    font-size: 0.875rem;
  }

  .action-desc {
    font-size: 0.75rem;
    color: #64748b;
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
    border: 1.5px dashed #333;
    border-radius: 6px;
    color: #555;
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .add-btn:hover {
    border-color: #7c6af7;
    color: #7c6af7;
  }

  .reset-btn {
    background: transparent;
    border: 1px solid #3f3f5a;
    border-radius: 6px;
    color: #64748b;
    font-size: 0.72rem;
    padding: 0.18rem 0.5rem;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }

  .reset-btn:hover {
    border-color: #f59e0b;
    color: #f59e0b;
  }
</style>
