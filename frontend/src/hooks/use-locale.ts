import { useEffect, useState } from "react";
import { i18n } from "#/lib/i18n/config";
import { resolveLocale, persistLocale } from "#/lib/i18n/detect-locale";

export type AppLocale = "en" | "de";

const SUPPORTED_LOCALES: AppLocale[] = ["en", "de"];

function normalizeLocale(value: string): AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale)
    ? (value as AppLocale)
    : "en";
}

export function useLocale() {
  const [locale, setLocale] = useState<AppLocale>(() => resolveLocale());

  useEffect(() => {
    const initial = normalizeLocale(i18n.language || resolveLocale());
    setLocale(initial);

    if (i18n.language !== initial) {
      void i18n.changeLanguage(initial);
    }

    document.documentElement.lang = initial;
  }, []);

  async function setAppLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) return;

    setLocale(nextLocale);
    persistLocale(nextLocale);
    document.documentElement.lang = nextLocale;
    await i18n.changeLanguage(nextLocale);
  }

  function toggle() {
    const nextLocale: AppLocale = locale === "en" ? "de" : "en";
    void setAppLocale(nextLocale);
  }

  return {
    locale,
    setLocale: setAppLocale,
    toggle,
  };
}
