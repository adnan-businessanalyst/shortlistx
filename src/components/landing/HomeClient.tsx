"use client";

import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { useLanguage } from "@/i18n/LanguageProvider";
import { siteUrl } from "@/lib/serialize";
import type { QuestionDoc } from "@/types/question";

function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35zM12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.82 9.82 0 0 1-1.51-5.26c0-5.44 4.43-9.87 9.89-9.87a9.82 9.82 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.89 6.99c0 5.44-4.44 9.87-9.88 9.87zm8.4-18.28A11.8 11.8 0 0 0 12.04 0C5.46 0 .1 5.35.1 11.93c0 2.1.55 4.16 1.6 5.97L0 24l6.25-1.64a11.93 11.93 0 0 0 5.79 1.47h.01c6.58 0 11.94-5.35 11.94-11.93a11.86 11.86 0 0 0-3.54-8.38z" />
    </svg>
  );
}

export function HomeClient({
  questions,
  loadError,
}: {
  questions: QuestionDoc[];
  loadError: string | null;
}) {
  const { t } = useLanguage();
  const base = siteUrl();
  const waHref = `https://wa.me/?text=${encodeURIComponent(t.shareText + base)}`;

  return (
    <div className="wrap">
      <header className="site-header">
        <BrandLogo href="/" priority height={40} />
        <div className="header-actions">
          <LanguageSwitcher />
          <span className="pilot-badge">{t.pilotBadge}</span>
        </div>
      </header>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="hero-heading">
            {t.heroBefore}
            <span className="hl">
              <span>{t.heroHighlight}</span>
            </span>
          </h1>
          <p className="sub">
            {t.heroSubBefore}
            <strong>{t.heroSubStrong}</strong>
            {t.heroSubAfter}
          </p>
          <div className="cta-row">
            <a className="btn btn-ink" href="#survey">
              {t.cta}
            </a>
            <span className="cta-note">{t.ctaNote}</span>
          </div>

          <div className="steps" aria-label={t.stepsAria}>
            <div className="step">
              <span className="k">{t.intakeK}</span>
              <h3>{t.intakeH}</h3>
              <p>{t.intakeP}</p>
            </div>
            <div className="step">
              <span className="k">{t.screenK}</span>
              <h3>{t.screenH}</h3>
              <p>{t.screenP}</p>
            </div>
            <div className="step">
              <span className="k">{t.decideK}</span>
              <h3>{t.decideH}</h3>
              <p>{t.decideP}</p>
            </div>
            <div className="step">
              <span className="k">{t.interviewK}</span>
              <h3>{t.interviewH}</h3>
              <p>{t.interviewP}</p>
            </div>
          </div>
        </section>

        <section className="survey" id="survey" aria-labelledby="survey-heading">
          <div className="survey-head">
            <h2 id="survey-heading">{t.surveyH}</h2>
            <p>{t.surveyP}</p>
          </div>

          {loadError ? (
            <div className="admin-card">
              <p>{t.surveyLoadError}</p>
            </div>
          ) : (
            <SurveyForm questions={questions} />
          )}

          <aside className="share">
            <div>
              <h3>{t.shareH}</h3>
              <p>{t.shareP}</p>
            </div>
            <a
              className="btn btn-wa"
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WhatsAppIcon />
              {t.shareWa}
            </a>
          </aside>
        </section>
      </main>

      <footer className="site-footer">
        <span>{t.footer}</span>
        <a href="mailto:hello@getshortlist.app">hello@getshortlist.app</a>
      </footer>
    </div>
  );
}
