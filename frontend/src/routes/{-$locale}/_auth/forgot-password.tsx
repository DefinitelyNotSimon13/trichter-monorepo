import { createFileRoute } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { ForgotPasswordForm } from "#/components/auth/forgot-password-form";

export const Route = createFileRoute("/{-$locale}/_auth/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { locale } = Route.useParams();
  return (
    <AuthCardWrapper locale={locale ?? ""}>
      <ForgotPasswordForm className="w-full" locale={locale ?? ""} />
    </AuthCardWrapper>
  );
}
