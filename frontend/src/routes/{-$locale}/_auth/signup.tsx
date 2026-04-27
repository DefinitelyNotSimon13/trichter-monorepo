import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { SignupForm } from "#/components/auth/signup-form";
import { z } from "zod/mini";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/_auth/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  validateSearch: z.object({
    redirectTo: z.optional(z.string()),
    initialLogin: z.optional(z.string()),
  }),
  beforeLoad: async ({ params }) => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({
        to: "/{-$locale}/app/feed",
        params: { locale: params.locale },
      });
    }
  },
  component: SignupPage,
});

function SignupPage() {
  const { redirectTo, initialLogin } = Route.useSearch();

  return (
    <AuthCardWrapper>
      <SignupForm redirectTo={redirectTo} initialLogin={initialLogin} />
    </AuthCardWrapper>
  );
}
