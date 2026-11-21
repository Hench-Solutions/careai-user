"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { CareaiSelectOption } from "@/components/careai/select-options";

import { cn } from "@/lib/utils";

export type CareaiSelectHandle = {
  readonly value: string;
  setValue: (value: string) => void;
  focus: () => void;
};

type CareaiSelectProps = {
  id?: string;
  name?: string;
  className?: string;
  options: readonly CareaiSelectOption[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Adds a search box: typing narrows the list, as in the core app. */
  searchable?: boolean;
  /** Toolbar search row layout (registration list) or compact month/year (date popover). */
  appearance?:
    "default" | "toolbar" | "compact-month" | "compact-year" | "pg" | "field";
  "aria-label"?: string;
  "aria-labelledby"?: string;
};

function findLabel(
  options: readonly CareaiSelectOption[],
  value: string,
  placeholder?: string,
): string {
  if (!value && placeholder) return placeholder;
  const match = options.find((o) => o.value === value);
  return match?.label ?? value;
}

export const CareaiSelect = forwardRef<CareaiSelectHandle, CareaiSelectProps>(
  function CareaiSelect(
    {
      id,
      name,
      className,
      options,
      defaultValue = "",
      value: valueProp,
      onChange,
      required,
      disabled,
      placeholder,
      searchable,
      appearance = "default",
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    ref,
  ) {
    const isToolbar = appearance === "toolbar";
    const isCompactMonth = appearance === "compact-month";
    const isCompactYear = appearance === "compact-year";
    const isPg = appearance === "pg";
    const isField = appearance === "field";
    const isCompact = isCompactMonth || isCompactYear;
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? valueProp : internalValue;

    const [open, setOpen] = useState(false);
    const [menuFlipUp, setMenuFlipUp] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [query, setQuery] = useState("");
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const listId = id ? `${id}-listbox` : undefined;

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
        setActiveIndex(-1);
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

    useEffect(() => {
      if (!open || activeIndex < 0) return;
      const el = listRef.current?.children[activeIndex] as
        HTMLElement | undefined;
      el?.scrollIntoView({ block: "nearest" });
    }, [open, activeIndex]);

    useEffect(() => {
      if (open && searchable) searchRef.current?.focus();
    }, [open, searchable]);

    const needle = query.trim().toLowerCase();
    const visibleOptions = useMemo(
      () =>
        searchable && needle ?
          options
            .filter(
              (o) => o.value !== "" && o.label.toLowerCase().includes(needle),
            )
            .sort(
              (a, b) =>
                Number(!a.label.toLowerCase().startsWith(needle)) -
                Number(!b.label.toLowerCase().startsWith(needle)),
            )
        : options,
      [needle, options, searchable],
    );
    const enabledOptions = useMemo(
      () => visibleOptions.filter((o) => !o.disabled),
      [visibleOptions],
    );

    useLayoutEffect(() => {
      if (!open || !triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const estimatedMenu = 248;
      setMenuFlipUp(spaceBelow < estimatedMenu && spaceAbove > spaceBelow);
    }, [open, visibleOptions.length]);

    const displayLabel = findLabel(options, selectedValue, placeholder);
    const isPlaceholder = !selectedValue && Boolean(placeholder);

    const openList = (seed = "", preferActiveIndex?: number) => {
      if (disabled) return;
      setQuery(seed);
      const idx =
        preferActiveIndex ??
        (seed ? 0 : enabledOptions.findIndex((o) => o.value === selectedValue));
      setActiveIndex(idx >= 0 ? idx : 0);
      setOpen(true);
    };

    const choose = (option: CareaiSelectOption | undefined) => {
      if (!option || option.disabled) return;
      setSelectedValue(option.value);
      setOpen(false);
      triggerRef.current?.focus();
    };

    const onTriggerKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement | HTMLInputElement>,
    ) => {
      if (disabled) return;
      if (
        !open &&
        event.key.length === 1 &&
        event.key !== " " &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        const letter = event.key.toLowerCase();
        if (searchable) {
          event.preventDefault();
          openList(event.key);
          return;
        }
        const matchIdx = enabledOptions.findIndex((o) =>
          o.label.toLowerCase().startsWith(letter),
        );
        if (matchIdx >= 0) {
          event.preventDefault();
          openList("", matchIdx);
        }
      }
      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
          event.preventDefault();
          if (!open) {
            openList();
          } else {
            setActiveIndex((i) => {
              const max = enabledOptions.length - 1;
              if (event.key === "ArrowDown") return i >= max ? 0 : i + 1;
              return i <= 0 ? max : i - 1;
            });
          }
          break;
        case "Enter":
        case " ":
          if (searchable && open && event.key === " ") break;
          event.preventDefault();
          if (!open) openList();
          else if (activeIndex >= 0 && enabledOptions[activeIndex])
            choose(enabledOptions[activeIndex]);
          break;
        case "Home":
          if (open && !searchable) {
            event.preventDefault();
            setActiveIndex(0);
          }
          break;
        case "End":
          if (open && !searchable) {
            event.preventDefault();
            setActiveIndex(enabledOptions.length - 1);
          }
          break;
        default:
          break;
      }
    };

    return (
      <div
        ref={rootRef}
        data-slot="careai-select"
        className={cn(
          "relative w-full",
          isToolbar &&
            "w-[180px] max-w-full shrink-0 basis-[180px] max-[640px]:w-full max-[640px]:flex-[1_1_100%] max-[640px]:basis-full",
          isCompactMonth && "w-auto min-w-[118px]",
          isCompactYear && "w-auto min-w-[76px]",
          className,
        )}
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
          data-slot="careai-select-trigger"
          className={cn(
            "group/select-trigger flex min-h-[46px] w-full cursor-pointer items-center gap-2 rounded-xl border-[1.5px] border-care-line bg-[#fbfafd] px-3.5 py-[11px] text-left text-sm leading-tight font-normal text-care-ink transition-[border-color,background-color,box-shadow] duration-150 outline-none focus-visible:border-care-purple focus-visible:bg-white focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-care-purple)_16%,transparent)] hover:enabled:border-[color-mix(in_oklab,var(--color-care-purple)_35%,var(--color-care-line))] disabled:cursor-not-allowed disabled:opacity-[0.55] aria-expanded:border-care-purple aria-expanded:bg-white aria-expanded:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-care-purple)_16%,transparent)]",
            "group/select-trigger",
            isToolbar && "h-full min-h-[46px] bg-white",
            isField && "px-3.5 py-3",
            isPg &&
              "min-h-[44px] rounded-[10px] bg-care-bg px-3.5 py-3 text-[13.5px]",
            isCompact &&
              "min-h-0 rounded-lg bg-white px-2 py-1 pl-2 text-[13px] font-bold focus-visible:shadow-none aria-expanded:shadow-none [&_span[aria-hidden]]:size-3.5 [&_span[aria-hidden]_svg]:size-3.5",
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openList())}
          onKeyDown={onTriggerKeyDown}
        >
          <span
            className={cn(
              "min-w-0 flex-1 truncate text-left",
              isPlaceholder && "text-care-search",
            )}
          >
            {displayLabel}
          </span>
          <span
            className="ml-auto flex size-4 shrink-0 items-center justify-center text-care-search transition-transform duration-150 ease-in-out group-aria-expanded/select-trigger:rotate-180 [&_svg]:size-4"
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 9l6 6 6-6"
              />
            </svg>
          </span>
        </button>
        {open ?
          <ul
            ref={listRef}
            id={listId}
            data-slot="careai-select-menu"
            className={cn(
              "absolute top-[calc(100%+6px)] right-0 left-0 z-[60] m-0 max-h-60 list-none overflow-y-auto rounded-[11px] border-[1.5px] border-care-line bg-white p-1.5 shadow-portal-select-menu",
              menuFlipUp && "top-auto bottom-[calc(100%+6px)]",
              isToolbar && "z-[80] min-w-full rounded-xl",
              isCompact && "z-[70] max-h-[200px]",
            )}
            role="listbox"
            aria-activedescendant={
              activeIndex >= 0 && enabledOptions[activeIndex] && id ?
                `${id}-opt-${activeIndex}`
              : undefined
            }
          >
            {searchable ?
              <li
                role="presentation"
                className="list-none px-0.5 pt-0.5 pb-1.5"
              >
                <input
                  ref={searchRef}
                  type="text"
                  className="w-full rounded-lg border-[1.5px] border-care-line bg-white px-2.5 py-2 text-sm text-care-ink focus:border-care-purple focus:outline-none"
                  value={query}
                  placeholder="Type to search"
                  aria-label="Search options"
                  autoComplete="off"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onTriggerKeyDown}
                />
              </li>
            : null}
            {searchable && needle && visibleOptions.length === 0 ?
              <li
                role="presentation"
                className="list-none px-3 py-2.5 text-sm text-care-sub"
              >
                No matches
              </li>
            : null}
            {visibleOptions.map((option, index) => {
              const enabledIdx = enabledOptions.indexOf(option);
              const isActive = open && enabledIdx === activeIndex;
              const isSelected = option.value === selectedValue;
              return (
                <li
                  key={`${option.value}-${index}`}
                  id={
                    id && enabledIdx >= 0 ?
                      `${id}-opt-${enabledIdx}`
                    : undefined
                  }
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={option.disabled || undefined}
                  className={cn(
                    "flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-care-ink transition-[background,color] duration-[120ms] hover:bg-[color-mix(in_oklab,var(--color-care-purple)_10%,#fff)]",
                    isCompact && "px-2.5 py-2 text-[13px]",
                    isActive &&
                      "bg-[color-mix(in_oklab,var(--color-care-purple)_10%,#fff)] text-care-ink",
                    isSelected &&
                      "bg-[color-mix(in_oklab,var(--color-care-purple)_14%,#fff)] font-bold text-care-purple hover:bg-[color-mix(in_oklab,var(--color-care-purple)_14%,#fff)]",
                    option.disabled &&
                      "pointer-events-none cursor-not-allowed opacity-[0.45]",
                  )}
                  onMouseEnter={() => {
                    if (!option.disabled && enabledIdx >= 0)
                      setActiveIndex(enabledIdx);
                  }}
                  onClick={() => choose(option)}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  {isSelected ?
                    <span
                      className={cn(
                        "shrink-0 text-[15px] font-extrabold text-care-purple",
                        isCompact && "text-[13px]",
                      )}
                      aria-hidden="true"
                    >
                      ✓
                    </span>
                  : null}
                </li>
              );
            })}
          </ul>
        : null}
      </div>
    );
  },
);
