"use client";

import { useEffect, useRef, useState } from "react";

import type { MasterOption } from "@/services/lead";

import { searchCodes } from "@/services/lead";

const SEARCH_DELAY_MS = 250;

type Field = "code" | "desc";

type CareaiCodeSearchProps = {
  /** ICD or CPT: the kind of code to look up. */
  type: string;
  codeName: string;
  codeLabel: string;
  codePlaceholder: string;
  descName: string;
  descLabel: string;
  descPlaceholder: string;
};

/** A code and its description as two inputs; typing in either lists matching codes to pick from. */
export function CareaiCodeSearch({
  type,
  codeName,
  codeLabel,
  codePlaceholder,
  descName,
  descLabel,
  descPlaceholder,
}: CareaiCodeSearchProps) {
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<MasterOption[]>([]);
  const [open, setOpen] = useState<Field | null>(null);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!term) return;
    let stale = false;
    const timer = setTimeout(async () => {
      const rows = await searchCodes(type, term);
      if (stale) return;
      setResults(rows);
      setActive(0);
    }, SEARCH_DELAY_MS);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [term, type]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => {
      setCode("");
      setDesc("");
      setTerm("");
      setResults([]);
      setOpen(null);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  const onType = (field: Field, value: string) => {
    if (field === "code") setCode(value);
    else setDesc(value);
    const text = value.trim();
    setTerm(text);
    if (!text) setResults([]);
    setOpen(field);
  };

  const pick = (option: MasterOption | undefined) => {
    if (!option) return;
    setCode(option.value);
    setDesc(option.label);
    setTerm("");
    setResults([]);
    setOpen(null);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const step = event.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + results.length) % results.length);
    } else if (event.key === "Enter" && open) {
      event.preventDefault();
      pick(results[active]);
    } else if (event.key === "Escape") {
      setOpen(null);
    }
  };

  const suggestions = (field: Field) =>
    open === field && results.length > 0 ?
      <ul className="careai-code-menu" role="listbox">
        {results.map((option, index) => (
          <li
            key={option.value}
            role="option"
            aria-selected={index === active}
            className={index === active ? "is-active" : undefined}
            onMouseDown={(event) => {
              event.preventDefault();
              pick(option);
            }}
          >
            <strong>{option.value}</strong> {option.label}
          </li>
        ))}
      </ul>
    : null;

  const input = (
    field: Field,
    name: string,
    placeholder: string,
    value: string,
  ) => (
    <input
      type="text"
      name={name}
      value={value}
      placeholder={placeholder}
      autoComplete="off"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open === field && results.length > 0}
      onChange={(event) => onType(field, event.target.value)}
      onKeyDown={onKeyDown}
      onBlur={() => setOpen(null)}
    />
  );

  return (
    <>
      <div className="lm-field careai-code-field" ref={rootRef}>
        <label>{codeLabel}</label>
        {input("code", codeName, codePlaceholder, code)}
        {suggestions("code")}
      </div>
      <div className="lm-field careai-code-field">
        <label>{descLabel}</label>
        {input("desc", descName, descPlaceholder, desc)}
        {suggestions("desc")}
      </div>
    </>
  );
}
