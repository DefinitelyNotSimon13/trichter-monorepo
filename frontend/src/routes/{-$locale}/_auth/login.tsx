import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AuthCardWrapper } from "#/components/auth/auth-card-wrapper";
import { LoginForm } from "#/components/auth/login-form";
import { useEffect } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/{-$locale}/_auth/login")({
  validateSearch: z.object({
    redirectTo: z.string().optional(),
    initialLogin: z.string().optional(),
    newUser: z.boolean().optional(),
  }),
  component: LoginPage,
});

function LoginPage() {
  const { redirectTo, initialLogin } = Route.useSearch();

  return (
    <AuthCardWrapper>
      <LoginForm redirectTo={redirectTo} initialLogin={initialLogin} />
    </AuthCardWrapper>
  );
}
