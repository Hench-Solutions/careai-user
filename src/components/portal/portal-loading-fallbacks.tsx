import { Skeleton } from "@/components/careai/careai-skeleton";
import {
  ListSearchRow,
  ListToolbar,
  TableCard,
} from "@/components/portal/list-layout";
import { PortalContent } from "@/components/portal/portal-content";
import {
  WizardFieldGrid,
  WizardFormCard,
  WizardHeader,
  WizardStepRow,
  WizardStepsCard,
} from "@/components/portal/wizard-frame";
import { Field } from "@/components/ui/field";

/** Toolbar + table placeholder for the registration list route. */
export function RegistrationListSkeleton() {
  return (
    <>
      <ListToolbar>
        <RegistrationSearchSkeleton />
        <Skeleton className="h-10 w-40 rounded-xl" label="Loading action" />
      </ListToolbar>
      <RegistrationTableSkeleton />
    </>
  );
}

function RegistrationSearchSkeleton() {
  return (
    <ListSearchRow aria-hidden>
      <Skeleton className="h-10 w-36 rounded-xl" />
      <Skeleton className="h-10 min-w-48 flex-1 rounded-xl" />
      <Skeleton className="h-10 w-24 rounded-xl" />
    </ListSearchRow>
  );
}

function RegistrationTableSkeleton() {
  return (
    <TableCard>
      <table>
        <thead>
          <tr>
            {Array.from({ length: 7 }, (_, i) => (
              <th key={i}>
                <Skeleton className="mx-auto h-3 w-16 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }, (_, row) => (
            <tr key={row}>
              <td>
                <Skeleton className="mb-1 h-4 w-32 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
              </td>
              {Array.from({ length: 5 }, (_, col) => (
                <td key={col}>
                  <Skeleton className="h-3 w-20 rounded" />
                </td>
              ))}
              <td>
                <Skeleton className="h-6 w-14 rounded-full" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableCard>
  );
}

/** Wizard steps + form fields placeholder for new/edit registration. */
export function RegistrationWizardSkeleton() {
  return (
    <div className="w-full max-w-[760px]">
      <div className="w-full">
        <WizardHeader>
          <Skeleton className="mb-4 h-5 w-44 rounded" />
          <Skeleton className="mb-2 h-8 w-64 max-w-full rounded-lg" />
          <Skeleton className="h-4 w-80 max-w-full rounded" />
        </WizardHeader>
        <WizardStepsCard>
          <WizardStepsSkeleton />
        </WizardStepsCard>
        <WizardFormSkeleton rows={4} />
      </div>
    </div>
  );
}

function WizardStepsSkeleton() {
  return (
    <WizardStepRow aria-hidden>
      {Array.from({ length: 3 }, (_, i) => (
        <div
          key={i}
          className={"relative flex min-w-0 flex-1 flex-col items-center gap-2"}
        >
          <Skeleton className="size-9 rounded-full" />
          <Skeleton className="mt-2 h-3 w-20 rounded" />
        </div>
      ))}
    </WizardStepRow>
  );
}

function WizardFormSkeleton({ rows }: { rows: number }) {
  return (
    <WizardFormCard>
      <WizardFieldGrid>
        {Array.from({ length: rows * 2 }, (_, i) => (
          <Field key={i}>
            <Skeleton className="mb-2 h-3 w-28 rounded" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </Field>
        ))}
      </WizardFieldGrid>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-11 w-28 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
      </div>
    </WizardFormCard>
  );
}

/** Generic dashboard / mock page placeholder inside the portal main area. */
export function PortalPageSkeleton() {
  return (
    <PortalContent>
      <Skeleton className="mb-3 h-9 w-56 max-w-full rounded-lg" />
      <Skeleton className="mb-6 h-4 w-96 max-w-full rounded" />
      <PortalCardsSkeleton />
    </PortalContent>
  );
}

function PortalCardsSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div
          key={i}
          className="rounded-xl border border-care-line bg-white p-5 shadow-sm"
        >
          <Skeleton className="mb-3 h-5 w-32 rounded" />
          <Skeleton className="mb-2 h-3 w-full rounded" />
          <Skeleton className="h-3 w-40 rounded" />
        </div>
      ))}
    </div>
  );
}

/** Filter chips and a few case cards while the agent's cases load. */
export function CaseStatusSkeleton() {
  return (
    <>
      <div className="mb-[22px] flex flex-wrap gap-2" aria-hidden>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-[20px]" />
        ))}
      </div>
      <div className="flex flex-col gap-4" aria-hidden>
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-[18px]" />
        ))}
      </div>
    </>
  );
}
