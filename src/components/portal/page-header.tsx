import type { ReactNode } from "react";

import { PageBackLink } from "@/components/portal/page-back-link";
import { portalH1, portalSub } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

type PageBackConfig =
  { href: string; label: string } | { onClick: () => void; label: string };

type PageHeaderProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  back?: PageBackConfig;
  actions?: ReactNode;
  className?: string;
};

/** Standard portal page title block: optional back (above title), h1, subtitle, optional actions. */
export function PageHeader({
  title,
  subtitle,
  back,
  actions,
  className,
}: PageHeaderProps) {
  const hasActions = Boolean(actions);

  return (
    <header className={cn("mb-1", className)}>
      {back ?
        <div className="mb-3.5">
          {"href" in back ?
            <PageBackLink href={back.href} label={back.label} />
          : <PageBackLink onClick={back.onClick} label={back.label} />}
        </div>
      : null}
      <div
        className={cn(
          "flex flex-wrap items-start justify-between gap-5",
          hasActions && "mb-[22px]",
        )}
      >
        <div>
          <h1 className={cn(portalH1, hasActions && "mb-0")}>{title}</h1>
          {subtitle ?
            <p className={cn(portalSub, hasActions && "mb-0")}>{subtitle}</p>
          : null}
        </div>
        {actions}
      </div>
    </header>
  );
}
