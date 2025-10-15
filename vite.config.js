import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Prayer-Times-with-React/", // 👈 مهم جدًا
  server: {
    port: 3000,
  },
});
