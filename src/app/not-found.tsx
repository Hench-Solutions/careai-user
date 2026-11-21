import { CareaiErrorPage } from "@/components/careai/careai-error-page";
import { dashboardPathForRole, roleLabels } from "@/config/auth";
import { ROUTES } from "@/config/routes";
import { getOptionalCurrentUser } from "@/server/session";

export default async function NotFound() {
  const user = await getOptionalCurrentUser();

  return (
    <CareaiErrorPage
      eyebrow="404"
      title="Page not found"
      description="We couldn't find that page. It may have been moved or the link is out of date."
      backHref={user ? dashboardPathForRole(user.role) : ROUTES.login}
      backLabel={
        user ? `Go to ${roleLabels[user.role]} dashboard` : "Go to sign in"
      }
    />
  );
}
