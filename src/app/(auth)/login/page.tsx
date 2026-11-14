import { Suspense } from "react";

import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { LOGIN_PARAMS, LOGIN_REASONS } from "@/config/auth";
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

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** The query string is request data, so only this part waits for it; the form paints at once. */
async function LoginFormWithParams({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const next = params[LOGIN_PARAMS.next];
  return (
    <LoginForm
      next={typeof next === "string" ? next : undefined}
      expired={params[LOGIN_PARAMS.reason] === LOGIN_REASONS.expired}
    />
  );
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <Suspense fallback={<LoginForm />}>
      <LoginFormWithParams searchParams={searchParams} />
    </Suspense>
  );
}
