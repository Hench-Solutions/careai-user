"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { portalButtonClass } from "@/components/ui/button";
import { FileInput } from "@/components/ui/file-input";
import { Panel } from "@/components/ui/panel";
import { LEAD_UPLOAD_EXTENSIONS } from "@/config/lead";
import { ID_FILE, MEDICAL_FILES, validateUploads } from "@/lib/lead/validate";
import { cn } from "@/lib/utils";
import { uploadLeadDocuments } from "@/services/lead";

const ACCEPT = LEAD_UPLOAD_EXTENSIONS.join(",");
const DROP_ZONE =
  "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[14px] border-[1.5px] border-dashed border-[#d9d3ec] bg-[#fbfafd] px-[26px] py-6 text-center text-sm font-bold text-care-ink [&>:not(input)]:pointer-events-none";

type Result = { uploaded: string[]; errors: string[] };

/** The two file pickers of a case and the upload button; the files go to the API as one request. */
export function CaseDocumentsForm({
  claimNo,
  memberId,
}: {
  claimNo: string;
  memberId: string;
}) {
  const router = useRouter();
  const idRef = useRef<HTMLInputElement>(null);
  const medicalRef = useRef<HTMLInputElement>(null);
  const [idName, setIdName] = useState("");
  const [medicalNames, setMedicalNames] = useState("");
  const [problems, setProblems] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const idFile = () => idRef.current?.files?.[0] ?? null;
  const medicalFiles = () => Array.from(medicalRef.current?.files ?? []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const id = idFile();
    const medical = medicalFiles();
    if (!id && medical.length === 0) {
      setProblems(["Choose at least one file to upload."]);
      return;
    }
    const issues = [
      ...validateUploads(id ? [id] : [], 1, ID_FILE),
      ...validateUploads(medical, 2, MEDICAL_FILES),
    ];
    if (issues.length > 0) {
      setProblems(issues.map((issue) => issue.message));
      return;
    }
    setProblems([]);
    setResult(null);
    setUploading(true);
    const upload = await uploadLeadDocuments({
      claimNo,
      memberId,
      idDocument: id,
      medicalReports: medical,
    });
    setResult(upload);
    setUploading(false);
    // Nothing went through: keep the chosen files so they can be sent again.
    if (upload.uploaded.length === 0) return;
    form.reset();
    router.refresh();
    setIdName("");
    setMedicalNames("");
  };

  return (
    <Panel className="mt-4 max-w-[640px]">
      <form onSubmit={submit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold text-[#3f3b52]">
            ID document
          </span>
          <label className={DROP_ZONE}>
            <FileInput
              ref={idRef}
              accept={ACCEPT}
              onChange={(event) =>
                setIdName(event.target.files?.[0]?.name ?? "")
              }
            />
            {idName || "Choose a file"}
          </label>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-bold text-[#3f3b52]">
            Medical reports
          </span>
          <label className={DROP_ZONE}>
            <FileInput
              ref={medicalRef}
              accept={ACCEPT}
              multiple
              onChange={(event) =>
                setMedicalNames(
                  Array.from(event.target.files ?? [])
                    .map((file) => file.name)
                    .join(", "),
                )
              }
            />
            {medicalNames || "Choose one or more files"}
          </label>
        </div>

        {problems.length > 0 ?
          <ul className="list-disc pl-5 text-[13px] text-care-red">
            {problems.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        : null}
        {result ?
          <div
            role="status"
            className={cn(
              "rounded-xl px-4 py-3 text-[13.5px] font-semibold",
              result.errors.length > 0 ?
                "bg-[#fef2f2] text-care-red"
              : "bg-[#e4f8ee] text-care-green",
            )}
          >
            {result.uploaded.length > 0 ?
              <p>Uploaded: {result.uploaded.join(", ")}</p>
            : null}
            {result.errors.map((message) => (
              <p key={message}>{message}</p>
            ))}
          </div>
        : null}

        <div>
          <button
            type="submit"
            disabled={uploading}
            className={portalButtonClass("primary")}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </form>
    </Panel>
  );
}
