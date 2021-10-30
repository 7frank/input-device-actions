<script lang="ts" context="module">
  const messages = [];

  export function log(...args: any[]) {
    messages.push(args.join(" "));
  }
</script>

<main>
  {#each messages as line, i}
    <div>{line}</div>
  {/each}
</main>

<style>
  main {
    border: 1px solid grey;
  }
</style>
