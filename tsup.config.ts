import { defineConfig } from "tsup";
import esbuildSvelte from "esbuild-svelte";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import type { Plugin } from "esbuild";
import { copyFileSync, mkdirSync, readFileSync, appendFileSync } from "fs";

const redirectCoreToDistPlugin: Plugin = {
  name: "redirect-core-to-dist",
  setup(build) {
    build.onResolve({ filter: /[./]*\/core(\/.*)?$/ }, () => ({
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
      esbuildSvelte({ preprocess: vitePreprocess() }),
    ],
  },
  {
    entry: {
      humaninput: "src/adapters/humaninput.ts",
      keypress: "src/adapters/keypress.ts",
    },
    outDir: "dist/adapters",
    format: ["esm"],
    dts: true,
    clean: true,
    esbuildPlugins: [redirectCoreToDistPlugin],
  },
  {
    entry: { index: "src/react/index.ts" },
    outDir: "dist/react",
    format: ["esm"],
    dts: true,
    clean: true,
    external: ["react", "svelte", /^svelte\//, "@nk11/keyboard-interactions"],
    esbuildPlugins: [redirectCoreToDistPlugin],
  },
  {
    entry: { index: "src/ui/index.ts" },
    outDir: "dist/ui",
    format: ["esm"],
    dts: false,
    clean: true,
    external: ["svelte", /^svelte\//],
    esbuildPlugins: [
      esbuildSvelte({ preprocess: vitePreprocess() }),
      redirectCoreToDistPlugin,
    ],
    async onSuccess() {
      mkdirSync("dist/ui/themes", { recursive: true });
      copyFileSync("src/gui/themes/dark.css",  "dist/ui/themes/dark.css");
      copyFileSync("src/gui/themes/light.css", "dist/ui/themes/light.css");
      appendFileSync("dist/ui/index.css", "\n" + readFileSync("src/gui/themes/dark.css", "utf8"));
    },
  },
]);
