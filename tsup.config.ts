import { defineConfig } from "tsup";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

export default defineConfig([
  {
    entry: { index: "src/core/index.js" },
    outDir: "dist/core",
    format: ["esm", "cjs"],
    dts: false,
    clean: true,
    esbuildPlugins: [
      esbuildSvelte({ preprocess: sveltePreprocess() }),
    ],
  },
  {
    entry: { index: "src/ui/index.ts" },
    outDir: "dist/ui",
    format: ["esm"],
    dts: false,
    clean: true,
    external: ["svelte", /^svelte\//],
    esbuildPlugins: [
      esbuildSvelte({ preprocess: sveltePreprocess() }),
    ],
  },
]);
