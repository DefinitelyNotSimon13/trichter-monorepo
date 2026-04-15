import { createFileRoute } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { ResetPasswordForm } from "#/components/auth/reset-password-form";

export const Route = createFileRoute("/{-$locale}/_auth/reset-password")({
  component: ResetPasswordPage,
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
  }),
});

function ResetPasswordPage() {
  return (
    <AuthCardWrapper>
      <ResetPasswordForm className="w-full" />
    </AuthCardWrapper>
  );
}
