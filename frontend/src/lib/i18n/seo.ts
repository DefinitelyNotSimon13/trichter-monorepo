import { resources, DEFAULT_LOCALE, type AppLocale } from "./config";

type NestedRecord = { [k: string]: string | NestedRecord };

function deepGet(obj: NestedRecord, path: string): string {
  const parts = path.split(".");
  let cur: string | NestedRecord = obj;
  for (const p of parts) {
    if (typeof cur !== "object" || cur === null) return "";
    cur = cur[p];
  }
  return typeof cur === "string" ? cur : "";
}

export function seoT(
  locale: string | undefined,
  ns: "landing" | "common" | "app",
  key: string,
): string {
  const lang = (locale ?? DEFAULT_LOCALE) as AppLocale;
  return (
    deepGet(resources[lang]?.[ns] as NestedRecord, key) ||
    deepGet(resources[DEFAULT_LOCALE][ns] as NestedRecord, key)
  );
}
