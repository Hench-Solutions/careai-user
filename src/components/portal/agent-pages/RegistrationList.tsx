import Link from "next/link";

import { LEAD_EDITABLE_STATUS_GROUP, LEAD_SEARCH_BY } from "@/config/lead";
import { ROUTES } from "@/config/routes";
import { fetchAgentLeads } from "@/server/leads";

const SEARCH_MAX_LENGTH = 100;

type RegistrationListProps = {
  searchParams: Promise<{ by?: string; q?: string }>;
};

/** The signed-in agent's registrations, with a server-side search (a plain GET form, no client code). */
export async function RegistrationList({
  searchParams,
}: RegistrationListProps) {
  const params = await searchParams;
  const searchBy =
    LEAD_SEARCH_BY.find((option) => option.value === params.by)?.value ??
    LEAD_SEARCH_BY[0].value;
  const searchVal = (params.q ?? "").trim().slice(0, SEARCH_MAX_LENGTH);
  const leads = await fetchAgentLeads(searchBy, searchVal);

  return (
    <>
      <div className="rv-toolbar">
        <form className="mr-search" action={ROUTES.agent.caseRegistration}>
          <select name="by" defaultValue={searchBy} aria-label="Search by">
            {LEAD_SEARCH_BY.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <input
            type="search"
            name="q"
            defaultValue={searchVal}
            maxLength={SEARCH_MAX_LENGTH}
            placeholder="Search registrations"
            aria-label="Search text"
          />
          <button type="submit" className="lm-btn lm-btn-primary">
            Search
          </button>
        </form>
        <Link href={ROUTES.agent.newRegistration} className="rv-newbtn">
          + New Registration
        </Link>
      </div>

      <div className="rv-table-wrap mr-list">
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th className="mr-opt">Treatment ID</th>
              <th className="mr-opt">Category</th>
              <th className="mr-opt">Treatment</th>
              <th className="mr-opt">Registered</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ?
              <tr>
                <td colSpan={7}>
                  <span className="lm-sub">
                    {searchVal ?
                      "No registrations match your search."
                    : "You have not registered any cases yet."}
                  </span>
                </td>
              </tr>
            : leads.map((lead) => {
                const editHref = `${ROUTES.agent.caseRegistration}/${encodeURIComponent(lead.claimNo)}/edit`;
                return (
                  <tr key={lead.claimNo}>
                    <td>
                      <div className="rv-patient">{lead.memberName}</div>
                      <div className="rv-id">{lead.memberId}</div>
                    </td>
                    <td className="mr-opt">{lead.claimNo}</td>
                    <td className="mr-opt">{lead.memberCategory}</td>
                    <td className="mr-opt">{lead.treatmentType}</td>
                    <td className="mr-opt">{lead.crtdDt}</td>
                    <td>
                      <span
                        className={
                          lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP ?
                            "rv-badge pending"
                          : "rv-badge info"
                        }
                      >
                        {lead.statusNm}
                      </span>
                    </td>
                    <td>
                      <div className="mr-actions">
                        {lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP ?
                          <Link href={editHref} className="rv-dl">
                            Edit
                          </Link>
                        : null}
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    </>
  );
}
