import { defineConfig } from "tsup";
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";
import type { Plugin } from "esbuild";

const redirectCoreToDistPlugin: Plugin = {
  name: "redirect-core-to-dist",
  setup(build) {
    build.onResolve({ filter: /[./]*\/core(\/index\.js)?$/ }, () => ({
      path: "../core/index.mjs",
      external: true,
    }));
  },
};

export default defineConfig([
  {
    entry: { index: "src/core/index.ts" },
    outDir: "dist/core",
    format: ["esm", "cjs"],
    dts: true,
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
      redirectCoreToDistPlugin,
    ],
  },
]);
