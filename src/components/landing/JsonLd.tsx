import { siteUrl } from "@/lib/serialize";

/**
 * HR SaaS structured data for the public discovery page.
 * Tells search engines Shortlist is HR / recruiting software-as-a-service.
 */
export function JsonLd() {
  const base = siteUrl();

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: "Shortlist",
    legalName: "Shortlist",
    url: base,
    email: "hala@theprovenx.com",
    description:
      "Shortlist is an HR SaaS company building AI recruiting software for talent acquisition teams — CV screening, ranked shortlists, and AI-assisted video interviewing.",
    knowsAbout: [
      "HR SaaS",
      "Human resources software",
      "Recruiting software",
      "Applicant tracking",
      "AI CV screening",
      "AI video interviewing",
      "Talent acquisition",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@getshortlist.app",
      contactType: "customer support",
      areaServed: "Worldwide",
      availableLanguage: "English",
    },
  };

  const hrSaasSoftware = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${base}/#software`,
    name: "Shortlist",
    alternateName: "Shortlist HR SaaS",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "HR SaaS — Recruiting & Talent Acquisition",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript. Modern web browser.",
    url: base,
    description:
      "Shortlist is HR SaaS for recruiting teams: AI CV screening against your criteria, ranked shortlists with written reasons, inbox/ATS intake without migration, and AI-assisted video interviewing.",
    keywords: [
      "HR SaaS",
      "HR software",
      "recruiting SaaS",
      "AI recruiting",
      "AI CV screening",
      "candidate shortlisting",
      "talent acquisition software",
      "AI video interviewing",
      "HR tech",
    ],
    featureList: [
      "Intake — connect inbox or ATS; applications flow in without migration",
      "Screen — AI scores every CV against your criteria with written reasoning",
      "Decide — ranked shortlist with evidence; overrides teach the model",
      "Interview — AI-assisted video interviewing for running and evaluating candidates",
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType:
        "HR professionals, in-house recruiters, talent acquisition teams, recruiting agencies, hiring managers, and people ops",
    },
    offers: {
      "@type": "Offer",
      name: "Shortlist pilot cohort",
      price: "0",
      priceCurrency: "USD",
      description:
        "Free pilot seats for HR and recruiting teams shaping the Shortlist HR SaaS product",
      availability: "https://schema.org/LimitedAvailability",
      url: `${base}/#survey`,
    },
    provider: { "@id": `${base}/#organization` },
    publisher: { "@id": `${base}/#organization` },
  };

  const webPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${base}/#webpage`,
    url: base,
    name: "Shortlist — HR SaaS for AI CV screening & video interviewing",
    description:
      "Market-research and pilot page for Shortlist, an HR SaaS platform that helps recruiting teams screen CVs with AI, build ranked shortlists, and run AI-assisted video interviews.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      name: "Shortlist",
      url: base,
      publisher: { "@id": `${base}/#organization` },
    },
    about: { "@id": `${base}/#software` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${base}/opengraph-image`,
    },
    inLanguage: "en-US",
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${base}/#faq`,
    mainEntity: [
      {
        "@type": "Question",
        name: "Is Shortlist an HR SaaS product?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Shortlist is HR SaaS — cloud recruiting software for HR, talent acquisition, and hiring teams. It focuses on AI CV screening, ranked shortlists with evidence, and AI-assisted video interviewing.",
        },
      },
      {
        "@type": "Question",
        name: "What is Shortlist?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Shortlist is an AI recruiting platform (HR SaaS) that scores every application against your criteria, explains each recommendation, and hands you a ranked shortlist so recruiters interview instead of skimming hundreds of CVs.",
        },
      },
      {
        "@type": "Question",
        name: "Does Shortlist support AI-assisted video interviewing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Alongside AI CV screening, Shortlist includes AI-assisted video interviewing so HR teams can run and evaluate candidate video interviews with AI support.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to migrate my ATS to use this HR software?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Shortlist is designed to connect to your inbox or ATS so applications flow in without a migration or a brand-new hiring workflow.",
        },
      },
    ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, hrSaasSoftware, webPage, faq],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
