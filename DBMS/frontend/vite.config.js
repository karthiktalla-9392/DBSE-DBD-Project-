import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0"
  },
  build: {
    rollupOptions: {
      input: {
        index: "index.html",
        customer: "customer.html",
        kds: "kds.html",
        admin: "admin.html"
      }
    }
  }
});
