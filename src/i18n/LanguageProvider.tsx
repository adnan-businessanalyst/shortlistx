"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  isLocale,
  LOCALE_META,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./locales";
import { UI, type UiMessages } from "./ui";
import { getQuestionLocaleMap, type QuestionLocaleCopy } from "./questions";
import type { QuestionDoc } from "@/types/question";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: UiMessages;
  dir: "ltr" | "rtl";
  localizeQuestion: (question: QuestionDoc) => QuestionDoc;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

function applyDocumentLocale(locale: Locale) {
  const meta = LOCALE_META[locale];
  document.documentElement.lang = meta.htmlLang;
  document.documentElement.dir = meta.dir;
  document.documentElement.dataset.locale = locale;
}

export function localizeQuestionDoc(
  question: QuestionDoc,
  locale: Locale
): QuestionDoc {
  const map = getQuestionLocaleMap(locale);
  if (!map) return question;
  const copy: QuestionLocaleCopy | undefined = map[question.key];
  if (!copy) return question;

  return {
    ...question,
    label: copy.label || question.label,
    hint: copy.hint ?? question.hint,
    placeholder: copy.placeholder ?? question.placeholder,
    options: question.options?.map((opt) => ({
      ...opt,
      label: copy.options?.[opt.value] ?? opt.label,
    })),
  };
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const initial = readStoredLocale();
    setLocaleState(initial);
    applyDocumentLocale(initial);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
      document.cookie = `${LOCALE_STORAGE_KEY}=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      /* ignore */
    }
    applyDocumentLocale(next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      setLocale,
      t: UI[locale],
      dir: LOCALE_META[locale].dir,
      localizeQuestion: (q) => localizeQuestionDoc(q, locale),
    }),
    [locale, setLocale]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

const fallbackValue: LanguageContextValue = {
  locale: "en",
  setLocale: () => {},
  t: UI.en,
  dir: "ltr",
  localizeQuestion: (q) => q,
};

/** Returns English fallback when used outside LanguageProvider (e.g. admin simulator). */
export function useLanguage() {
  return useContext(LanguageContext) ?? fallbackValue;
}
