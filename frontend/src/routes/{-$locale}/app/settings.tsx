import { createFileRoute, redirect } from "@tanstack/react-router";
import { Separator } from "#/components/ui/separator";
import { ActiveSessionsSection } from "#/components/settings/active-sessions-section";
import { ApiKeysSection } from "#/components/settings/api-keys-section";
import { ChangeEmailSection } from "#/components/settings/change-email-section";
import { ChangePasswordSection } from "#/components/settings/change-password-section";
import { ConnectedAccountsSection } from "#/components/settings/connected-accounts-section";
import { DisplayNameSection } from "#/components/settings/display-name-section";
import { PasskeysSection } from "#/components/settings/passkeys-section";
import { DeleteAccountSection } from "#/components/settings/delete-account-section";

export const Route = createFileRoute("/{-$locale}/app/settings")({
  staticData: {
    breadcrumb: "Settings",
  },
  beforeLoad: ({ context, location }) => {
    if (!context.session?.user) {
      throw redirect({
        to: "/{-$locale}/login",
        search: { redirectTo: location.href },
      });
    }
    return { user: context.session.user };
  },
  component: SettingsPage,
});

function SettingSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

function SettingsPage() {
  const { user } = Route.useRouteContext();

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Account Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, security, and integrations.
        </p>
      </div>

      <Separator />

      <SettingSection
        title="Display name"
        description="How your name appears to other users."
      >
        <DisplayNameSection user={user} />
      </SettingSection>

      <Separator />

      <SettingSection
        title="Email address"
        description="Change the email used to sign in and receive notifications."
      >
        <ChangeEmailSection user={user} />
      </SettingSection>

      <Separator />

      <SettingSection
        title="Password"
        description="Update your password. Existing sessions will remain active."
      >
        <ChangePasswordSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title="Connected accounts"
        description="Link or unlink social sign-in providers."
      >
        <ConnectedAccountsSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title="Passkeys"
        description="Sign in without a password using a passkey stored on your device."
      >
        <PasskeysSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title="API keys"
        description="Create keys to authenticate programmatic access to your account."
      >
        <ApiKeysSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title="Active sessions"
        description="View and revoke sessions signed in to your account."
      >
        <ActiveSessionsSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title="Delete account"
        description="This action is permament and can not be reversed!"
      >
        <DeleteAccountSection />
      </SettingSection>
    </div>
  );
}
