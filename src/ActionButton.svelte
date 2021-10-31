<script lang="ts">
  export let action: string;

  import { getActionByName, getRegistered, Hotkeys } from "./core";

  let comboKey: string;
  let title: string;

  Hotkeys.onChange(function getActionInfo(a) {
    const r = getActionByName(action);

    if (!r) return;

    title = `press ${r.combo
      .map((c) => c.combo)
      .map((c) => "'" + c + "'")
      .join("or")}`;
  });
</script>

<span>
  {title}
</span>
