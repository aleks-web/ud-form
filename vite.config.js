import { defineConfig } from "vite";
import includeHtml from "vite-plugin-include-html";

export default defineConfig({
  plugins: [includeHtml()],
});