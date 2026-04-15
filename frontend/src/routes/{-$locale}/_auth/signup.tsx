import { createFileRoute } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { SignupForm } from "#/components/auth/signup-form";

export const Route = createFileRoute("/{-$locale}/_auth/signup")({
  component: SignupPage,
});

function SignupPage() {
  return (
    <AuthCardWrapper>
      <SignupForm />
    </AuthCardWrapper>
  );
}
