import { useRouterState } from "@tanstack/react-router";
import type { AppLocale } from "#/lib/i18n/config";
import { normalizeLocale } from "#/lib/i18n/locale";

function hasLocaleParam(params: unknown): params is { locale?: string } {
  return typeof params === "object" && params !== null && "locale" in params;
}

export function useCurrentLocale(): AppLocale {
  const matches = useRouterState({ select: (s) => s.matches });
  const localeMatch = matches.find((m) => hasLocaleParam(m.params));

  return normalizeLocale(localeMatch?.params.locale);
}
