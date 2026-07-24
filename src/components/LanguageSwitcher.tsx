"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LOCALE_META, LOCALES, type Locale } from "@/i18n/locales";
import { useLanguage } from "@/i18n/LanguageProvider";

type MenuPhase = "closed" | "open" | "closing";

const UNDERLINE_MS = 420;
const CLOSE_MS = 300;

type LocaleOption = { value: Locale; label: string };

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  const options: LocaleOption[] = LOCALES.map((value) => ({
    value,
    label: LOCALE_META[value].nativeLabel,
  }));

  const [phase, setPhase] = useState<MenuPhase>("closed");
  const [selecting, setSelecting] = useState<Locale | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [triggerUnderline, setTriggerUnderline] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listId = useId();
  const timers = useRef<number[]>([]);
  const prevLocale = useRef(locale);

  const busy = selecting !== null || phase === "closing";
  const menuVisible = phase !== "closed";

  const clearTimers = useCallback(() => {
    for (const id of timers.current) window.clearTimeout(id);
    timers.current = [];
  }, []);

  const prefersReducedMotion = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  useLayoutEffect(() => {
    if (prevLocale.current === locale) return;
    prevLocale.current = locale;
    setTriggerUnderline(false);
    // Force reflow so underline animation can replay
    requestAnimationFrame(() => setTriggerUnderline(true));
    const id = window.setTimeout(() => setTriggerUnderline(false), 520);
    return () => window.clearTimeout(id);
  }, [locale]);

  const closeMenu = useCallback(
    (after?: () => void) => {
      if (phase === "closed") {
        after?.();
        return;
      }

      if (prefersReducedMotion()) {
        setPhase("closed");
        setSelecting(null);
        after?.();
        return;
      }

      setPhase("closing");
      const id = window.setTimeout(() => {
        setPhase("closed");
        setSelecting(null);
        after?.();
      }, CLOSE_MS);
      timers.current.push(id);
    },
    [phase, prefersReducedMotion]
  );

  useEffect(() => {
    if (phase !== "open" || selecting) return;

    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        closeMenu();
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [phase, selecting, closeMenu]);

  useEffect(() => {
    if (phase !== "open" || selecting) return;
    optionRefs.current[activeIndex]?.focus();
  }, [phase, activeIndex, selecting]);

  function openMenu() {
    if (busy) return;
    clearTimers();
    const idx = Math.max(
      0,
      options.findIndex((o) => o.value === locale)
    );
    setActiveIndex(idx);
    setPhase("open");
  }

  function toggleMenu() {
    if (busy) return;
    if (phase === "open") closeMenu();
    else openMenu();
  }

  function runSelectSequence(code: Locale, applyChange: boolean) {
    if (busy && selecting) return;
    clearTimers();
    setPhase("open");
    setSelecting(code);
    setActiveIndex(options.findIndex((o) => o.value === code));

    if (prefersReducedMotion()) {
      if (applyChange) setLocale(code);
      setSelecting(null);
      setPhase("closed");
      return;
    }

    const underlineId = window.setTimeout(() => {
      setPhase("closing");
      const closeId = window.setTimeout(() => {
        if (applyChange) setLocale(code);
        setSelecting(null);
        setPhase("closed");
      }, CLOSE_MS);
      timers.current.push(closeId);
    }, UNDERLINE_MS);
    timers.current.push(underlineId);
  }

  function selectLocale(code: Locale) {
    if (busy) return;
    runSelectSequence(code, code !== locale);
  }

  function onTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (busy) return;
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (phase !== "open") openMenu();
    }
  }

  function onMenuKeyDown(e: React.KeyboardEvent<HTMLUListElement>) {
    if (busy && e.key !== "Escape") return;

    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(0, i - 1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        selectLocale(options[activeIndex].value);
        break;
      case "Escape":
        e.preventDefault();
        closeMenu();
        break;
      default:
        break;
    }
  }

  const current = LOCALE_META[locale];

  return (
    <div
      className={[
        "lang-switcher",
        phase === "open" ? "is-open" : "",
        phase === "closing" ? "is-closing" : "",
        selecting ? "is-selecting" : "",
        triggerUnderline ? "has-trigger-underline" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      ref={rootRef}
    >
      <button
        type="button"
        className="lang-trigger"
        aria-haspopup="listbox"
        aria-expanded={phase === "open"}
        aria-controls={listId}
        aria-label={t.language}
        disabled={busy}
        onClick={toggleMenu}
        onKeyDown={onTriggerKeyDown}
      >
        <span
          className={`lang-trigger-label${
            triggerUnderline ? " is-underlining" : ""
          }`}
        >
          {current.nativeLabel}
        </span>
        <span className="lang-trigger-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {menuVisible ? (
        <ul
          id={listId}
          className="lang-menu"
          role="listbox"
          aria-label={t.language}
          tabIndex={-1}
          onKeyDown={onMenuKeyDown}
        >
          {options.map((opt, index) => {
            const selected = locale === opt.value;
            const isPicked = selecting === opt.value;
            const isActive = index === activeIndex;
            return (
              <li key={opt.value} role="presentation">
                <button
                  ref={(el) => {
                    optionRefs.current[index] = el;
                  }}
                  type="button"
                  role="option"
                  aria-selected={selected || isPicked}
                  tabIndex={isActive ? 0 : -1}
                  className={[
                    "lang-option",
                    selected ? "is-selected" : "",
                    isPicked ? "is-picking" : "",
                    isActive ? "is-active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  disabled={busy}
                  onClick={() => selectLocale(opt.value)}
                  onMouseEnter={() => {
                    if (!busy) setActiveIndex(index);
                  }}
                >
                  <span className="lang-option-text">{opt.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
