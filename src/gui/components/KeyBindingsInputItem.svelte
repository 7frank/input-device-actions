<script lang="ts">
  export let comboConfig: {};
  export let keyId: string;
  export let action: string;
  import { onInputPress } from "../utils";

  console.log("comboConfig", comboConfig);

  var iconTypes = { keyboard: "keyboard-o" };
  var icon = iconTypes[comboConfig.type];
  if (!icon) icon = "question";
</script>

<main>
  <div>
    <input
      value={comboConfig.combo}
      disabled={!!comboConfig.locked}
      title={comboConfig.error ? comboConfig.error : ""}
      on:keydown={(evt) => onInputPress(evt, keyId, action)}
    />

    {#if !comboConfig.error}
      <i class="fa-solid fa-circle-check" />
    {:else}
      <i class="fa-solid fa-triangle-exclamation" />
    {/if}
  </div>
</main>

<style>
</style>
