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
      session,
    };
  },
);
