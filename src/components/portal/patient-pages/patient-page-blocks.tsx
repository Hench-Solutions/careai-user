import Image from "next/image";
import Link from "next/link";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PgIconTint = keyof typeof pgTint;

const pgTint = {
  purple: "bg-[#ede6fb] text-care-purple",
  pink: "bg-[#fce7f3] text-care-pink",
  green: "bg-[#dff7ee] text-[#0f9d58]",
  amber: "bg-[#fdecd8] text-[#b8720a]",
  blue: "bg-[#e0eefc] text-care-blue",
  lavender: "bg-[#f1e9fe] text-care-purple",
} as const;

export function portalPgBtnClass(
  variant?: "outline" | "solid",
  className?: string,
) {
  return cn(
    "inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border-none bg-care-grad px-[22px] py-3 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(107,47,217,0.22)] [&_svg]:size-4",
    variant === "outline" &&
      "bg-transparent text-care-purple shadow-none border-[1.5px] border-care-purple",
    variant === "solid" && "shadow-[0_8px_18px_rgba(107,47,217,0.28)]",
    className,
  );
}

const featureIconClass = (tint: PgIconTint) =>
  cn(
    "flex size-[46px] items-center justify-center rounded-xl [&_svg]:size-[23px]",
    pgTint[tint],
  );

export function ServiceHero({
  badgeIcon,
  badgeLabel = "Our Services",
  title,
  description,
  cta,
  actions,
  icon,
}: {
  badgeIcon: ReactNode;
  badgeLabel?: string;
  title: string;
  description: string;
  cta?: { href: string; label: string };
  /** Custom buttons instead of the single arrow `cta`. */
  actions?: ReactNode;
  icon: ReactNode;
}) {
  return (
    <div className="relative mb-7 flex items-center justify-between gap-[30px] overflow-hidden rounded-[22px] border border-care-line bg-white px-10 py-[38px] text-care-ink shadow-care before:absolute before:inset-y-0 before:left-0 before:w-[5px] before:bg-care-grad max-[1100px]:flex-col max-[1100px]:text-center">
      <div>
        <div className="mb-3.5 inline-flex items-center gap-1.5 rounded-[20px] bg-[#f1e9fe] px-3.5 py-1.5 text-xs font-bold tracking-[0.05em] text-care-purple uppercase [&_svg]:size-3.5">
          {badgeIcon}
          {badgeLabel}
        </div>
        <h1 className="mb-2.5 max-w-[520px] text-[32px] font-extrabold tracking-[-0.5px] text-care-ink">
          {title}
        </h1>
        <p className="mb-5 max-w-[480px] text-[15px] leading-[1.55] text-care-sub">
          {description}
        </p>
        {actions ?
          <div className="flex flex-wrap gap-3">{actions}</div>
        : cta ?
          <Link href={cta.href} className={portalPgBtnClass()}>
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
            {cta.label}
          </Link>
        : null}
      </div>
      <div className="relative z-[1] flex size-[150px] shrink-0 items-center justify-center rounded-[28px] border border-care-line bg-[#f6f5fb] [&_svg]:size-[72px] [&_svg]:text-care-purple">
        {icon}
      </div>
    </div>
  );
}

export function StatsRow({ items }: { items: { num: string; lbl: string }[] }) {
  return (
    <div className="mb-7 grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.lbl}
          className="rounded-2xl border border-care-line bg-white px-5 py-[18px] shadow-care [&_.lbl]:mt-0.5 [&_.lbl]:text-xs [&_.lbl]:font-semibold [&_.lbl]:text-care-sub [&_.num]:text-2xl [&_.num]:font-extrabold [&_.num]:text-care-purple"
        >
          <div className="num">{item.num}</div>
          <div className="lbl">{item.lbl}</div>
        </div>
      ))}
    </div>
  );
}

export function SectionHeader({
  icon,
  title,
  sub,
}: {
  icon: ReactNode;
  title: string;
  sub?: string;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5">
      <div className="flex min-w-0 flex-1 items-center gap-2.5 text-lg font-extrabold">
        <div className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] bg-[#f1e9fe] text-care-purple [&_svg]:size-[17px]">
          {icon}
        </div>
        {title}
      </div>
      {sub ?
        <div className="mt-0 max-w-[min(100%,420px)] shrink-0 text-right text-[13.5px] leading-[1.35] text-care-sub">
          {sub}
        </div>
      : null}
    </div>
  );
}

export function FeatureGrid({
  items,
}: {
  items: {
    tint: PgIconTint;
    icon: ReactNode;
    title: string;
    body: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex cursor-pointer flex-col gap-2.5 rounded-[14px] border border-care-line p-5 transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.12)] [&_h3]:mt-0.5 [&_h3]:text-[15px] [&_h3]:font-extrabold [&_p]:text-[13px] [&_p]:leading-normal [&_p]:text-care-sub"
        >
          <div className={featureIconClass(item.tint)}>{item.icon}</div>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export function StepsList({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  return (
    <div className="flex flex-col">
      {steps.map((step, index) => (
        <div
          key={step.title}
          className="relative flex gap-4 border-b border-care-line py-[18px] last:border-b-0"
        >
          <div className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-care-grad text-[15px] font-extrabold text-white">
            {index + 1}
          </div>
          <div className="[&_h4]:mb-[3px] [&_h4]:text-[14.5px] [&_h4]:font-extrabold [&_p]:text-[13px] [&_p]:leading-normal [&_p]:text-care-sub">
            <h4>{step.title}</h4>
            <p>{step.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CountryGrid({
  countries,
}: {
  countries: { flag: string; name: string; save: string }[];
}) {
  return (
    <div className="grid grid-cols-5 gap-3.5 max-[1100px]:grid-cols-2">
      {countries.map((c) => (
        <div
          key={c.name}
          className="cursor-pointer rounded-[14px] border border-care-line p-4 text-center [&_h4]:mb-1 [&_h4]:text-[13.5px] [&_h4]:font-extrabold"
        >
          <div className="mb-2 text-[28px]">{c.flag}</div>
          <h4>{c.name}</h4>
          <div className="text-xs font-bold text-care-green">{c.save}</div>
        </div>
      ))}
    </div>
  );
}

export function ProcedureTable({
  rows,
}: {
  rows: { procedure: string; savings: string }[];
}) {
  return (
    <table className="w-full border-collapse text-sm [&_td]:border-b [&_td]:border-care-line [&_td]:px-3.5 [&_td]:py-[13px] [&_th]:border-b [&_th]:border-care-line [&_th]:bg-care-bg [&_th]:px-3.5 [&_th]:py-3 [&_th]:text-left [&_th]:text-xs [&_th]:font-bold [&_th]:tracking-[0.03em] [&_th]:text-[#5b5670] [&_th]:uppercase [&_th:first-child]:rounded-l-[10px] [&_th:last-child]:rounded-r-[10px] [&_tr:last-child_td]:border-b-0">
      <thead>
        <tr>
          <th>Procedure</th>
          <th>Avg. Savings</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.procedure}>
            <td>{row.procedure}</td>
            <td>{row.savings}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export type SpecialistProfile = {
  initials: string;
  name: string;
  specialty: string;
  meta: string;
  selectValue: string;
};

export function DoctorGrid({
  doctors,
  onSelect,
}: {
  doctors: SpecialistProfile[];
  onSelect?: (value: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2">
      {doctors.map((doc) => (
        <div
          key={doc.name}
          className="cursor-pointer rounded-2xl border border-care-line p-5 text-center transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.12)] [&_.meta]:mb-3.5 [&_.meta]:text-xs [&_.meta]:text-care-sub [&_.spec]:my-[3px] [&_.spec]:mb-2 [&_.spec]:text-[12.5px] [&_.spec]:font-bold [&_.spec]:text-care-purple [&_h4]:text-[15px] [&_h4]:font-extrabold"
        >
          <div className="mx-auto mb-3 flex size-[72px] items-center justify-center rounded-full bg-care-grad text-[22px] font-extrabold text-white">
            {doc.initials}
          </div>
          <h4>{doc.name}</h4>
          <div className="spec">{doc.specialty}</div>
          <div className="meta">{doc.meta}</div>
          {onSelect ?
            <button
              type="button"
              className={cn(
                "inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-xl border-none bg-care-grad px-[22px] py-3 text-sm font-extrabold whitespace-nowrap text-white shadow-[0_8px_18px_rgba(107,47,217,0.22)] [&_svg]:size-4",
                "w-full justify-center p-2.5 text-[13px]",
              )}
              onClick={() => onSelect(doc.selectValue)}
            >
              Request consult
            </button>
          : null}
        </div>
      ))}
    </div>
  );
}

export function SpecialtyBadges({ labels }: { labels: string[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {labels.map((label) => (
        <div
          key={label}
          className="flex items-center gap-1.5 rounded-[20px] bg-[#f1e9fe] px-3.5 py-2 text-[12.5px] font-bold text-care-purple [&_svg]:size-3.5"
        >
          {label}
        </div>
      ))}
    </div>
  );
}

export function FormConfidentialNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3.5 flex items-center gap-1.5 text-xs text-care-sub [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-care-purple">
      <svg
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      {children}
    </div>
  );
}

export function PgFormSuccess({
  show,
  title,
  message,
}: {
  show: boolean;
  title: string;
  message: string;
}) {
  return (
    <div
      data-slot="form-success"
      data-show={show || undefined}
      className="hidden flex-col items-center gap-3 px-5 py-[46px] text-center data-show:flex"
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-[#dff7ee] [&_svg]:size-[30px] [&_svg]:text-care-green">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h3 className="text-lg font-extrabold">{title}</h3>
      <p className="max-w-[360px] text-[13.5px] leading-normal text-care-sub">
        {message}
      </p>
    </div>
  );
}

export function ArticleGrid({
  items,
}: {
  items: {
    image: string;
    alt: string;
    tag: string;
    title: string;
    body: string;
    readTime: string;
    reviewer: string;
  }[];
}) {
  return (
    <div className="grid grid-cols-4 gap-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-[minmax(0,1fr)]">
      {items.map((item) => (
        <div
          key={item.title}
          className="cursor-pointer overflow-hidden rounded-2xl border border-care-line transition-[transform,box-shadow] duration-150 hover:-translate-y-[3px] hover:border-transparent hover:shadow-[0_10px_22px_rgba(107,47,217,0.12)]"
        >
          <div className="flex h-[110px] items-center justify-center overflow-hidden">
            <Image
              src={item.image}
              alt={item.alt}
              width={280}
              height={110}
              className="size-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="mb-1.5 text-[10.5px] font-extrabold tracking-[0.05em] text-care-purple uppercase">
              {item.tag}
            </div>
            <h4 className="mb-1.5 text-[14.5px] leading-[1.3] font-extrabold">
              {item.title}
            </h4>
            <p className="text-[12.5px] leading-normal text-care-sub">
              {item.body}
            </p>
            <div className="mt-3 flex items-center justify-between text-[11.5px] text-care-sub">
              <span>{item.readTime}</span>
              <span>{item.reviewer}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContactCards({
  items,
}: {
  items: {
    tint: PgIconTint;
    icon: ReactNode;
    title: string;
    note: string;
    link: { href: string; label: string };
  }[];
}) {
  return (
    <div className="mb-[22px] grid grid-cols-3 gap-4 max-[1100px]:grid-cols-2 max-[640px]:grid-cols-[minmax(0,1fr)]">
      {items.map((item) => (
        <div
          key={item.title}
          className="flex items-start gap-3.5 rounded-2xl border border-care-line p-[22px]"
        >
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-[22px] [&_svg]:stroke-current",
              pgTint[item.tint],
            )}
          >
            {item.icon}
          </div>
          <div className="[&_h4]:mb-1 [&_h4]:text-[14.5px] [&_h4]:font-extrabold [&_p]:text-[13px] [&_p]:leading-normal [&_p]:text-care-sub">
            <h4>{item.title}</h4>
            <p>{item.note}</p>
            <a
              href={item.link.href}
              className="cursor-pointer font-bold text-care-purple"
            >
              {item.link.label}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
