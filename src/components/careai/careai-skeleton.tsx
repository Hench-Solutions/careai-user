import { cn } from "@/lib/utils";

const portalSkeletonClass = cn(
  "careai-skeleton block rounded-lg",
  "bg-[linear-gradient(90deg,color-mix(in_oklab,var(--color-care-line)_85%,white)_0%,color-mix(in_oklab,var(--color-care-purple)_12%,white)_50%,color-mix(in_oklab,var(--color-care-line)_85%,white)_100%)]",
  "bg-[length:200%_100%] animate-[careai-skeleton-shimmer_1.4s_ease-in-out_infinite]",
  "motion-reduce:animate-none motion-reduce:bg-[color-mix(in_oklab,var(--color-care-line)_70%,white)]",
);

type SkeletonProps = {
  className?: string;
  label?: string;
};

export function Skeleton({ className, label = "Loading" }: SkeletonProps) {
  return (
    <span
      className={cn(portalSkeletonClass, className)}
      role="status"
      aria-busy="true"
      aria-label={label}
    />
  );
}
