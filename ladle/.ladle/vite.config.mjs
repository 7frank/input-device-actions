import { defineConfig } from "vite";

export default defineConfig({
  base: "/input-device-actions/",
  optimizeDeps: {
    include: ["svelte", "svelte/internal/client"],
  },
});
