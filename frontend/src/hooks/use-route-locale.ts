import { useRouterState } from "@tanstack/react-router";
import type { AppLocale } from "#/lib/i18n/config";
import { resolveLocale } from "#/lib/i18n/detect-locale";

/**
 * Returns the current locale derived from the active route's `{-$locale}` param.
 * Falls back to localStorage → browser language → DEFAULT_LOCALE.
 */
export function useRouteLocale(): AppLocale {
	const matches = useRouterState({ select: (s) => s.matches });
	const localeMatch = matches.find((m) => "locale" in (m.params ?? {}));
	return resolveLocale(localeMatch?.params?.locale as string | undefined);
}
