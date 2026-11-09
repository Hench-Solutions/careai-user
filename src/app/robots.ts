import type { MetadataRoute } from "next";

import { ROUTES } from "@/config/routes";
import { siteConfig, SITEMAP_PATH } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [ROUTES.home, ROUTES.login],
      disallow: [`${ROUTES.patient.base}/`, `${ROUTES.agent.base}/`],
    },
    sitemap: `${siteConfig.url}${SITEMAP_PATH}`,
    host: siteConfig.url,
  };
}
