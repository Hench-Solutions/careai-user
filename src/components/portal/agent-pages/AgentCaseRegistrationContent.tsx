"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import type { CareaiDateFieldHandle } from "@/components/careai/careai-date-field";
import type { LeadIssue } from "@/lib/lead/validate";
import type {
  LeadDetail,
  LeadRegistrationPayload,
  MasterOption,
} from "@/services/lead";

import { useUser } from "@/components/auth/user-provider";
import { CareaiCodeSearch } from "@/components/careai/careai-code-search";
import { CareaiDateField } from "@/components/careai/careai-date-field";
import { CareaiSelect } from "@/components/careai/careai-select";
import { CareaiValidationDialog } from "@/components/careai/careai-validation-dialog";
import { ExistingDocuments } from "@/components/portal/agent-pages/ExistingDocuments";
import { PageBackLink } from "@/components/portal/page-back-link";
import {
  WizardFieldGrid,
  WizardForm,
  WizardHeader,
  WizardStepRow,
  WizardStepsCard,
} from "@/components/portal/wizard-frame";
import { portalButtonClass } from "@/components/ui/button";
import {
  DialogActions,
  DialogButton,
  DialogHeader,
  DialogShell,
} from "@/components/ui/dialog";
import { Field, FieldLabel, Input, Textarea } from "@/components/ui/field";
import { FileInput } from "@/components/ui/file-input";
import {
  MASTER_CODE_TYPES,
  MASTER_DROPDOWN_MODES,
  MASTER_ITEM_TYPES,
  MASTER_LEAD_DOCUMENTS_FILTER,
} from "@/config/api";
import {
  BLANK_OPTION,
  DEFAULT_CALLING_CD,
  LEAD_DOCUMENT_CODES,
  LEAD_FIELDS,
  LEAD_MESSAGES,
  LEAD_PHONE_MAX_DIGITS,
  LEAD_SOURCE_AGENT_LABEL,
  LEAD_TYPES,
} from "@/config/lead";
import { ROUTES } from "@/config/routes";
import { ApiError } from "@/lib/api/client";
import {
  ID_FILE,
  MEDICAL_FILES,
  normalizeCallingCode,
  validateLead,
  validateUploads,
} from "@/lib/lead/validate";
import { cn } from "@/lib/utils";
import {
  fetchMasterDropdown,
  fetchMasterItems,
  registerLead,
  updateLead,
  uploadLeadDocuments,
} from "@/services/lead";

function wizardStepLabelClass(current: number, step: number) {
  const { done, isCurrent } = wizardStepState(current, step);
  return cn(
    portalWizard.step.label,
    (done || isCurrent) && portalWizard.step.labelActive,
  );
}

function wizardStepCircleClass(current: number, step: number) {
  const { done, isCurrent } = wizardStepState(current, step);
  return cn(
    portalWizard.step.circle,
    done && portalWizard.step.circleDone,
    isCurrent && portalWizard.step.circleCurrent,
  );
}

function wizardStepLineClass(current: number, step: number) {
  const { done } = wizardStepState(current, step);
  return cn(portalWizard.step.line, done && portalWizard.step.lineDone);
}

function wizardStepState(current: number, step: number) {
  return {
    done: step < current,
    isCurrent: step === current,
  };
}

const portalWizard = {
  step: {
    root: "relative flex min-w-0 flex-1 flex-col items-center gap-2",
    line: "absolute top-[19px] left-1/2 z-[1] h-0.5 w-full bg-[#eeebf6]",
    lineDone: "bg-care-grad",
    circle:
      "z-[2] flex size-[38px] items-center justify-center rounded-full border-2 border-[#eeebf6] bg-[#eeebf6] text-sm font-extrabold text-care-nav-muted",
    circleDone: "border-transparent bg-care-grad text-white",
    circleCurrent: "border-care-purple bg-white text-care-purple",
    label: "text-center text-[12.5px] font-bold text-care-nav-muted",
    labelActive: "text-care-ink",
  },
} as const;

const portalButtonSpinner = cn(
  "mr-1.5 inline-block size-[0.9em] animate-spin rounded-full border-2 align-[-0.15em]",
  "border-[color-mix(in_oklab,currentColor_25%,transparent)] border-t-current",
  "motion-reduce:animate-none motion-reduce:border-t-[color-mix(in_oklab,currentColor_25%,transparent)]",
);

type WizardStep = 1 | 2 | 3;

function formValue(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name);
  if (!el) return "";
  if (el instanceof RadioNodeList) {
    return String(el.value ?? "").trim();
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.value.trim();
  }
  return "";
}

function withBlank(options: MasterOption[]): MasterOption[] {
  if (options.some((o) => o.value === "")) return options;
  return [BLANK_OPTION, ...options];
}

/** Keeps the value stored on a case in its list, even if the list no longer offers it. */
function withCurrent(
  options: MasterOption[],
  value?: string,
  label?: string,
): MasterOption[] {
  if (!value || options.some((o) => o.value === value)) return options;
  return [...options, { value, label: label || value }];
}

/** The stored value of a dependent field, only while its parent is still the stored one. */
function whenSame(
  current: string,
  original: string | undefined,
  value: string | undefined,
): string {
  return original !== undefined && current === original ? (value ?? "") : "";
}

/** A list that shows the stored choice by name until the full list has loaded. */
function seed(value?: string, label?: string): MasterOption[] {
  return withBlank(withCurrent([], value, label));
}

/** Agent case registration wizard (BFF → PortalLead/register); with `lead` it edits that case (PortalLead/update). */
export function AgentCaseRegistrationContent({ lead }: { lead?: LeadDetail }) {
  const user = useUser();
  const router = useRouter();
  const leaveTitleId = useId();
  const [step, setStep] = useState<WizardStep>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [claimNo, setClaimNo] = useState("");
  const [uploadResult, setUploadResult] = useState<{
    uploaded: string[];
    errors: string[];
  } | null>(null);
  const [idFileLabel, setIdFileLabel] = useState("No file chosen");
  const [medFileLabel, setMedFileLabel] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [invalid, setInvalid] = useState<readonly string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDocs, setUploadingDocs] = useState(false);
  const step2MastersLoaded = useRef(false);
  const [treatment, setTreatment] = useState(lead?.treatmentType ?? "");
  const [provider, setProvider] = useState(lead?.providerCd ?? "");
  const [paymentMode, setPaymentMode] = useState(lead?.paymentMode ?? "");
  const [agentSource, setAgentSource] = useState("");
  const [docTypeOptions, setDocTypeOptions] = useState(() =>
    seed(lead?.documentType, lead?.documentTypeNm),
  );
  const [nationalityOptions, setNationalityOptions] = useState(() =>
    seed(lead?.nationality, lead?.nationalityNm),
  );
  const [locationOptions, setLocationOptions] = useState(() =>
    seed(lead?.patientLocation, lead?.patientLocationNm),
  );
  const [genderOptions, setGenderOptions] = useState(() =>
    seed(lead?.gender, lead?.gender),
  );
  const [treatmentOptions, setTreatmentOptions] = useState(() =>
    seed(lead?.treatmentType, lead?.treatmentTypeNm),
  );
  const [providerOptions, setProviderOptions] = useState(() =>
    seed(lead?.providerCd, lead?.providerNm),
  );
  const [paymentOptions, setPaymentOptions] = useState(() =>
    seed(lead?.paymentMode, lead?.paymentModeNm),
  );
  const [departmentOptions, setDepartmentOptions] = useState(() =>
    seed(lead?.department, lead?.departmentNm),
  );
  const [branchOptions, setBranchOptions] = useState(() =>
    seed(lead?.branchCd, lead?.branchNm),
  );
  const [doctorOptions, setDoctorOptions] = useState(() =>
    seed(lead?.doctorCd, lead?.doctorNm),
  );
  const [guarantorOptions, setGuarantorOptions] = useState(() =>
    seed(lead?.guarantor, lead?.guarantorNm),
  );

  const formRef = useRef<HTMLFormElement>(null);
  const dobRef = useRef<CareaiDateFieldHandle>(null);
  const idFileRef = useRef<HTMLInputElement>(null);
  const medFileRef = useRef<HTMLInputElement>(null);
  const leaveDialogRef = useRef<HTMLDialogElement>(null);

  const markDirty = useCallback(() => setDirty(true), []);

  const leaveToRegistrations = useCallback(() => {
    setShowLeaveConfirm(false);
    router.push(ROUTES.agent.caseRegistration);
  }, [router]);

  const tryLeaveToRegistrations = useCallback(() => {
    if (dirty && !showSuccess) {
      setShowLeaveConfirm(true);
      return;
    }
    leaveToRegistrations();
  }, [dirty, leaveToRegistrations, showSuccess]);

  useEffect(() => {
    const dialog = leaveDialogRef.current;
    if (!dialog) return;
    if (showLeaveConfirm && !dialog.open) dialog.showModal();
    if (!showLeaveConfirm && dialog.open) dialog.close();
  }, [showLeaveConfirm]);

  useEffect(() => {
    if (!invalid.length) return;
    const form = formRef.current;
    if (!form) return;
    const frame = requestAnimationFrame(() => {
      const target = form.querySelector<HTMLElement>(
        "[data-invalid] input:not([type='hidden']):not([type='file']), [data-invalid] textarea, [data-invalid] [data-slot='careai-select-trigger'], [data-invalid] [data-slot='careai-date-trigger'], [data-invalid] [data-slot='upload']",
      );
      target?.focus();
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    return () => cancelAnimationFrame(frame);
  }, [invalid, step]);

  const applyStep2Masters = useCallback(
    (treatments: MasterOption[], payments: MasterOption[]) => {
      setTreatmentOptions(
        withBlank(
          withCurrent(treatments, lead?.treatmentType, lead?.treatmentTypeNm),
        ),
      );
      setPaymentOptions(
        withBlank(
          withCurrent(payments, lead?.paymentMode, lead?.paymentModeNm),
        ),
      );
    },
    [lead],
  );

  const loadStep2Masters = useCallback(async () => {
    if (step2MastersLoaded.current) return;
    step2MastersLoaded.current = true;
    const [treatments, payments] = await Promise.all([
      fetchMasterItems(MASTER_ITEM_TYPES.treatmentType),
      fetchMasterItems(MASTER_ITEM_TYPES.paymentMode),
    ]);
    applyStep2Masters(treatments, payments);
  }, [applyStep2Masters]);

  useEffect(() => {
    step2MastersLoaded.current = false;
  }, [lead]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [sources, nations, locations, providers, genders, docs] =
        await Promise.all([
          fetchMasterDropdown(MASTER_DROPDOWN_MODES.source),
          fetchMasterDropdown(MASTER_DROPDOWN_MODES.nationality),
          fetchMasterDropdown(MASTER_DROPDOWN_MODES.patientLocation),
          fetchMasterDropdown(MASTER_DROPDOWN_MODES.provider),
          fetchMasterItems(MASTER_ITEM_TYPES.gender),
          fetchMasterDropdown(
            MASTER_DROPDOWN_MODES.documentType,
            MASTER_LEAD_DOCUMENTS_FILTER,
          ),
        ]);
      if (cancelled) return;
      setAgentSource(
        sources.find((o) => o.label === LEAD_SOURCE_AGENT_LABEL)?.value ?? "",
      );
      setNationalityOptions(
        withBlank(withCurrent(nations, lead?.nationality, lead?.nationalityNm)),
      );
      setLocationOptions(
        withBlank(
          withCurrent(
            locations,
            lead?.patientLocation,
            lead?.patientLocationNm,
          ),
        ),
      );
      setProviderOptions(
        withBlank(withCurrent(providers, lead?.providerCd, lead?.providerNm)),
      );
      setGenderOptions(
        withBlank(withCurrent(genders, lead?.gender, lead?.gender)),
      );
      setDocTypeOptions(
        withBlank(withCurrent(docs, lead?.documentType, lead?.documentTypeNm)),
      );
      if (lead) void loadStep2Masters();
    })();
    return () => {
      cancelled = true;
    };
  }, [lead, loadStep2Masters]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows =
        treatment ?
          await fetchMasterItems(MASTER_ITEM_TYPES.department, treatment)
        : [];
      if (!cancelled) {
        setDepartmentOptions(
          withBlank(
            treatment === lead?.treatmentType ?
              withCurrent(rows, lead.department, lead.departmentNm)
            : rows,
          ),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [treatment, lead]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [branches, doctors] =
        provider ?
          await Promise.all([
            fetchMasterDropdown(MASTER_DROPDOWN_MODES.branch, provider),
            fetchMasterDropdown(MASTER_DROPDOWN_MODES.doctor, provider),
          ])
        : [[], []];
      if (cancelled) return;
      const stored = provider === lead?.providerCd;
      setBranchOptions(
        withBlank(
          stored ?
            withCurrent(branches, lead.branchCd, lead.branchNm)
          : branches,
        ),
      );
      setDoctorOptions(
        withBlank(
          stored ? withCurrent(doctors, lead.doctorCd, lead.doctorNm) : doctors,
        ),
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [provider, lead]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rows =
        paymentMode ?
          await fetchMasterDropdown(
            MASTER_DROPDOWN_MODES.guarantor,
            paymentMode,
          )
        : [];
      if (!cancelled) {
        setGuarantorOptions(
          withBlank(
            paymentMode === lead?.paymentMode ?
              withCurrent(rows, lead.guarantor, lead.guarantorNm)
            : rows,
          ),
        );
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [paymentMode, lead]);

  const onIdFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    markDirty();
    const file = event.target.files?.[0];
    setIdFileLabel(file?.name ?? "No file chosen");
  };

  const onMedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    markDirty();
    const files = event.target.files;
    if (!files?.length) {
      setMedFileLabel(null);
      return;
    }
    const names = Array.from(files).map((f) => f.name);
    setMedFileLabel(
      names.length === 1 ? (names[0] ?? "") : `${names.length} files selected`,
    );
  };

  const clearInvalid = (field: string) =>
    setInvalid((current) =>
      current.includes(field) ? current.filter((f) => f !== field) : current,
    );

  const isInvalid = (...fields: string[]) =>
    fields.some((f) => invalid.includes(f));

  const goStep = useCallback((n: WizardStep) => {
    setStepError(null);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const readLead = (form: HTMLFormElement) => {
    const payload = Object.fromEntries(
      LEAD_FIELDS.map((field) => [field, formValue(form, field)]),
    ) as LeadRegistrationPayload;
    payload.Dob ||= dobRef.current?.value?.trim() ?? "";
    payload.CallingCd = normalizeCallingCode(payload.CallingCd ?? "");
    payload.LeadType ||= LEAD_TYPES.normal;
    payload.InsurerCd ||= lead?.insurerCd ?? user?.userCd ?? "";
    return payload;
  };

  /** Problems on the given steps, all at once; the wizard jumps to the first one's step. */
  const problems = (form: HTMLFormElement, steps: readonly WizardStep[]) => {
    const files = (input: HTMLInputElement | null) =>
      Array.from(input?.files ?? []);
    const found: LeadIssue[] = [
      ...validateLead(readLead(form)),
      ...validateUploads(files(idFileRef.current), 1, ID_FILE),
      ...validateUploads(files(medFileRef.current), 2, MEDICAL_FILES),
    ].filter((issue) => steps.includes(issue.step));
    return found;
  };

  const review = (found: LeadIssue[]) => {
    setIssues([...new Set(found.map((issue) => issue.message))]);
    setInvalid(found.map((issue) => issue.field));
    const first = found[0];
    if (first) goStep(first.step);
  };

  const advance = (from: 1 | 2) => {
    const form = formRef.current;
    if (!form) return;
    const found = problems(form, [from]);
    if (found.length > 0) return review(found);
    if (from === 1) void loadStep2Masters();
    goStep((from + 1) as WizardStep);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form || submitting) return;

    const found = problems(form, [1, 2, 3]);
    if (found.length > 0) return review(found);

    setSubmitting(true);
    setStepError(null);
    try {
      const result =
        lead ?
          await updateLead(lead.claimNo, readLead(form))
        : await registerLead(readLead(form));

      const mem = result.member_Id || "";
      const tid = result.claim_No || "";
      setMemberId(mem);
      setClaimNo(tid);

      const idFile = idFileRef.current?.files?.[0] ?? null;
      const medFiles = medFileRef.current?.files ?? null;
      if (mem && tid && (idFile || (medFiles && medFiles.length > 0))) {
        setUploadingDocs(true);
        try {
          const upload = await uploadLeadDocuments({
            claimNo: tid,
            memberId: mem,
            idDocument: idFile,
            medicalReports: medFiles,
          });
          setUploadResult({
            uploaded: upload.uploaded ?? [],
            errors: upload.errors ?? [],
          });
        } catch (err) {
          setUploadResult({
            uploaded: [],
            errors: [
              err instanceof Error ? err.message : LEAD_MESSAGES.uploadFailed,
            ],
          });
        } finally {
          setUploadingDocs(false);
        }
      }

      setDirty(false);
      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message
        : lead ? LEAD_MESSAGES.updateFailed
        : LEAD_MESSAGES.submitFailed;
      setStepError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetWizard = useCallback(() => {
    setShowSuccess(false);
    setStep(1);
    setMemberId("");
    setClaimNo("");
    setUploadResult(null);
    setIdFileLabel("No file chosen");
    setMedFileLabel(null);
    setStepError(null);
    setInvalid([]);
    setSubmitting(false);
    setUploadingDocs(false);
    setDirty(false);
    setTreatment(lead?.treatmentType ?? "");
    setProvider(lead?.providerCd ?? "");
    setPaymentMode(lead?.paymentMode ?? "");
    formRef.current?.reset();
  }, [lead]);

  // Next keeps a page's state when you navigate away; its effects are cleaned up then, so start over here.
  useEffect(() => resetWizard, [resetWizard]);

  const progress = `${(step / 3) * 100}%`;

  return (
    <div className="w-full max-w-[760px]">
      <div
        className={cn(
          "w-full",
          showSuccess &&
            cn(
              "done",
              "[&_[data-wizard-part=form]]:hidden [&_[data-wizard-part=head]]:hidden [&_[data-wizard-part=steps]]:hidden",
            ),
        )}
      >
        <WizardHeader data-wizard-part="head">
          <PageBackLink
            variant="wizard"
            label="Back to registrations"
            onClick={tryLeaveToRegistrations}
          />
          <h1 className="text-2xl font-extrabold tracking-[0.2px]">
            {lead ? "EDIT REQUEST" : "TREATMENT REQUEST"}
          </h1>
          <p className="mt-[5px] text-[13.5px] opacity-[0.88]">
            {lead ?
              `Update ${lead.claimNo} in 3 easy steps`
            : "Submit your treatment request in 3 easy steps"}
          </p>
        </WizardHeader>

        <WizardStepsCard data-wizard-part="steps">
          <WizardStepRow>
            <div className={portalWizard.step.root}>
              <div className={wizardStepLineClass(step, 1)} />
              <div className={wizardStepCircleClass(step, 1)}>1</div>
              <div className={wizardStepLabelClass(step, 1)}>
                Customer
                <br />
                Information
              </div>
            </div>
            <div className={portalWizard.step.root}>
              <div className={wizardStepLineClass(step, 2)} />
              <div className={wizardStepCircleClass(step, 2)}>2</div>
              <div className={wizardStepLabelClass(step, 2)}>
                Medical
                <br />
                Information
              </div>
            </div>
            <div className={portalWizard.step.root}>
              <div className={wizardStepCircleClass(step, 3)}>3</div>
              <div className={wizardStepLabelClass(step, 3)}>
                Payee
                <br />
                Information
              </div>
            </div>
          </WizardStepRow>
          <div className="mt-[22px] h-[5px] overflow-hidden rounded-[20px] bg-[#eeebf6]">
            <div
              className="h-full rounded-[20px] bg-care-grad transition-[width] duration-300 ease-in-out motion-reduce:transition-none"
              style={{ width: progress }}
            />
          </div>
        </WizardStepsCard>

        <WizardForm
          ref={formRef}
          data-wizard-part="form"
          onSubmit={handleSubmit}
          onInput={(event) => {
            markDirty();
            const { name } = event.target as HTMLInputElement;
            if (name) clearInvalid(name);
          }}
          noValidate
        >
          <input type="hidden" name="Source" value={agentSource} />
          <input
            type="hidden"
            name="InsurerCd"
            value={lead?.insurerCd ?? user?.userCd ?? ""}
          />
          {stepError ?
            <p
              className="mb-4 rounded-[10px] bg-[#fde8e8] px-3.5 py-2.5 text-[13px] font-semibold text-care-red"
              role="alert"
            >
              {stepError}
            </p>
          : null}
          <div
            className={step === 1 ? "active" : undefined}
            hidden={step !== 1}
          >
            <div className="mb-[22px] flex items-center justify-between border-b border-care-line pb-[18px]">
              <div className="flex items-center gap-3">
                <div className="flex size-[42px] items-center justify-center rounded-xl bg-[#f1e9fe] [&_svg]:size-[21px] [&_svg]:text-care-purple">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="4" y="3" width="16" height="18" rx="2" />
                    <circle cx="12" cy="10" r="3" />
                    <path d="M8 17c0-2 2-3 4-3s4 1 4 3" />
                  </svg>
                </div>
                <div className="text-lg font-extrabold">
                  Customer Information
                </div>
              </div>
              <div className="rounded-[20px] bg-[#f1e9fe] px-[13px] py-1.5 text-xs font-bold text-care-purple">
                Step 1 of 3
              </div>
            </div>

            <WizardFieldGrid>
              <Field invalid={isInvalid("FirstName")}>
                <FieldLabel>
                  First Name <span className="req">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  name="FirstName"
                  defaultValue={lead?.firstName}
                  placeholder="First Name"
                  required
                />
              </Field>
              <Field invalid={isInvalid("MiddleName")}>
                <FieldLabel>Middle Name</FieldLabel>
                <Input
                  type="text"
                  name="MiddleName"
                  defaultValue={lead?.middleName}
                  placeholder="Middle Name"
                />
              </Field>
              <Field invalid={isInvalid("LastName")}>
                <FieldLabel>Last Name</FieldLabel>
                <Input
                  type="text"
                  name="LastName"
                  defaultValue={lead?.lastName}
                  placeholder="Last Name"
                />
              </Field>
              <Field invalid={isInvalid("EmailId")}>
                <FieldLabel>Email Address</FieldLabel>
                <Input
                  type="email"
                  name="EmailId"
                  defaultValue={lead?.emailId}
                  placeholder="name@example.com"
                />
              </Field>
              <Field invalid={isInvalid("Dob")}>
                <FieldLabel>Date of Birth</FieldLabel>
                <CareaiDateField
                  ref={dobRef}
                  name="Dob"
                  defaultValue={lead?.dob}
                  disableFuture
                  onChange={() => markDirty()}
                />
              </Field>
              <Field invalid={isInvalid("Gender")}>
                <FieldLabel>
                  Gender <span className="req">*</span>
                </FieldLabel>
                <CareaiSelect
                  appearance="field"
                  name="Gender"
                  onChange={() => {
                    markDirty();
                    clearInvalid("Gender");
                  }}
                  defaultValue={lead?.gender ?? ""}
                  placeholder="--Select--"
                  options={genderOptions}
                />
              </Field>
              <Field>
                <FieldLabel>Nationality</FieldLabel>
                <CareaiSelect
                  appearance="field"
                  name="Nationality"
                  defaultValue={lead?.nationality ?? ""}
                  placeholder="--Select--"
                  searchable
                  options={nationalityOptions}
                  onChange={() => markDirty()}
                />
              </Field>
              <Field invalid={isInvalid("CallingCd", "MobileNo")}>
                <FieldLabel>
                  Contact Number <span className="req">*</span>
                </FieldLabel>
                <div className="grid grid-cols-[minmax(64px,88px)_minmax(0,1fr)] gap-2">
                  <Input
                    type="text"
                    name="CallingCd"
                    defaultValue={
                      (lead && normalizeCallingCode(lead.callingCd)) ||
                      DEFAULT_CALLING_CD
                    }
                    placeholder={DEFAULT_CALLING_CD}
                    aria-label="Calling code"
                    onBlur={(event) => {
                      event.target.value = normalizeCallingCode(
                        event.target.value,
                      );
                    }}
                  />
                  <Input
                    type="tel"
                    name="MobileNo"
                    defaultValue={lead?.mobileNo}
                    placeholder="Phone"
                    inputMode="numeric"
                    onInput={(event) => {
                      event.currentTarget.value = event.currentTarget.value
                        .replace(/\D/g, "")
                        .slice(0, LEAD_PHONE_MAX_DIGITS);
                    }}
                  />
                </div>
              </Field>
            </WizardFieldGrid>

            <Field>
              <FieldLabel>Select Category</FieldLabel>
              <div className="flex gap-[22px] pt-1 max-[640px]:flex-wrap max-[640px]:gap-x-[18px] max-[640px]:gap-y-2.5">
                <label className="flex cursor-pointer items-center gap-[7px] text-[13.5px] font-semibold text-care-nav-ink">
                  <input
                    type="radio"
                    name="LeadType"
                    value={LEAD_TYPES.priority}
                    defaultChecked={lead?.leadType === LEAD_TYPES.priority}
                  />{" "}
                  Priority
                </label>
                <label className="flex cursor-pointer items-center gap-[7px] text-[13.5px] font-semibold text-care-nav-ink">
                  <input
                    type="radio"
                    name="LeadType"
                    value={LEAD_TYPES.emergency}
                    defaultChecked={lead?.leadType === LEAD_TYPES.emergency}
                  />{" "}
                  Emergency
                </label>
                <label className="flex cursor-pointer items-center gap-[7px] text-[13.5px] font-semibold text-care-nav-ink">
                  <input
                    type="radio"
                    name="LeadType"
                    value={LEAD_TYPES.normal}
                    defaultChecked={
                      !lead?.leadType || lead.leadType === LEAD_TYPES.normal
                    }
                  />{" "}
                  Normal
                </label>
              </div>
            </Field>

            <WizardFieldGrid>
              <Field invalid={isInvalid("PatientLocation")}>
                <FieldLabel>
                  Patient Location <span className="req">*</span>
                </FieldLabel>
                <CareaiSelect
                  appearance="field"
                  name="PatientLocation"
                  onChange={() => {
                    markDirty();
                    clearInvalid("PatientLocation");
                  }}
                  defaultValue={lead?.patientLocation ?? ""}
                  placeholder="--Select--"
                  searchable
                  options={locationOptions}
                />
              </Field>
              <Field invalid={isInvalid("DocumentType")}>
                <FieldLabel>
                  Identification Document <span className="req">*</span>
                </FieldLabel>
                <CareaiSelect
                  appearance="field"
                  name="DocumentType"
                  onChange={() => {
                    markDirty();
                    clearInvalid("DocumentType");
                  }}
                  defaultValue={lead?.documentType ?? ""}
                  placeholder="--Select--"
                  options={docTypeOptions}
                />
              </Field>
              <Field invalid={isInvalid("DocumentNo")}>
                <FieldLabel>
                  Document Number <span className="req">*</span>
                </FieldLabel>
                <Input
                  type="text"
                  name="DocumentNo"
                  defaultValue={lead?.documentNo}
                  placeholder="Document number"
                />
              </Field>
            </WizardFieldGrid>

            <Field invalid={isInvalid(ID_FILE)}>
              <FieldLabel htmlFor="id-doc-input">
                Upload Identification Document
              </FieldLabel>
              <label
                className="relative flex items-center gap-2.5"
                htmlFor="id-doc-input"
              >
                <FileInput
                  ref={idFileRef}
                  id="id-doc-input"

                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(event) => {
                    onIdFileChange(event);
                    clearInvalid(ID_FILE);
                  }}
                />
                <span
                  data-slot="choose-btn"
                  className="pointer-events-none relative z-[1] cursor-pointer rounded-[11px] border-[1.5px] border-care-line bg-care-bg px-[18px] py-3 text-[13.5px] font-bold whitespace-nowrap text-care-nav-ink"
                >
                  Choose File
                </span>
                <span className="text-[13px] font-bold text-care-sub">
                  {idFileLabel}
                </span>
              </label>
              {lead ?
                <ExistingDocuments
                  claimNo={lead.claimNo}
                  heading="Previously uploaded"
                  documents={lead.documents.filter(
                    (doc) => doc.docCd === LEAD_DOCUMENT_CODES.id,
                  )}
                />
              : null}
            </Field>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div />
              <button
                type="button"
                className={portalButtonClass("primary")}
                onClick={() => advance(1)}
              >
                Next{" "}
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={step === 2 ? "active" : undefined}
            hidden={step !== 2}
          >
            <div className="mb-[22px] flex items-center justify-between border-b border-care-line pb-[18px]">
              <div className="flex items-center gap-3">
                <div className="flex size-[42px] items-center justify-center rounded-xl bg-[#f1e9fe] [&_svg]:size-[21px] [&_svg]:text-care-purple">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 3h6l1 3h3a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3z" />
                    <path d="M9 12h6M12 9v6" />
                  </svg>
                </div>
                <div className="text-lg font-extrabold">
                  Medical Information
                </div>
              </div>
              <div className="rounded-[20px] bg-[#f1e9fe] px-[13px] py-1.5 text-xs font-bold text-care-purple">
                Step 2 of 3
              </div>
            </div>

            <WizardFieldGrid>
              <Field invalid={isInvalid("TreatmentType")}>
                <FieldLabel>
                  Treatment Type <span className="req">*</span>
                </FieldLabel>
                <CareaiSelect
                  appearance="field"
                  name="TreatmentType"
                  defaultValue={lead?.treatmentType ?? ""}
                  placeholder="--Select--"
                  options={treatmentOptions}
                  onChange={(value) => {
                    markDirty();
                    setTreatment(value);
                    clearInvalid("TreatmentType");
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Department</FieldLabel>
                <CareaiSelect
                  appearance="field"
                  key={treatment}
                  name="Department"
                  defaultValue={whenSame(
                    treatment,
                    lead?.treatmentType,
                    lead?.department,
                  )}
                  placeholder="--Select--"
                  options={departmentOptions}
                  onChange={() => markDirty()}
                />
              </Field>
              <Field>
                <FieldLabel>Preferred Hospital</FieldLabel>
                <CareaiSelect
                  appearance="field"
                  name="ProviderCd"
                  defaultValue={lead?.providerCd ?? ""}
                  placeholder="--Select--"
                  options={providerOptions}
                  onChange={(value) => {
                    markDirty();
                    setProvider(value);
                  }}
                  searchable
                />
              </Field>
              <Field>
                <FieldLabel>Branch Location</FieldLabel>
                <CareaiSelect
                  appearance="field"
                  key={provider}
                  name="BranchCd"
                  defaultValue={whenSame(
                    provider,
                    lead?.providerCd,
                    lead?.branchCd,
                  )}
                  placeholder="--Select--"
                  options={branchOptions}
                  onChange={() => markDirty()}
                />
              </Field>
              <Field>
                <FieldLabel>Preferred Doctor</FieldLabel>
                <CareaiSelect
                  appearance="field"
                  key={provider}
                  name="DoctorCd"
                  defaultValue={whenSame(
                    provider,
                    lead?.providerCd,
                    lead?.doctorCd,
                  )}
                  placeholder="--Select--"
                  options={doctorOptions}
                  onChange={() => markDirty()}
                />
              </Field>
              <CareaiCodeSearch
                type={MASTER_CODE_TYPES.icd}
                codeName="IcdCode"
                codeLabel="ICD Code"
                codePlaceholder="Enter or search ICD code"
                descName="IcdDesc"
                descLabel="ICD Description"
                descPlaceholder="Auto-filled from search"
                defaultCode={lead?.icdCode}
                defaultDesc={lead?.icdDesc}
              />
              <CareaiCodeSearch
                type={MASTER_CODE_TYPES.cpt}
                codeName="CptCode"
                codeLabel="CPT Code"
                codePlaceholder="Enter or search CPT code"
                descName="CptDesc"
                descLabel="CPT Description"
                descPlaceholder="Auto-filled from search"
                defaultCode={lead?.cptCode}
                defaultDesc={lead?.cptDesc}
              />
            </WizardFieldGrid>

            <Field>
              <FieldLabel>Diagnosis</FieldLabel>
              <Textarea
                name="Diagnosis"
                defaultValue={lead?.diagnosis}
                placeholder="Enter diagnosis details..."
              />
            </Field>
            <Field>
              <FieldLabel>Treatment</FieldLabel>
              <Textarea
                name="Treatment"
                defaultValue={lead?.treatment}
                placeholder="Enter treatment details..."
              />
            </Field>

            <Field invalid={isInvalid(MEDICAL_FILES)}>
              <FieldLabel htmlFor="med-reports-input">
                Medical Reports
              </FieldLabel>
              <label
                data-slot="upload"
                className={cn(
                  "relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-[14px] border-[1.5px] border-dashed border-[#d9d3ec] bg-[#fbfafd] px-[26px] py-[26px] text-center text-[#3f3b52] [&_.s]:mt-1 [&_.s]:text-xs [&_.s]:font-bold [&_.t]:text-sm [&_.t]:font-bold [&_svg]:mx-auto [&_svg]:mb-2.5 [&_svg]:block [&_svg]:size-[30px] [&_svg]:shrink-0 [&_svg]:text-care-pink",
                  medFileLabel ?
                    "[&_.t]:text-care-purple"
                  : "[&_.t]:text-care-ink",
                )}
                htmlFor="med-reports-input"
              >
                <FileInput
                  ref={medFileRef}
                  id="med-reports-input"

                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  onChange={(event) => {
                    onMedFileChange(event);
                    clearInvalid(MEDICAL_FILES);
                  }}
                />
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 3h6l1 3h3a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h3z" />
                </svg>
                <div className="t">
                  {medFileLabel ?? "Upload Medical reports"}
                </div>
                <div className="s">Supported PDF, DOC, JPG, PNG</div>
              </label>
              {lead ?
                <ExistingDocuments
                  claimNo={lead.claimNo}
                  heading="Previously uploaded"
                  documents={lead.documents.filter(
                    (doc) => doc.docCd === LEAD_DOCUMENT_CODES.medical,
                  )}
                />
              : null}
            </Field>

            <Field>
              <FieldLabel>Case Notes & Remarks</FieldLabel>
              <Textarea
                name="CaseNote"
                defaultValue={lead?.caseNote}
                placeholder="Enter any special requirements, notes, or additional information..."
              />
            </Field>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className={portalButtonClass("ghost")}
                onClick={() => goStep(1)}
              >
                Previous
              </button>
              <button
                type="button"
                className={portalButtonClass("primary")}
                onClick={() => advance(2)}
              >
                Next{" "}
                <svg
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </div>

          <div
            className={step === 3 ? "active" : undefined}
            hidden={step !== 3}
          >
            <div className="mb-[22px] flex items-center justify-between border-b border-care-line pb-[18px]">
              <div className="flex items-center gap-3">
                <div className="flex size-[42px] items-center justify-center rounded-xl bg-[#f1e9fe] [&_svg]:size-[21px] [&_svg]:text-care-purple">
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <rect x="2" y="6" width="20" height="13" rx="2" />
                    <path d="M2 10h20" />
                    <circle cx="7" cy="14.5" r="1" />
                  </svg>
                </div>
                <div className="text-lg font-extrabold">Mode of Payment</div>
              </div>
              <div className="rounded-[20px] bg-[#f1e9fe] px-[13px] py-1.5 text-xs font-bold text-care-purple">
                Step 3 of 3
              </div>
            </div>

            <WizardFieldGrid>
              <Field invalid={isInvalid("PaymentMode")}>
                <FieldLabel>
                  Payment Mode <span className="req">*</span>
                </FieldLabel>
                <CareaiSelect
                  appearance="field"
                  name="PaymentMode"
                  defaultValue={lead?.paymentMode ?? ""}
                  placeholder="--Select--"
                  options={paymentOptions}
                  onChange={(value) => {
                    markDirty();
                    setPaymentMode(value);
                    clearInvalid("PaymentMode");
                  }}
                />
              </Field>
              <Field>
                <FieldLabel>Payment Type</FieldLabel>
                <CareaiSelect
                  appearance="field"
                  key={paymentMode}
                  name="Guarantor"
                  defaultValue={whenSame(
                    paymentMode,
                    lead?.paymentMode,
                    lead?.guarantor,
                  )}
                  placeholder="--Select--"
                  options={guarantorOptions}
                  onChange={() => markDirty()}
                />
              </Field>
            </WizardFieldGrid>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                className={portalButtonClass("ghost")}
                onClick={() => goStep(2)}
                disabled={submitting}
              >
                Previous
              </button>
              <button
                type="submit"
                className={portalButtonClass("primary")}
                disabled={submitting}
              >
                {submitting ?
                  <>
                    <span className={portalButtonSpinner} aria-hidden />
                    {uploadingDocs ? "Uploading documents…" : "Saving…"}
                  </>
                : lead ?
                  "Save changes"
                : "Submit"}
              </button>
            </div>
          </div>
        </WizardForm>
      </div>

      <div
        className={cn(
          "hidden rounded-[22px] bg-white px-10 py-14 text-center shadow-portal-wizard-form max-[640px]:px-[18px] max-[640px]:py-9",
          showSuccess && "block",
        )}
      >
        <div className="mx-auto mb-[22px] flex size-[82px] items-center justify-center rounded-full bg-care-grad shadow-[0_10px_26px_rgba(214,35,140,0.3)] [&_svg]:size-[38px] [&_svg]:text-white">
          <svg fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mb-2.5 text-[26px] font-extrabold text-care-purple">
          Success!
        </h2>
        <p className="mb-[26px] text-[15px] text-care-sub">
          {lead ?
            "The registration has been updated."
          : "Patient lead has been successfully submitted."}
        </p>
        <div className="mb-[26px] inline-flex items-center gap-3 rounded-2xl bg-[#fbeaf4] px-6 py-3.5">
          <div className="flex size-[38px] items-center justify-center rounded-full bg-care-grad [&_svg]:size-[18px] [&_svg]:text-white">
            <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="11" r="2" />
              <path d="M15 9h3M15 13h3M6 17c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
            </svg>
          </div>
          <div className="text-left">
            <div className="text-[11.5px] font-semibold text-care-sub">
              Member ID
            </div>
            <div className="text-[17px] font-extrabold text-care-ink">
              {memberId || "—"}
            </div>
            <div
              className={cn(
                "text-[11.5px] font-semibold text-care-sub",
                "mt-3",
              )}
            >
              Treatment ID
            </div>
            <div className="text-[17px] font-extrabold text-care-ink">
              {claimNo || "—"}
            </div>
          </div>
        </div>
        {uploadResult ?
          <div
            className="mx-auto mb-[22px] flex max-w-[420px] flex-col gap-2.5 text-left text-sm [&_b]:mb-1.5 [&_b]:block [&_li]:[overflow-wrap:anywhere] [&_ul]:m-0 [&_ul]:grid [&_ul]:list-none [&_ul]:gap-1 [&_ul]:p-0 [&>div]:rounded-[14px] [&>div]:px-[18px] [&>div]:py-3.5"
            role="status"
          >
            {uploadResult.uploaded.length > 0 ?
              <div className="border border-[#bbf7d0] bg-[#f0fdf4] text-[#15803d] [&_li]:before:mr-2 [&_li]:before:content-['✓']">
                <b>Documents uploaded</b>
                <ul>
                  {uploadResult.uploaded.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            : null}
            {uploadResult.errors.length > 0 ?
              <div className="border border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]">
                <b>Not uploaded</b>
                <ul>
                  {uploadResult.errors.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </ul>
              </div>
            : null}
          </div>
        : null}
        <p className="mb-[26px] text-[15px] text-care-sub">
          Thank you for completing the form.
        </p>
        <div className="flex flex-wrap justify-center gap-2.5">
          {lead ?
            <Link
              href={`${ROUTES.agent.caseRegistration}/${encodeURIComponent(lead.claimNo)}/edit`}
              className={portalButtonClass("primary")}
            >
              Continue editing
            </Link>
          : <button
              type="button"
              className={portalButtonClass("primary")}
              onClick={resetWizard}
            >
              + Add New Request
            </button>
          }
          <Link
            href={ROUTES.agent.caseRegistration}
            className={portalButtonClass("ghost")}
          >
            View all registrations
          </Link>
        </div>
      </div>
      <CareaiValidationDialog messages={issues} onClose={() => setIssues([])} />
      <DialogShell
        ref={leaveDialogRef}
        aria-labelledby={leaveTitleId}
        onClose={() => setShowLeaveConfirm(false)}
      >
        <DialogHeader badge="?" titleId={leaveTitleId}>
          Leave this form?
        </DialogHeader>
        <p className="m-0 px-6 pb-2 text-sm leading-normal text-care-sub">
          You have unsaved changes. If you go back now, your edits will be lost.
        </p>
        <DialogActions split>
          <DialogButton
            variant="secondary"
            onClick={() => setShowLeaveConfirm(false)}
          >
            Keep editing
          </DialogButton>
          <DialogButton onClick={leaveToRegistrations}>
            Leave without saving
          </DialogButton>
        </DialogActions>
      </DialogShell>
    </div>
  );
}
