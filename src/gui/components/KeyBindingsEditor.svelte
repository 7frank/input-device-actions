<script>
  import { Button, Col, Row, Table } from "sveltestrap";
  import {
    getRegistered,
    isBound,
    rebind,
    addComboForAction,
    resetActionCombosToDefault,
    Hotkeys,
  } from "../../core";

  import KeyBindingsInputItem from "./KeyBindingsInputItem.svelte";

  import _ from "lodash";

  let entries;

  const reloadEntries = () => (entries = Object.values(getRegistered()));

  reloadEntries();
  Hotkeys.onChange(reloadEntries);

  var isArrayEqual = function (x, y) {
    return _(x).differenceWith(y, _.isEqual).isEmpty();
  };
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
  />

  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
    integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA=="
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>

<div>
  <Table>
    <thead>
      <tr>
        <th scope="col">action</th>
        <th scope="col">combo</th>
        <th scope="col">description</th>
      </tr>
    </thead>
    <tbody>
      {#each entries as t, i}
        <tr>
          <td><span title="${t.action}">{t.title}</span></td>
          <td>
            {#each t.combo as comboConfig, key}
              <KeyBindingsInputItem
                {comboConfig}
                keyID={key}
                action={t.action}
              />
            {/each}

            <i
              class="fa-solid fa-plus"
              on:click={() => addComboForAction(t.action)}
            />

            {#if !isArrayEqual(t.combo, t.defaults)}
              <i
                class="fa-solid fa-trash-undo"
                on:click={() => resetActionCombosToDefault(t.action)}
                title={"reset to defaults:" +
                  t.defaults.map((el) => el.combo).join(" ")}
              />
            {:else}
              <Button disabled>undo</Button>
            {/if}
          </td>
          <td>{t.description}</td>
        </tr>
      {/each}
    </tbody>
  </Table>
</div>
