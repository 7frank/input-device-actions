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
  <table>
    <thead>
      <tr>
        <th>action</th>
        <th>combo</th>
        <th>description</th>
      </tr>
    </thead>
    <tbody>
      {#each entries as t}
        <tr>
          <td><span title={t.action}>{t.title}</span></td>
          <td class="combo-cell">
            {#each t.combo as comboConfig, key}
              <KeyBindingsInputItem
                {comboConfig}
                keyId={key}
                action={t.action}
              />
            {/each}

            <button class="icon-btn" onclick={() => addComboForAction(t.action)} title="add combo">+</button>

            {#if !isArrayEqual(t.combo, t.defaults)}
              <button
                class="icon-btn"
                onclick={() => resetActionCombosToDefault(t.action)}
                title={"reset to defaults: " + t.defaults.map((el) => el.combo).join(" ")}
              >↩</button>
            {/if}
          </td>
          <td>{t.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .editor {
    width: 100%;
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.9rem;
  }

  th, td {
    text-align: left;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #ddd;
  }

  th {
    font-weight: 600;
    background: #f5f5f5;
  }

  .combo-cell {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .icon-btn {
    background: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 0.1rem 0.4rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.4;
  }

  .icon-btn:hover {
    background: #eee;
  }
</style>
