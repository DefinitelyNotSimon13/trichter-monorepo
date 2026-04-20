import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { SignupForm } from "#/components/auth/signup-form";
import z from "zod";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/_auth/signup")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
    initialLogin: z.string().optional(),
  }),
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({ to: "/{-$locale}/app/feed" });
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
