import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // For Vercel: use "/" for root deployment, or "/admin/" for subpath
  base: process.env.VITE_BASE_PATH || "/",
});
