import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    SERVER_URL: z.url().optional(),
  },

  /**
   * The prefix that client-side variables must have. This is enforced both at
   * a type-level and at runtime.
   */
  clientPrefix: 'VITE_',

  client: {
    VITE_APP_TITLE: z.string().min(1).default("Trichter"),
    VITE_API_BASE_URL: z.url().default("http://localhost:8080"),
  },

  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
})
