"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import type { CareaiSelectOption } from "@/components/careai/select-options";

export type CareaiSelectHandle = {
  readonly value: string;
  setValue: (value: string) => void;
  focus: () => void;
};

export type CareaiSelectProps = {
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
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const selectedValue = isControlled ? valueProp : internalValue;

    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const rootRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
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

    const enabledOptions = options.filter((o) => !o.disabled);
    const displayLabel = findLabel(options, selectedValue, placeholder);
    const isPlaceholder = !selectedValue && Boolean(placeholder);

    const openList = () => {
      if (disabled) return;
      const idx = enabledOptions.findIndex((o) => o.value === selectedValue);
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
      event: React.KeyboardEvent<HTMLButtonElement>,
    ) => {
      if (disabled) return;
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
          event.preventDefault();
          if (!open) openList();
          else if (activeIndex >= 0 && enabledOptions[activeIndex])
            choose(enabledOptions[activeIndex]);
          break;
        case "Home":
          if (open) {
            event.preventDefault();
            setActiveIndex(0);
          }
          break;
        case "End":
          if (open) {
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
        className={["careai-select", className].filter(Boolean).join(" ")}
      >
        {name || required ?
          <input
            type="text"
            className="careai-select-native-sync"
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
          className="careai-select-trigger"
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
            className={
              isPlaceholder ?
                "careai-select-value is-placeholder"
              : "careai-select-value"
            }
          >
            {displayLabel}
          </span>
        </button>
        {open ?
          <ul
            ref={listRef}
            id={listId}
            className="careai-select-menu"
            role="listbox"
            aria-activedescendant={
              activeIndex >= 0 && enabledOptions[activeIndex] && id ?
                `${id}-opt-${activeIndex}`
              : undefined
            }
          >
            {options.map((option, index) => {
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
                  className={[
                    "careai-select-option",
                    isSelected ? "is-selected" : "",
                    isActive ? "is-active" : "",
                    option.disabled ? "is-disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onMouseEnter={() => {
                    if (!option.disabled && enabledIdx >= 0)
                      setActiveIndex(enabledIdx);
                  }}
                  onClick={() => choose(option)}
                >
                  {option.label}
                </li>
              );
            })}
          </ul>
        : null}
      </div>
    );
  },
);
