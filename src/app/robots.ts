import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/serialize";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/admin"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
