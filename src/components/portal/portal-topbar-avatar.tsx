"use client";

import { memo } from "react";

import { careaiMockMember } from "@/config/careai-mock";
import { useCareaiSession } from "@/hooks/use-careai-session";
import { sessionInitials } from "@/lib/careai/session";
import { cn } from "@/lib/utils";

type PortalTopbarAvatarProps = {
  className?: string;
};

export const PortalTopbarAvatar = memo(function PortalTopbarAvatar({
  className,
}: PortalTopbarAvatarProps) {
  const session = useCareaiSession();
  const initials =
    session ? sessionInitials(session) : careaiMockMember.initials;

  return <div className={cn("lm-avatar", className)}>{initials}</div>;
});
