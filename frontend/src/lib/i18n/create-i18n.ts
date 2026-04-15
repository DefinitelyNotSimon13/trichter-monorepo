import i18next, { type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next";
import {
  DEFAULT_LOCALE,
  I18N_NAMESPACES,
  resources,
  type AppLocale,
  SUPPORTED_LOCALES,
} from "./config";

export async function createI18n(locale: AppLocale): Promise<I18nInstance> {
  const instance = i18next.createInstance();

  await instance.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: SUPPORTED_LOCALES,
    defaultNS: "common",
    ns: [...I18N_NAMESPACES],
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

  return instance;
}
