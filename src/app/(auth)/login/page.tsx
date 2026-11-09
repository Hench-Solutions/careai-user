import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/config/routes";
import { noIndexRobots, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to CareAI as a patient or agent. Patients can register; agent accounts are provisioned by your organization.",
  alternates: {
    canonical: ROUTES.login,
  },
  robots: noIndexRobots,
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/login`,
    title: `${siteConfig.name} — Sign in`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Sign in`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
