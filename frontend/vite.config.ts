import { heyApiPlugin } from "@hey-api/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "react-vendor";
          }
          if (id.includes("node_modules/@tanstack/react-query")) {
            return "query";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
        },
      },
    },
  },
  server: {
    proxy: {
      "/api/v2": {
        target: "http://localhost:8080",
        changeOrigin: true,
        ws: true,
      },
      "/actuator": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart({
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: ({ path }) => !path.startsWith("/api"),
        onSuccess: ({ page }) => {
          console.log(`Rendered ${page.path}!`);
        },
      },
      sitemap: {
        enabled: true,
        host: "https://trichter.hauptspeicher.com",
      },
      pages: [
        {
          path: "/",
          prerender: { enabled: true },
        },
        {
          path: "/de",
          prerender: { enabled: true },
        },
        {
          path: "/en",
          prerender: { enabled: true },
        },
      ],
    }),
    // nitro({ compressPublicAssets: { gzip: true, brotli: true } }),
    viteReact({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    heyApiPlugin({
      config: {
        input: "./openapi/backend.json",
        output: "src/client",
        plugins: [
          {
            name: "@tanstack/react-query",
            infiniteQueryOptions: true,
          },
          {
            name: "@hey-api/typescript",
            enums: "typescript",
          },
        ],
      },
    }),
  ],
});
