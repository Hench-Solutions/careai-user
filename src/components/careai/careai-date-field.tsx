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

export type CareaiDateFieldHandle = {
  readonly value: string;
  setValue: (value: string) => void;
  focus: () => void;
};

export type CareaiDateFieldProps = {
  id?: string;
  name?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

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
      className="careai-date-field-icon"
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

  const today = todayIso();
  const displayText =
    selectedValue ? formatDisplayDate(selectedValue) : placeholder;
  const isPlaceholder = !selectedValue;

  return (
    <div
      ref={rootRef}
      className={["careai-date-field", className].filter(Boolean).join(" ")}
    >
      {name || required ?
        <input
          type="text"
          className="careai-date-field-native-sync"
          name={name}
          value={selectedValue}
          readOnly
          tabIndex={-1}
          aria-hidden="true"
          required={required}
          onChange={() => {}}
        />
      : null}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className="careai-date-field-trigger"
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
          className={
            isPlaceholder ?
              "careai-date-field-value is-placeholder"
            : "careai-date-field-value"
          }
        >
          {displayText}
        </span>
      </button>
      {open ?
        <div
          id={popoverId}
          className="careai-date-popover"
          role="dialog"
          aria-modal="false"
          aria-label="Choose date"
        >
          <div className="careai-date-popover-header">
            <button
              type="button"
              className="careai-date-nav"
              aria-label="Previous month"
              onClick={() => shiftMonth(-1)}
            >
              ‹
            </button>
            <span className="careai-date-popover-title">
              {MONTH_LABELS[view.m - 1]} {view.y}
            </span>
            <button
              type="button"
              className="careai-date-nav"
              aria-label="Next month"
              onClick={() => shiftMonth(1)}
            >
              ›
            </button>
          </div>
          <div className="careai-date-weekdays" aria-hidden="true">
            {WEEKDAY_LABELS.map((label) => (
              <span key={label} className="careai-date-weekday">
                {label}
              </span>
            ))}
          </div>
          <div className="careai-date-grid" role="grid">
            {grid.map((cell, index) => {
              const iso = toIsoDate(cell.year, cell.month, cell.day);
              const isSelected = iso === selectedValue;
              const isToday = iso === today;
              return (
                <button
                  key={`${iso}-${index}`}
                  type="button"
                  role="gridcell"
                  className={[
                    "careai-date-day",
                    cell.outside ? "is-outside" : "",
                    isSelected ? "is-selected" : "",
                    isToday ? "is-today" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label={formatDisplayDate(iso)}
                  aria-selected={isSelected}
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
