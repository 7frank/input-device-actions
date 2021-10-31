<script lang="ts" context="module">
  let messages = [];

  export function log(...args: any[]) {
    messages.push(args.join(" "));
  }
</script>

<main>
  <div><b>Log:</b></div>
  {#each messages as line, i}
    <div>{line}</div>
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
</style>
