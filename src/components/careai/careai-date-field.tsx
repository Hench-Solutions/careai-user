"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import type { CareaiSelectOption } from "@/components/careai/select-options";

import { CareaiSelect } from "@/components/careai/careai-select";
import { cn } from "@/lib/utils";

export type CareaiDateFieldHandle = {
  readonly value: string;
  setValue: (value: string) => void;
  focus: () => void;
};

type CareaiDateFieldProps = {
  id?: string;
  name?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Dates after today cannot be picked (a date of birth, for example). */
  disableFuture?: boolean;
  /** `pg` matches the patient forms (shorter, softer field). */
  appearance?: "default" | "pg";
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

const MIN_YEAR = 1900;
const FUTURE_YEARS = 10;

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function parseIsoDate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const probe = new Date(y, m - 1, d);
  if (
    probe.getFullYear() !== y ||
    probe.getMonth() !== m - 1 ||
    probe.getDate() !== d
  ) {
    return null;
  }
  return { y, m, d };
}

function toIsoDate(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function formatDisplayDate(iso: string): string {
  const parts = parseIsoDate(iso);
  if (!parts) return iso;
  const { d, m, y } = parts;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

function todayIso(): string {
  const now = new Date();
  return toIsoDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

type CalendarCell = {
  day: number;
  month: number;
  year: number;
  outside: boolean;
};

function buildMonthGrid(year: number, month: number): CalendarCell[] {
  const first = new Date(year, month - 1, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const daysInPrev = new Date(prevYear, prevMonth, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = startOffset - 1; i >= 0; i -= 1) {
    cells.push({
      day: daysInPrev - i,
      month: prevMonth,
      year: prevYear,
      outside: true,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, month, year, outside: false });
  }

  const nextMonth = month === 12 ? 1 : month + 1;
  const nextYear = month === 12 ? year + 1 : year;
  let trailing = 1;
  while (cells.length % 7 !== 0) {
    cells.push({
      day: trailing,
      month: nextMonth,
      year: nextYear,
      outside: true,
    });
    trailing += 1;
  }

  return cells;
}

function CalendarIcon() {
  return (
    <svg
      className="size-[18px] shrink-0 text-care-purple opacity-[0.72]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export const CareaiDateField = forwardRef<
  CareaiDateFieldHandle,
  CareaiDateFieldProps
>(function CareaiDateField(
  {
    id,
    name,
    className,
    value: valueProp,
    defaultValue = "",
    onChange,
    required,
    disabled,
    placeholder = "dd/mm/yyyy",
    disableFuture,
    appearance = "default",
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
  },
  ref,
) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? valueProp : internalValue;

  const parsedSelected = parseIsoDate(selectedValue);
  const initialView = parsedSelected ?? parseIsoDate(todayIso())!;

  const [open, setOpen] = useState(false);
  const [view, setView] = useState({ y: initialView.y, m: initialView.m });

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = id ? `${id}-popover` : undefined;

  const setSelectedValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      get value() {
        return selectedValue;
      },
      setValue: setSelectedValue,
      focus: () => triggerRef.current?.focus(),
    }),
    [selectedValue, setSelectedValue],
  );

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => {
      if (!isControlled) setInternalValue(defaultValue ?? "");
      setOpen(false);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue, isControlled]);

  useEffect(() => {
    if (!open) return;
    const onDocPointer = (event: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDocPointer);
    document.addEventListener("touchstart", onDocPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocPointer);
      document.removeEventListener("touchstart", onDocPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const openPopover = () => {
    if (disabled) return;
    const anchor = parseIsoDate(selectedValue) ?? parseIsoDate(todayIso());
    if (anchor) setView({ y: anchor.y, m: anchor.m });
    setOpen(true);
  };

  const chooseDay = (cell: CalendarCell) => {
    if (disabled) return;
    setSelectedValue(toIsoDate(cell.year, cell.month, cell.day));
    setOpen(false);
    triggerRef.current?.focus();
  };

  const maxIso = disableFuture ? todayIso() : "";
  const maxParts = parseIsoDate(maxIso);
  const maxYear = maxParts?.y ?? new Date().getFullYear() + FUTURE_YEARS;
  const years = Array.from(
    { length: maxYear - MIN_YEAR + 1 },
    (_, i) => maxYear - i,
  );
  const atLatestMonth =
    !!maxParts &&
    (view.y > maxParts.y || (view.y === maxParts.y && view.m >= maxParts.m));

  const setViewYear = (y: number) =>
    setView(({ m }) => ({
      y,
      m: maxParts && y === maxParts.y ? Math.min(m, maxParts.m) : m,
    }));

  const shiftMonth = (delta: number) => {
    setView(({ y, m }) => {
      let nm = m + delta;
      let ny = y;
      if (nm < 1) {
        nm = 12;
        ny -= 1;
      } else if (nm > 12) {
        nm = 1;
        ny += 1;
      }
      return { y: ny, m: nm };
    });
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) setOpen(false);
      else openPopover();
    }
    if (event.key === "ArrowDown" && !open) {
      event.preventDefault();
      openPopover();
    }
  };

  const grid = useMemo(() => buildMonthGrid(view.y, view.m), [view.y, view.m]);

  const monthOptions = useMemo((): CareaiSelectOption[] => {
    return MONTH_LABELS.map((label, index) => ({
      value: String(index + 1),
      label,
      disabled: !!maxParts && view.y === maxParts.y && index + 1 > maxParts.m,
    }));
  }, [maxParts, view.y]);

  const yearOptions = useMemo(
    (): CareaiSelectOption[] =>
      years.map((year) => ({
        value: String(year),
        label: String(year),
      })),
    [years],
  );

  const today = todayIso();
  const displayText =
    selectedValue ? formatDisplayDate(selectedValue) : placeholder;
  const isPlaceholder = !selectedValue;

  return (
    <div
      ref={rootRef}
      className={cn("careai-date-field relative w-full", className)}
    >
      {name || required ?
        <input
          type="hidden"
          className="pointer-events-none sr-only opacity-0"
          name={name}
          value={selectedValue}
          required={required}
          onChange={() => {}}
        />
      : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        data-slot="careai-date-trigger"
        className={cn(
          "careai-date-field-trigger group/date-trigger flex min-h-[46px] w-full cursor-pointer items-center gap-2.5 rounded-[11px] border-[1.5px] border-care-line bg-[#fbfafd] px-3.5 py-3 text-left font-[inherit] text-sm leading-tight text-care-ink transition-[border-color,background-color,box-shadow] duration-150 outline-none focus-visible:border-care-purple focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-[0.55] aria-expanded:border-care-purple aria-expanded:bg-white",
          appearance === "pg" &&
            "min-h-11 rounded-[10px] bg-care-bg px-3.5 py-[11px] text-[13.5px]",
        )}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={popoverId}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : openPopover())}
        onKeyDown={onTriggerKeyDown}
      >
        <CalendarIcon />
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            isPlaceholder && "text-care-search",
          )}
        >
          {displayText}
        </span>
      </button>
      {open ?
        <div
          id={popoverId}
          className="careai-date-popover absolute top-[calc(100%+6px)] left-0 z-40 w-full max-w-[300px] rounded-[11px] border-[1.5px] border-care-line bg-white p-3 shadow-portal-select-menu"
          role="dialog"
          aria-modal="false"
          aria-label="Choose date"
        >
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <button
              type="button"
              className="careai-date-nav flex size-8 cursor-pointer items-center justify-center rounded-lg border-none bg-[color-mix(in_oklab,var(--color-care-purple)_8%,#fff)] text-xl leading-none text-care-purple transition-[background] duration-[120ms] hover:bg-[color-mix(in_oklab,var(--color-care-purple)_16%,#fff)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklab,var(--color-care-purple)_45%,transparent)] disabled:cursor-not-allowed disabled:opacity-[0.35]"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
            >
              ‹
            </button>
            <span className="flex flex-1 items-center justify-center gap-1.5 text-sm font-extrabold text-care-ink">
              <CareaiSelect
                appearance="compact-month"
                value={String(view.m)}
                options={monthOptions}
                onChange={(next) =>
                  setView(({ y }) => ({ y, m: Number(next) }))
                }
                aria-label="Month"
              />
              <CareaiSelect
                appearance="compact-year"
                value={String(view.y)}
                options={yearOptions}
                onChange={(next) => setViewYear(Number(next))}
                aria-label="Year"
              />
            </span>
            <button
              type="button"
              className="careai-date-nav flex size-8 cursor-pointer items-center justify-center rounded-lg border-none bg-[color-mix(in_oklab,var(--color-care-purple)_8%,#fff)] text-xl leading-none text-care-purple transition-[background] duration-[120ms] hover:bg-[color-mix(in_oklab,var(--color-care-purple)_16%,#fff)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_oklab,var(--color-care-purple)_45%,transparent)] disabled:cursor-not-allowed disabled:opacity-[0.35]"
              aria-label="Next month"
              disabled={atLatestMonth}
              onClick={() => shiftMonth(1)}
            >
              ›
            </button>
          </div>
          <div className="mb-1.5 grid grid-cols-7 gap-0.5" aria-hidden="true">
            {WEEKDAY_LABELS.map((label) => (
              <span
                key={label}
                className="py-1 text-center text-[11px] font-bold text-care-search"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1" role="grid">
            {grid.map((cell, index) => {
              const iso = toIsoDate(cell.year, cell.month, cell.day);
              const isSelected = iso === selectedValue;
              const isToday = iso === today;
              return (
                <button
                  key={`${iso}-${index}`}
                  type="button"
                  role="gridcell"
                  className={cn(
                    "careai-date-day flex min-h-[34px] cursor-pointer items-center justify-center rounded-lg border-none bg-transparent text-[13px] font-semibold text-care-ink transition-[background,color] duration-[120ms] hover:bg-[color-mix(in_oklab,var(--color-care-purple)_10%,#fff)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[color-mix(in_oklab,var(--color-care-purple)_45%,transparent)] disabled:cursor-not-allowed disabled:opacity-[0.35]",
                    cell.outside && "text-[#b8b3c8]",
                    isSelected &&
                      "bg-care-purple font-bold text-white hover:bg-care-purple",
                    isToday &&
                      !isSelected &&
                      "shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--color-care-purple)_35%,transparent)]",
                  )}
                  aria-label={formatDisplayDate(iso)}
                  aria-selected={isSelected}
                  disabled={!!maxIso && iso > maxIso}
                  onClick={() => chooseDay(cell)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      : null}
    </div>
  );
});
