import { defineConfig } from "vite";
import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    svelte({ preprocess: vitePreprocess() }),
    process.env.ANALYZE && visualizer({ open: true, filename: "stats.html" }),
  ],
});
