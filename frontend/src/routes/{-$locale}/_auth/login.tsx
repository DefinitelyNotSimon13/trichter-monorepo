import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod/mini";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { LoginForm } from "#/components/auth/login-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/_auth/login")({
  head: () => ({
    meta: [
      { title: "Sign In | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: z.object({
    redirectTo: z.optional(z.string()),
    initialLogin: z.optional(z.string()),
    newUser: z.optional(z.boolean()),
    mobile: z.optional(z.boolean()),
  }),
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({ to: "/{-$locale}/app/feed" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const { redirectTo, initialLogin, mobile } = Route.useSearch();

  return (
    <AuthCardWrapper>
      <LoginForm
        redirectTo={redirectTo}
        initialLogin={initialLogin}
        isOauth={mobile}
      />
    </AuthCardWrapper>
  );
}
