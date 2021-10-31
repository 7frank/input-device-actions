<script lang="ts" context="module">
  let messages = [];

  export function log(...args: any[]) {
    messages.unshift(args.join(" "));
  }
</script>

<script lang="ts">
  // this fix does insure log message does updating . probably a problem with the module scope of the messages property
  let x = 1;
  setInterval(() => {
    x++;
  }, 1000);
</script>

<main>
  <div><b>Log:</b></div>
  {#each messages as line, i}
    <div>{line}</div>
    <span id="hidden"> {x}</span>
  {/each}
</main>

<style>
  main {
    text-align: left;
    border: 1px solid grey;
    bottom: 0;
    position: absolute;
    background-color: #b6c7c854;
    height: 300px;
  }

  #hidden {
    display: none;
  }
</style>
