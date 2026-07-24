import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { siteUrl } from "@/lib/serialize";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  display: "swap",
});

const base = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default:
      "Shortlist — HR SaaS for AI CV screening & video interviewing",
    template: "%s · Shortlist",
  },
  description:
    "Shortlist is HR SaaS for recruiting teams: AI CV screening, ranked shortlists with reasons, and AI-assisted video interviewing. Join the pilot.",
  keywords: [
    "HR SaaS",
    "HR software",
    "recruiting SaaS",
    "AI CV screening",
    "AI video interviewing",
    "talent acquisition software",
    "Shortlist",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: base,
    siteName: "Shortlist",
    title: "Shortlist — HR SaaS for AI CV screening & video interviewing",
    description:
      "HR SaaS for recruiters: stop reading hundreds of CVs. Shortlist scores applications, ranks a shortlist with evidence, and assists video interviews.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shortlist — HR SaaS for AI recruiting",
    description:
      "HR SaaS with AI CV screening, ranked shortlists, and AI-assisted video interviewing. Join the pilot cohort.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${ibmPlexMono.variable} ${notoArabic.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
