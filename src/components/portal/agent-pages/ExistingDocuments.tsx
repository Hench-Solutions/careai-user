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
    <div className="mr-existing">
      {heading ?
        <b>{heading}</b>
      : null}
      <ul>
        {documents.map((doc) => (
          <li key={doc.fileName}>
            <span>{doc.docNm}</span>
            <a
              href={leadDocumentUrl(claimNo, doc.fileName)}
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
