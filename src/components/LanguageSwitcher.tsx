"use client";

import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";
import { useLanguage } from "@/i18n/LanguageProvider";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="lang-switcher" role="group" aria-label={t.language}>
      <span className="lang-switcher-label mono">{t.language}</span>
      <div className="lang-switcher-btns">
        {LOCALES.map((code) => {
          const meta = LOCALE_META[code as Locale];
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              className={`lang-btn${active ? " active" : ""}`}
              aria-pressed={active}
              onClick={() => setLocale(code)}
            >
              {meta.nativeLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
