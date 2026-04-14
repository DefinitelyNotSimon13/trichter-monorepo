import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { heyApiPlugin } from '@hey-api/vite-plugin';

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    tanstackStart(),
    viteReact({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    heyApiPlugin({
      config: {
        input: 'http://localhost:8080/v3/api-docs',
        output: 'src/client-test',
        plugins: [
          '@tanstack/react-query'
        ]
      }
    })
  ],
})

export default config
