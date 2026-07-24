export const LOCALES = ["en", "ar", "tl"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = "shortlist_locale";

export const LOCALE_META: Record<
  Locale,
  { label: string; nativeLabel: string; dir: "ltr" | "rtl"; htmlLang: string }
> = {
  en: {
    label: "English",
    nativeLabel: "English",
    dir: "ltr",
    htmlLang: "en",
  },
  ar: {
    label: "Arabic",
    nativeLabel: "العربية",
    dir: "rtl",
    htmlLang: "ar",
  },
  tl: {
    label: "Tagalog",
    nativeLabel: "Tagalog",
    dir: "ltr",
    htmlLang: "tl",
  },
};

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "ar" || value === "tl";
}
