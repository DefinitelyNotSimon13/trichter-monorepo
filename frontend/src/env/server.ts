import { createEnv } from "@t3-oss/env-core";
import { FastResponse } from "srvx";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    SERVER_URL: z.url().optional(),
    DATABASE_URL: z.url(),
    TURNSTYLE_SECRET_KEY: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    BETTER_AUTH_API_KEY: z.string().min(1),

    ACS_CONNECTION_STRING: z.string().min(1),
    EMAIL_FROM: z.string().default("noreply@trichter.hauptspeicher.com"),
    EMAIL_CONTACT: z.string().email().default("simon21.blum@gmail.com"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

globalThis.Response = FastResponse;
