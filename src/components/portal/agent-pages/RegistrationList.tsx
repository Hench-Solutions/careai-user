import Link from "next/link";

import { FolderOpen, Search } from "lucide-react";

import { CareaiSelect } from "@/components/careai/careai-select";
import { ListToolbar, TableCard } from "@/components/portal/list-layout";
import {
  portalButtonClass,
  portalToolbarNewLink,
} from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { LEAD_EDITABLE_STATUS_GROUP, LEAD_SEARCH_BY } from "@/config/lead";
import { ROUTES } from "@/config/routes";
import { caseEditHref } from "@/lib/lead/links";
import { cn } from "@/lib/utils";
import { fetchAgentLeads } from "@/server/leads";

const portalRegistrationList = {
  badge: {
    base: "inline-flex items-center gap-1.5 rounded-[20px] px-3 py-[5px] text-xs font-bold",
    pending: "bg-[#fef3e0] text-[#b8720a]",
    info: "bg-[color-mix(in_oklab,var(--color-care-purple)_12%,#fff)] text-care-purple",
  },
} as const;

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
      <ListToolbar>
        <form
          className="flex min-w-0 flex-1 flex-nowrap items-stretch gap-2 max-[640px]:w-full max-[640px]:flex-wrap"
          action={ROUTES.agent.caseRegistration}
        >
          <CareaiSelect
            appearance="toolbar"
            name="by"
            defaultValue={searchBy}
            options={LEAD_SEARCH_BY}
            aria-label="Search by"
          />
          <input
            type="search"
            name="q"
            className="min-h-[46px] w-auto min-w-0 flex-[1_1_auto] rounded-xl border-[1.5px] border-care-line bg-white px-3.5 py-[11px] text-sm font-medium text-care-ink transition-[border-color,box-shadow] duration-150 outline-none focus:border-care-purple focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-care-purple)_16%,transparent)] max-[640px]:min-w-0 max-[640px]:flex-[1_1_auto]"
            defaultValue={searchVal}
            maxLength={SEARCH_MAX_LENGTH}
            placeholder="Search registrations"
            aria-label="Search text"
          />
          <button
            type="submit"
            className={cn(
              portalButtonClass("primary"),
              "min-h-[46px] self-stretch rounded-xl py-[11px]",
            )}
          >
            Search
          </button>
          {searchVal ?
            <Link
              href={ROUTES.agent.caseRegistration}
              className={cn(portalButtonClass("ghost"), "self-center")}
            >
              Clear
            </Link>
          : null}
        </form>
        <Link
          href={ROUTES.agent.newRegistration}
          className={portalToolbarNewLink}
        >
          + New Registration
        </Link>
      </ListToolbar>

      {leads.length === 0 ?
        <EmptyState
          variant="card"
          icon={searchVal ? Search : FolderOpen}
          title={
            searchVal ?
              "No registrations match your search"
            : "No registrations yet"
          }
          description={
            searchVal ?
              "Check the spelling or try a different search type."
            : "Register your first case and it will be listed here."
          }
          action={
            searchVal ?
              <Link
                href={ROUTES.agent.caseRegistration}
                className={portalButtonClass("ghost")}
              >
                Clear search
              </Link>
            : <Link
                href={ROUTES.agent.newRegistration}
                className={portalButtonClass("primary")}
              >
                + New Registration
              </Link>
          }
        />
      : <TableCard>
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th className="max-[640px]:hidden">Treatment ID</th>
                <th className="max-[640px]:hidden">Category</th>
                <th className="max-[640px]:hidden">Treatment</th>
                <th className="max-[640px]:hidden">Registered</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const editHref = caseEditHref(lead.claimNo);
                return (
                  <tr key={lead.claimNo}>
                    <td>
                      <div className="font-bold">
                        {lead.memberName?.trim() || "—"}
                      </div>
                      <div className="text-xs text-care-sub">
                        {lead.memberId?.trim() || "—"}
                      </div>
                    </td>
                    <td className="max-[640px]:hidden">{lead.claimNo}</td>
                    <td className="max-[640px]:hidden">
                      {lead.memberCategory?.trim() || "—"}
                    </td>
                    <td className="max-[640px]:hidden">
                      {lead.treatmentType?.trim() || "—"}
                    </td>
                    <td className="max-[640px]:hidden">
                      {lead.crtdDt?.trim() || "—"}
                    </td>
                    <td>
                      <span
                        className={cn(
                          portalRegistrationList.badge.base,
                          lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP ?
                            portalRegistrationList.badge.pending
                          : portalRegistrationList.badge.info,
                        )}
                      >
                        {lead.statusNm}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-4">
                        {lead.statusGrp === LEAD_EDITABLE_STATUS_GROUP ?
                          <Link
                            href={editHref}
                            className="inline-flex cursor-pointer items-center gap-1.5 border-none bg-transparent p-0 font-[inherit] text-sm font-normal text-care-purple"
                          >
                            Edit
                          </Link>
                        : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </TableCard>
      }
    </>
  );
}
