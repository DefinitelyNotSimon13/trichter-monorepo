import { createFileRoute } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { SignupForm } from "#/components/auth/signup-form";
import z from "zod";

export const Route = createFileRoute("/{-$locale}/_auth/signup")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
    initialLogin: z.string().optional(),
  }),
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
