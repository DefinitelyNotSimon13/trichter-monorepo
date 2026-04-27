import { createFileRoute, redirect } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ActiveSessionsSection } from "#/components/settings/active-sessions-section";
import { ApiKeysSection } from "#/components/settings/api-keys-section";
import { ChangeEmailSection } from "#/components/settings/change-email-section";
import { ChangePasswordSection } from "#/components/settings/change-password-section";
import { ConnectedAccountsSection } from "#/components/settings/connected-accounts-section";
import { DeleteAccountSection } from "#/components/settings/delete-account-section";
import { DisplayNameSection } from "#/components/settings/display-name-section";
import { PasskeysSection } from "#/components/settings/passkeys-section";
import { Separator } from "#/components/ui/separator";

export const Route = createFileRoute("/{-$locale}/app/settings")({
  staticData: {
    breadcrumb: "Settings",
  },
  beforeLoad: ({ params, context, location }) => {
    if (!context.session?.user) {
      throw redirect({
        to: "/{-$locale}/login",
        params: { locale: params.locale },
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
  const { t } = useTranslation("app");

  return (
    <div className="space-y-10 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("settings.title")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("settings.subtitle")}
        </p>
      </div>

      <Separator />

      <SettingSection
        title={t("settings.sections.displayName.title")}
        description={t("settings.sections.displayName.description")}
      >
        <DisplayNameSection user={user} />
      </SettingSection>

      <Separator />

      <SettingSection
        title={t("settings.sections.email.title")}
        description={t("settings.sections.email.description")}
      >
        <ChangeEmailSection user={user} />
      </SettingSection>

      <Separator />

      <SettingSection
        title={t("settings.sections.password.title")}
        description={t("settings.sections.password.description")}
      >
        <ChangePasswordSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title={t("settings.sections.connectedAccounts.title")}
        description={t("settings.sections.connectedAccounts.description")}
      >
        <ConnectedAccountsSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title={t("settings.sections.passkeys.title")}
        description={t("settings.sections.passkeys.description")}
      >
        <PasskeysSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title={t("settings.sections.apiKeys.title")}
        description={t("settings.sections.apiKeys.description")}
      >
        <ApiKeysSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title={t("settings.sections.activeSessions.title")}
        description={t("settings.sections.activeSessions.description")}
      >
        <ActiveSessionsSection />
      </SettingSection>

      <Separator />

      <SettingSection
        title={t("settings.sections.deleteAccount.title")}
        description={t("settings.sections.deleteAccount.description")}
      >
        <DeleteAccountSection />
      </SettingSection>
    </div>
  );
}
