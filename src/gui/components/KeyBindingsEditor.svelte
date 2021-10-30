<script>
  import { Button, Col, Row } from "sveltestrap";
  import {
    getRegistered,
    isBound,
    rebind,
    addComboForAction,
    resetActionCombosToDefault,
    Hotkeys,
  } from "../../core";

  import _ from "lodash";

  let entries = [];

  Hotkeys.onChange(() => (entries = Object.values(getRegistered())));

  var isArrayEqual = function (x, y) {
    return _(x).differenceWith(y, _.isEqual).isEmpty();
  };
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css"
  />
</svelte:head>

<div>
  <table class="table">
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
          <td id="edit">
            <Button on:click={() => addComboForAction(t.action)}>add</Button>

            {#if !isArrayEqual(t.combo, t.defaults)}
              <Button
                on:click={() => resetActionCombosToDefault(t.action)}
                title={"reset to defaults:" +
                  t.defaults.map((el) => el.combo).join(" ")}>undo</Button
              >
            {:else}
              <Button disabled>undo</Button>
            {/if}
          </td>
          <td>{t.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  <Row>
    <Col>
      <Button color="primary" outline>Hello World!</Button>
    </Col>
  </Row>
</div>

<!-- 
  let entries = getRegistered();
  const rows = _.map(entries, (t) => {
    const res = $(`<tr>
        <td><span title=${t.action}>${t.title}</span></td>
        <td id="edit"></td>
         
        <td>${t.description}</td>
    </tr>`);

    var items = t.combo.map((tag, key) => createInputItem(tag, key, t.action));



    res.find("#edit").append(...items, $addComboButton, $undoButton);
    return res;
  });

  const table = $(`

`); -->
