import { Suspense } from "react";

import { CareaiErrorPage } from "@/components/careai/careai-error-page";
import { dashboardPathForRole, roleLabels } from "@/config/auth";
import { ROUTES } from "@/config/routes";
import { getOptionalCurrentUser } from "@/server/session";

const notFoundPage = (backHref: string, backLabel: string) => (
  <CareaiErrorPage
    eyebrow="404"
    title="Page not found"
    description="We couldn't find that page. It may have been moved or the link is out of date."
    backHref={backHref}
    backLabel={backLabel}
  />
);

const signInPage = () => notFoundPage(ROUTES.login, "Go to sign in");

async function NotFoundForVisitor() {
  const user = await getOptionalCurrentUser();
  return user ?
      notFoundPage(
        dashboardPathForRole(user.role),
        `Go to ${roleLabels[user.role]} dashboard`,
      )
    : signInPage();
}

/** Who is looking is request data, so the page paints at once with the sign-in link and swaps in the dashboard link. */
export default function NotFound() {
  return (
    <Suspense fallback={signInPage()}>
      <NotFoundForVisitor />
    </Suspense>
  );
}
