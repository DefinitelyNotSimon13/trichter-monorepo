import { Link } from "@tanstack/react-router";
import { Trans, useTranslation } from "react-i18next";

export function PrivacyNotice() {
  const { t } = useTranslation("common");

  return (
    <Trans
      t={t}
      i18nKey="privacy.notice"
      components={{
        terms: (
          <a href="/terms" className="underline underline-offset-4">
            {t("privacy.terms")}
          </a>
        ),
        privacy: (
          <Link
            to="/{-$locale}/policy/privacy"
            className="underline underline-offset-4"
          >
            {t("privacy.privacyPolicy")}
          </Link>
        ),
      }}
    />
  );
}
