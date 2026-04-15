import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const clientEnv = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_APP_TITLE: z.string().min(1).default("Trichter"),
    VITE_API_BASE_URL: z.string().default(""),
    VITE_BUILD_ID: z.string().default("dev"),
    VITE_GOOGLE_CLIENT_ID: z.string().min(1),
    VITE_TURNSTYLE_SITE_KEY: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
