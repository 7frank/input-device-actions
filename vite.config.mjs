import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    svelte({ preprocess: sveltePreprocess() }),
    process.env.ANALYZE && visualizer({ open: true, filename: "stats.html" }),
  ],
});
