"use client";

import { useEffect, useId, useRef, useState } from "react";

import { Check, Search, X } from "lucide-react";

import type { MasterOption } from "@/services/lead";

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
}: CareaiCodeSearchProps) {
  const [code, setCode] = useState("");
  const [desc, setDesc] = useState("");
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
      setCode("");
      setDesc("");
      setResults(null);
      setOpen(false);
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

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
      <div className="lm-field careai-code-field" ref={rootRef}>
        <label htmlFor={codeId}>{codeLabel}</label>
        <div className="careai-code-input">
          <input
            id={codeId}
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
            className="careai-code-open"
            aria-label={`Search ${codeLabel}`}
            onClick={openSearch}
          >
            <Search aria-hidden />
          </button>
        </div>
      </div>
      <div className="lm-field careai-code-field">
        <label htmlFor={descId}>{descLabel}</label>
        <input
          id={descId}
          type="text"
          name={descName}
          value={desc}
          placeholder={descPlaceholder}
          readOnly
        />
      </div>
      <dialog
        ref={dialogRef}
        className="careai-dialog careai-code-dialog"
        aria-labelledby={titleId}
        onClose={() => {
          latestSearch.current++;
          setOpen(false);
        }}
      >
        {open ?
          <>
            <div className="careai-code-head">
              <Search aria-hidden />
              <h2 id={titleId}>{codeLabel} Search</h2>
              <button
                type="button"
                aria-label="Close"
                onClick={() => dialogRef.current?.close()}
              >
                <X aria-hidden />
              </button>
            </div>
            <div className="careai-code-bar">
              <input
                type="text"
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
                className="lm-btn lm-btn-primary"
                onClick={() => void search(term)}
              >
                <Search aria-hidden /> Search
              </button>
            </div>
            <div className="careai-code-results" aria-live="polite">
              {loading ?
                <p className="careai-code-note">Searching…</p>
              : results === null ?
                <p className="careai-code-note">
                  Enter a code or related words to see matching options.
                </p>
              : results.length === 0 ?
                <p className="careai-code-note">
                  No matches found. Try other words.
                </p>
              : <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{codeLabel}</th>
                      <th>{descLabel}</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((option, index) => (
                      <tr key={`${option.value}-${index}`}>
                        <td>{index + 1}</td>
                        <td>
                          <strong>{option.value}</strong>
                        </td>
                        <td>{option.label}</td>
                        <td>
                          <button
                            type="button"
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
      </dialog>
    </>
  );
}
