import { createAuthClient } from "better-auth/react";
import { passkeyClient } from "@better-auth/passkey/client";
import {
  adminClient,
  emailOTPClient,
  jwtClient,
  lastLoginMethodClient,
  magicLinkClient,
  usernameClient,
} from "better-auth/client/plugins";
import { dashClient, sentinelClient } from "@better-auth/infra/client";
import { apiKeyClient } from "@better-auth/api-key/client";

export const authClient = createAuthClient({
  plugins: [
    passkeyClient(),
    lastLoginMethodClient(),
    jwtClient(),
    adminClient(),
    dashClient(),
    apiKeyClient(),
    usernameClient(),
    sentinelClient(),
    emailOTPClient(),
    magicLinkClient(),
  ],
});

export type ClientSession = typeof authClient.$Infer.Session;
export type ClientUser = typeof authClient.$Infer.Session.user;
