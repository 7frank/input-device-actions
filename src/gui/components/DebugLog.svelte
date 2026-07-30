<script lang="ts" module>
  import { SvelteMap } from "svelte/reactivity";

  let lines: { ts: string; msg: string }[] = $state([]);

  export function log(...args: unknown[]) {
    const ts = new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    lines.unshift({ ts, msg: args.map(String).join(" ") });
    if (lines.length > 200) lines.pop();
  }

  export function clearLog() {
    lines = [];
  }
</script>

<div class="debug-log">
  <div class="log-header">
    <span>Log</span>
    <button onclick={clearLog}>clear</button>
  </div>
  <div class="log-body">
    {#each lines as line}
      <div class="log-line">
        <span class="ts">{line.ts}</span>
        <span class="msg">{line.msg}</span>
      </div>
    {/each}
    {#if lines.length === 0}
      <div class="empty">no events yet…</div>
    {/if}
  </div>
</div>

<style>
  .debug-log {
    font-family: ui-monospace, "Cascadia Code", monospace;
    font-size: 0.8rem;
    background: #0d0d14;
    border: 1px solid #2a2a3e;
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
  }

  .log-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.35rem 0.75rem;
    background: #1a1a2e;
    border-bottom: 1px solid #2a2a3e;
    color: #94a3b8;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .log-header button {
    background: none;
    border: 1px solid #3f3f5a;
    border-radius: 4px;
    color: #64748b;
    font-size: 0.7rem;
    padding: 0.1rem 0.4rem;
    cursor: pointer;
  }

  .log-header button:hover {
    color: #f59e0b;
    border-color: #f59e0b;
  }

  .log-body {
    max-height: 180px;
    overflow-y: auto;
    padding: 0.4rem 0;
  }

  .log-line {
    display: flex;
    gap: 0.75rem;
    padding: 0.1rem 0.75rem;
    color: #cbd5e1;
  }

  .log-line:hover {
    background: #1a1a2e;
  }

  .ts {
    color: #475569;
    flex-shrink: 0;
  }

  .msg {
    color: #94c6ff;
  }

  .empty {
    padding: 0.5rem 0.75rem;
    color: #334155;
  }
</style>
