import { createServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";

export const getSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    return auth.api.getSession({ headers });
  },
);

export const requireAdminSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getRequestHeaders();
    const session = await auth.api.getSession({ headers });

    if (!session) {
      return {
        ok: false as const,
        reason: "unauthenticated" as const,
      };
    }

    const role = session.user?.role;
    const isAdmin = Array.isArray(role)
      ? role.includes("admin")
      : role === "admin";

    if (!isAdmin) {
      return {
        ok: false as const,
        reason: "forbidden" as const,
      };
    }

    return {
      ok: true as const,
      reason: "" as const,
      session,
    };
  },
);

export const createOauthClients = createServerFn({ method: "GET" }).handler(
  async () => {
    const result = await auth.api.adminCreateOAuthClient({
      headers: getRequestHeaders(),
      body: {
        redirect_uris: [
          "https://oidc.trichter.hauptspeicher.com/",
          "https://oidc.trichter.hauptspeicher.com/callback",
          "https://oidc.trichter.hauptspeicher.com/oauth/callback",
          "https://trichter.hauptspeicher.com/oauth/callback",
          "https://next.trichter.hauptspeicher.com/oauth/callback",
          "https://mobile.trichter.hauptspeicher.com/oauth/callback",
          "https://mobile.next.trichter.hauptspeicher.com/oauth/callback",
          "trichter://oauth/callback",
        ],
        scope: "openid profile offline_access",
        client_name: "trichter-app",
        client_secret_expires_at: 0,
        skip_consent: true,
        enable_end_session: true,
        token_endpoint_auth_method: "none",
      },
    });

    console.log("Created OAuth client", result);

    return {
      ok: true as const,
    };
  },
);
