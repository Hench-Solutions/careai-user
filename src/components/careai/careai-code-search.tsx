"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Check, Search, X } from "lucide-react";

import type { MasterOption } from "@/services/lead";

import { portalButtonClass } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FieldLabel, Input } from "@/components/ui/field";
import { searchCodes } from "@/services/lead";

type CareaiCodeSearchProps = {
  /** ICD or CPT: the kind of code to look up. */
  type: string;
  codeName: string;
  codeLabel: string;
  codePlaceholder: string;
  descName: string;
  descLabel: string;
  descPlaceholder: string;
  /** Code and description already stored for the case being edited. */
  defaultCode?: string;
  defaultDesc?: string;
};

/** A code box with a search popup: type related words, read the matches, pick one to fill code and description. */
export function CareaiCodeSearch({
  type,
  codeName,
  codeLabel,
  codePlaceholder,
  descName,
  descLabel,
  descPlaceholder,
  defaultCode = "",
  defaultDesc = "",
}: CareaiCodeSearchProps) {
  const [code, setCode] = useState(defaultCode);
  const [desc, setDesc] = useState(defaultDesc);
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState<MasterOption[] | null>(null);
  const [loading, setLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const latestSearch = useRef(0);
  const codeId = useId();
  const descId = useId();
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  useEffect(() => {
    const form = rootRef.current?.closest("form");
    if (!form) return;
    const onReset = () => {
      setCode(defaultCode);
      setDesc(defaultDesc);
      setResults(null);
      setOpen(false);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultCode, defaultDesc]);

  const search = async (text: string) => {
    const query = text.trim();
    if (!query) return;
    const request = ++latestSearch.current;
    setLoading(true);
    const rows = await searchCodes(type, query);
    if (request !== latestSearch.current) return;
    const seen = new Set<string>();
    setResults(
      rows.filter((row) => {
        const key = `${row.value}|${row.label}`;
        return seen.has(key) ? false : (seen.add(key), true);
      }),
    );
    setLoading(false);
  };

  const openSearch = () => {
    setTerm(code);
    setResults(null);
    setLoading(false);
    setOpen(true);
    void search(code);
  };

  const pick = (option: MasterOption) => {
    setCode(option.value);
    setDesc(option.label);
    dialogRef.current?.close();
  };

  return (
    <>
      <Field ref={rootRef}>
        <FieldLabel htmlFor={codeId}>{codeLabel}</FieldLabel>
        <div className="flex gap-2">
          <Input
            id={codeId}
            className="min-w-0 flex-1"
            type="text"
            name={codeName}
            value={code}
            placeholder={codePlaceholder}
            autoComplete="off"
            onChange={(event) => {
              setCode(event.target.value);
              setDesc("");
            }}
          />
          <button
            type="button"
            className="grid w-[46px] flex-none cursor-pointer place-items-center rounded-[11px] border-none bg-care-grad text-white shadow-[0_6px_14px_rgba(214,35,140,0.25)] [&_svg]:size-[18px]"
            aria-label={`Search ${codeLabel}`}
            onClick={openSearch}
          >
            <Search aria-hidden />
          </button>
        </div>
      </Field>
      <Field>
        <FieldLabel htmlFor={descId}>{descLabel}</FieldLabel>
        <Input
          id={descId}
          className="cursor-default bg-[#f0eef6]"
          type="text"
          name={descName}
          value={desc}
          placeholder={descPlaceholder}
          readOnly
        />
      </Field>
      <DialogShell
        ref={dialogRef}
        className="open:flex open:max-h-[min(86vh,720px)] open:flex-col"
        aria-labelledby={titleId}
        onClose={() => {
          latestSearch.current++;
          setOpen(false);
        }}
      >
        {open ?
          <>
            <div className="flex items-center gap-2.5 bg-care-grad px-5 py-4 text-white [&_svg]:size-[18px]">
              <Search aria-hidden />
              <h2 id={titleId} className="m-0 flex-1 text-base font-bold">
                {codeLabel} Search
              </h2>
              <button
                type="button"
                className="grid cursor-pointer place-items-center border-none bg-transparent text-white"
                aria-label="Close"
                onClick={() => dialogRef.current?.close()}
              >
                <X aria-hidden />
              </button>
            </div>
            <div className="flex gap-2.5 px-5 py-4 max-[520px]:px-3 max-[520px]:py-3.5">
              <input
                type="text"
                className="min-w-0 flex-1 rounded-[11px] border-[1.5px] border-care-line px-3.5 py-3 text-sm text-care-ink outline-none focus:border-care-purple"
                value={term}
                placeholder="Type a code or a few words, then press Search"
                aria-label={`Search ${codeLabel}`}
                autoComplete="off"
                autoFocus
                onChange={(event) => setTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  void search(term);
                }}
              />
              <button
                type="button"
                className={portalButtonClass("primary")}
                onClick={() => void search(term)}
              >
                <Search aria-hidden /> Search
              </button>
            </div>
            <div
              className="min-h-[120px] flex-1 overflow-auto px-5 pb-5 max-[520px]:px-3 max-[520px]:pb-3.5"
              aria-live="polite"
            >
              {loading ?
                <p className="py-7 text-center text-sm text-care-sub">
                  Searching…
                </p>
              : results === null ?
                <EmptyState
                  icon={Search}
                  title="Search for a code"
                  description="Enter a code or related words to see matching options."
                />
              : results.length === 0 ?
                <EmptyState
                  icon={Search}
                  title="No matches found"
                  description="Try other words."
                />
              : <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="sticky top-0 border-b border-care-line bg-[color-mix(in_oklab,var(--color-care-purple)_60%,var(--color-care-pink))] p-3 text-left text-[13px] tracking-[0.04em] whitespace-nowrap text-white uppercase first:rounded-tl-lg last:rounded-tr-lg last:text-center max-[520px]:px-2 max-[520px]:py-2.5 max-[520px]:first:hidden">
                        #
                      </th>
                      <th className="sticky top-0 border-b border-care-line bg-[color-mix(in_oklab,var(--color-care-purple)_60%,var(--color-care-pink))] p-3 text-left text-[13px] tracking-[0.04em] whitespace-nowrap text-white uppercase first:rounded-tl-lg last:rounded-tr-lg last:text-center max-[520px]:px-2 max-[520px]:py-2.5 max-[520px]:first:hidden">
                        {codeLabel}
                      </th>
                      <th className="sticky top-0 border-b border-care-line bg-[color-mix(in_oklab,var(--color-care-purple)_60%,var(--color-care-pink))] p-3 text-left text-[13px] tracking-[0.04em] whitespace-nowrap text-white uppercase first:rounded-tl-lg last:rounded-tr-lg last:text-center max-[520px]:px-2 max-[520px]:py-2.5 max-[520px]:first:hidden">
                        {descLabel}
                      </th>
                      <th className="sticky top-0 border-b border-care-line bg-[color-mix(in_oklab,var(--color-care-purple)_60%,var(--color-care-pink))] p-3 text-left text-[13px] tracking-[0.04em] whitespace-nowrap text-white uppercase first:rounded-tl-lg last:rounded-tr-lg last:text-center max-[520px]:px-2 max-[520px]:py-2.5 max-[520px]:first:hidden">
                        Select
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((option, index) => (
                      <tr
                        key={`${option.value}-${index}`}
                        className="hover:bg-[color-mix(in_oklab,var(--color-care-purple)_7%,#fff)]"
                      >
                        <td className="border-b border-care-line px-3 py-[11px] align-middle last:text-center max-[520px]:p-2.5 max-[520px]:first:hidden">
                          {index + 1}
                        </td>
                        <td className="border-b border-care-line px-3 py-[11px] align-middle last:text-center max-[520px]:p-2.5 max-[520px]:first:hidden">
                          <strong>{option.value}</strong>
                        </td>
                        <td className="border-b border-care-line px-3 py-[11px] align-middle last:text-center max-[520px]:p-2.5 max-[520px]:first:hidden max-[520px]:nth-3:[overflow-wrap:anywhere]">
                          {option.label}
                        </td>
                        <td className="border-b border-care-line px-3 py-[11px] align-middle last:text-center max-[520px]:p-2.5 max-[520px]:first:hidden">
                          <button
                            type="button"
                            className="inline-grid size-[34px] cursor-pointer place-items-center rounded-lg border-none bg-care-grad text-white [&_svg]:size-4"
                            aria-label={`Select ${option.value}`}
                            onClick={() => pick(option)}
                          >
                            <Check aria-hidden />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            </div>
          </>
        : null}
      </DialogShell>
    </>
  );
}
