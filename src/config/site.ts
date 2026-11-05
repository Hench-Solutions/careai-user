import type { Metadata } from "next";

/**
 * Site configuration for CareAI user web.
 *
 * Production: set `NEXT_PUBLIC_SITE_URL` (no trailing slash) for canonical URLs,
 * Open Graph, sitemap, and robots. Defaults to http://localhost:3000 locally.
 */
const baseUrl =
  (
    typeof process.env.NEXT_PUBLIC_SITE_URL === "string" &&
    process.env.NEXT_PUBLIC_SITE_URL.length > 0
  ) ?
    process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
  : "http://localhost:3000";

/** Authenticated or sign-in routes — keep out of search indexes. */
export const noIndexRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export const siteConfig = {
  name: "CareAI",
  shortName: "CareAI",
  description:
    "CareAI connects patients and care agents on one healthcare platform — second opinions, expert consults, overseas treatment, and case management.",
  url: baseUrl,

  authors: [
    { name: "Khushal Agarwal", url: "https://portfolio.khushalagarwal.tech" },
  ],

  creator: "Hench Solutions",
  publisher: "Hench Solutions",

  keywords: [
    "CareAI",
    "healthcare platform",
    "patient portal",
    "medical tourism",
    "second opinion",
    "care agent",
  ],

  ogImage: `${baseUrl}/og.png`,
};
