import { createFileRoute, redirect } from "@tanstack/react-router";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { ForgotPasswordForm } from "#/components/auth/forgot-password-form";
import { getSession } from "#/lib/auth.functions";

export const Route = createFileRoute("/{-$locale}/_auth/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password | Trichter" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession();
    if (session?.user) {
      throw redirect({ to: "/{-$locale}/app/feed" });
    }
  },
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  return (
    <AuthCardWrapper>
      <ForgotPasswordForm className="w-full" />
    </AuthCardWrapper>
  );
}
