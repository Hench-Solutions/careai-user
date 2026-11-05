import "@/styles/careai-login.css";

import { inter } from "@/lib/fonts";
import { cn } from "@/lib/utils";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        inter.variable,
        inter.className,
        "min-h-dvh bg-login-bg font-care-login",
      )}
    >
      {children}
    </div>
  );
}
