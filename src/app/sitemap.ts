import type { MetadataRoute } from "next";

import { ROUTES } from "@/config/routes";
import { siteConfig } from "@/config/site";

/** Public entry points only — portal routes are authenticated and omitted. */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}${ROUTES.login}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
