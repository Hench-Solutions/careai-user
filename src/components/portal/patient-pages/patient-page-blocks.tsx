import Link from "next/link";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function ServiceHero({
  badgeIcon,
  badgeLabel = "Our Services",
  title,
  description,
  cta,
  icon,
}: {
  badgeIcon: ReactNode;
  badgeLabel?: string;
  title: string;
  description: string;
  cta?: { href: string; label: string };
  icon: ReactNode;
}) {
  return (
    <div className="pg-hero">
      <div>
        <div className="pg-hero-badge">
          {badgeIcon}
          {badgeLabel}
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
        {cta ?
          <Link href={cta.href} className="pg-btn">
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
      <div className="pg-hero-icon">{icon}</div>
    </div>
  );
}

export function StatsRow({ items }: { items: { num: string; lbl: string }[] }) {
  return (
    <div className="pg-stats-row">
      {items.map((item) => (
        <div key={item.lbl} className="pg-stat-mini">
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
    <div className="pg-section-head">
      <div className="pg-section-title">
        <div className="pg-section-title-icon">{icon}</div>
        {title}
      </div>
      {sub ?
        <div className="pg-section-sub">{sub}</div>
      : null}
    </div>
  );
}

type FeatureIconTint =
  "purple" | "pink" | "green" | "amber" | "blue" | "lavender";

export function FeatureGrid({
  items,
}: {
  items: {
    tint: FeatureIconTint;
    icon: ReactNode;
    title: string;
    body: string;
  }[];
}) {
  return (
    <div className="pg-grid-3">
      {items.map((item) => (
        <div key={item.title} className="pg-feature">
          <div className={cn("pg-feature-icon", `t-${item.tint}`)}>
            {item.icon}
          </div>
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
    <div className="pg-steps">
      {steps.map((step, index) => (
        <div key={step.title} className="pg-step">
          <div className="pg-step-num">{index + 1}</div>
          <div className="pg-step-body">
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
    <div className="pg-country-grid">
      {countries.map((c) => (
        <div key={c.name} className="pg-country">
          <div className="pg-country-flag">{c.flag}</div>
          <h4>{c.name}</h4>
          <div className="save">{c.save}</div>
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
    <table className="pg-table">
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
    <div className="pg-grid-4">
      {doctors.map((doc) => (
        <div key={doc.name} className="pg-doctor">
          <div className="pg-doctor-avatar">{doc.initials}</div>
          <h4>{doc.name}</h4>
          <div className="spec">{doc.specialty}</div>
          <div className="meta">{doc.meta}</div>
          {onSelect ?
            <button
              type="button"
              className="pg-btn"
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
    <div className="pg-badge-list">
      {labels.map((label) => (
        <div key={label} className="pg-badge-chip">
          {label}
        </div>
      ))}
    </div>
  );
}

export function FormConfidentialNote({ children }: { children: ReactNode }) {
  return (
    <div className="pg-form-note">
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
    <div className={cn("pg-success", show && "show")}>
      <div className="pg-success-icon">
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
