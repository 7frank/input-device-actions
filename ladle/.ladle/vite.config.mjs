import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    include: ["svelte", "svelte/internal/client"],
  },
});
