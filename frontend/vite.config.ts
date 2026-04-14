import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { heyApiPlugin } from "@hey-api/vite-plugin";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const config = defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
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
    tanstackStart(),
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

export default config;
