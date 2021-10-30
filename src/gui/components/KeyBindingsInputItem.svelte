<script lang="ts">
  export let comboConfig: string;
  export let keyId: string;
  import { onInputPress} from "../utils";


  const action = comboConfig.action;
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
      on:keydown={ (evt) =>
        onInputPress.bind(this)(evt, keyId, action)
      }
    />
    {!comboConfig.error ? "icon-ok" : "icon-exclamation-triangle"}
  </div>
</main>

<style>
</style>
