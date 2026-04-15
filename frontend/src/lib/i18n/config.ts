import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import enLanding from "./locales/en/landing.json";
import enApp from "./locales/en/app.json";

import deCommon from "./locales/de/common.json";
import deLanding from "./locales/de/landing.json";
import deApp from "./locales/de/app.json";

export const SUPPORTED_LOCALES = ["en", "de"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "en";

export const resources = {
	en: {
		common: enCommon,
		landing: enLanding,
		app: enApp,
	},
	de: {
		common: deCommon,
		landing: deLanding,
		app: deApp,
	},
} as const;

let initialized = false;

export function initI18n(locale: AppLocale) {
	if (!initialized) {
		i18n.use(initReactI18next).init({
			resources,
			lng: locale,
			fallbackLng: DEFAULT_LOCALE,
			supportedLngs: SUPPORTED_LOCALES,
			defaultNS: "common",
			ns: ["common", "landing", "app"],
			interpolation: {
				escapeValue: false,
			},
			returnNull: false,
		});

		initialized = true;
	} else if (i18n.language !== locale) {
		void i18n.changeLanguage(locale);
	}

	return i18n;
}

export { i18n };
