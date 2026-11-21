import type { LeadDetail } from "@/services/lead";

import { leadDocumentUrl } from "@/config/api";

/** Documents already uploaded for a case; each opens in a new tab. */
export function ExistingDocuments({
  claimNo,
  documents,
  heading,
}: {
  claimNo: string;
  documents: LeadDetail["documents"];
  heading?: string;
}) {
  if (documents.length === 0) return null;
  return (
    <div className="mt-2.5 text-[13.5px]">
      {heading ?
        <b className="mb-1 block text-xs text-care-sub">{heading}</b>
      : null}
      <ul className="m-0 grid list-none gap-1.5 p-0">
        {documents.map((doc) => (
          <li key={doc.fileName} className="flex flex-wrap gap-x-3.5 gap-y-0.5">
            <span>{doc.docNm}</span>
            <a
              href={leadDocumentUrl(claimNo, doc.fileName)}
              className="font-semibold [overflow-wrap:anywhere] text-care-purple hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {doc.fileName}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
