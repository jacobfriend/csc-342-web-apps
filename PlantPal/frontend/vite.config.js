import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Listen on all interfaces
    port: 80,
    watch: {
      usePolling: true, // Enable polling for file changes
    },
  },
  build: {
    outDir: "build", // Specify the output directory for the build
  },
});
