import { createFileRoute, redirect } from "@tanstack/react-router";
import { getSession } from "#/lib/auth.functions";
import { z } from "zod/mini";

export const Route = createFileRoute("/{-$locale}/app")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex,nofollow" }],
  }),
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user && !session.user.username) {
      throw redirect({ to: "/{-$locale}/complete-profile" });
    }
    return { session };
  },
  validateSearch: z.object({
    newUser: z.optional(z.boolean()),
  }),
});
