import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/input-device-actions/",
  resolve: {
    dedupe: ["react", "react-dom", "svelte"],
    alias: {
      react: path.resolve(__dirname, "../node_modules/react"),
      "react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
    },
  },
  optimizeDeps: {
    include: ["svelte", "svelte/internal/client"],
  },
});
