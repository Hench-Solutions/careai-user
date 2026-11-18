"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

import type { CareaiDateFieldHandle } from "@/components/careai/careai-date-field";
import type { LeadIssue } from "@/lib/lead/validate";
import type {
  LeadDetail,
  LeadRegistrationPayload,
  MasterOption,
} from "@/services/lead";

import { CareaiCodeSearch } from "@/components/careai/careai-code-search";
import { CareaiDateField } from "@/components/careai/careai-date-field";
import { CareaiSelect } from "@/components/careai/careai-select";
import { CareaiValidationDialog } from "@/components/careai/careai-validation-dialog";
import { ExistingDocuments } from "@/components/portal/agent-pages/ExistingDocuments";
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

type WizardStep = 1 | 2 | 3;

function stepClass(current: WizardStep, step: WizardStep) {
  if (step < current) return "lm-step done";
  if (step === current) return "lm-step current";
  return "lm-step";
}

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
  const [step, setStep] = useState<WizardStep>(1);
  const [showSuccess, setShowSuccess] = useState(false);
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [
        sources,
        docs,
        nations,
        locations,
        providers,
        genders,
        treatments,
        payments,
      ] = await Promise.all([
        fetchMasterDropdown(MASTER_DROPDOWN_MODES.source),
        fetchMasterDropdown(
          MASTER_DROPDOWN_MODES.documentType,
          MASTER_LEAD_DOCUMENTS_FILTER,
        ),
        fetchMasterDropdown(MASTER_DROPDOWN_MODES.nationality),
        fetchMasterDropdown(MASTER_DROPDOWN_MODES.patientLocation),
        fetchMasterDropdown(MASTER_DROPDOWN_MODES.provider),
        fetchMasterItems(MASTER_ITEM_TYPES.gender),
        fetchMasterItems(MASTER_ITEM_TYPES.treatmentType),
        fetchMasterItems(MASTER_ITEM_TYPES.paymentMode),
      ]);
      if (cancelled) return;
      setAgentSource(
        sources.find((o) => o.label === LEAD_SOURCE_AGENT_LABEL)?.value ?? "",
      );
      setDocTypeOptions(
        withBlank(withCurrent(docs, lead?.documentType, lead?.documentTypeNm)),
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
    })();
    return () => {
      cancelled = true;
    };
  }, [lead]);

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
    const file = event.target.files?.[0];
    setIdFileLabel(file?.name ?? "No file chosen");
  };

  const onMedFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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

  const fieldClass = (...fields: string[]) =>
    cn("lm-field", fields.some((f) => invalid.includes(f)) && "has-error");

  const goStep = useCallback((n: WizardStep) => {
    setStepError(null);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const readLead = (form: HTMLFormElement) => {
    const lead = Object.fromEntries(
      LEAD_FIELDS.map((field) => [field, formValue(form, field)]),
    ) as LeadRegistrationPayload;
    lead.Dob ||= dobRef.current?.value?.trim() ?? "";
    lead.CallingCd = normalizeCallingCode(lead.CallingCd ?? "");
    lead.LeadType ||= LEAD_TYPES.normal;
    return lead;
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
        }
      }

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
    setTreatment(lead?.treatmentType ?? "");
    setProvider(lead?.providerCd ?? "");
    setPaymentMode(lead?.paymentMode ?? "");
    formRef.current?.reset();
  }, [lead]);

  // Next keeps a page's state when you navigate away; its effects are cleaned up then, so start over here.
  useEffect(() => resetWizard, [resetWizard]);

  const progress = `${(step / 3) * 100}%`;

  return (
    <div className="lm-wizard">
      <div className={cn("lm-wizard-wrap", showSuccess && "done")}>
        <div className="lm-wiz-head">
          <h1>{lead ? "EDIT REQUEST" : "TREATMENT REQUEST"}</h1>
          <p>
            {lead ?
              `Update ${lead.claimNo} in 3 easy steps`
            : "Submit your treatment request in 3 easy steps"}
          </p>
        </div>

        <div className="lm-steps-card">
          <div className="lm-steps">
            <div className={stepClass(step, 1)}>
              <div className="lm-step-line" />
              <div className="lm-step-circle">1</div>
              <div className="lm-step-label">
                Customer
                <br />
                Information
              </div>
            </div>
            <div className={stepClass(step, 2)}>
              <div className="lm-step-line" />
              <div className="lm-step-circle">2</div>
              <div className="lm-step-label">
                Medical
                <br />
                Information
              </div>
            </div>
            <div className={stepClass(step, 3)}>
              <div className="lm-step-circle">3</div>
              <div className="lm-step-label">
                Payee
                <br />
                Information
              </div>
            </div>
          </div>
          <div className="lm-progress">
            <div className="lm-progress-bar" style={{ width: progress }} />
          </div>
        </div>

        <form
          ref={formRef}
          className="lm-form-card"
          onSubmit={handleSubmit}
          onInput={(event) => {
            const { name } = event.target as HTMLInputElement;
            if (name) clearInvalid(name);
          }}
          noValidate
        >
          <input type="hidden" name="Source" value={agentSource} />
          {stepError ?
            <p className="lm-form-error" role="alert">
              {stepError}
            </p>
          : null}
          <div
            className={step === 1 ? "active" : undefined}
            hidden={step !== 1}
          >
            <div className="lm-form-head">
              <div className="lm-form-head-left">
                <div className="lm-form-icon">
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
                <div className="lm-form-title">Customer Information</div>
              </div>
              <div className="lm-step-pill">Step 1 of 3</div>
            </div>

            <div className="lm-grid2">
              <div className={fieldClass("FirstName")}>
                <label>
                  First Name <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="FirstName"
                  defaultValue={lead?.firstName}
                  placeholder="First Name"
                  required
                />
              </div>
              <div className={fieldClass("MiddleName")}>
                <label>Middle Name</label>
                <input
                  type="text"
                  name="MiddleName"
                  defaultValue={lead?.middleName}
                  placeholder="Middle Name"
                />
              </div>
              <div className={fieldClass("LastName")}>
                <label>Last Name</label>
                <input
                  type="text"
                  name="LastName"
                  defaultValue={lead?.lastName}
                  placeholder="Last Name"
                />
              </div>
              <div className={fieldClass("EmailId")}>
                <label>Email Address</label>
                <input
                  type="email"
                  name="EmailId"
                  defaultValue={lead?.emailId}
                  placeholder="name@example.com"
                />
              </div>
              <div className={fieldClass("Dob")}>
                <label>Date of Birth</label>
                <CareaiDateField
                  ref={dobRef}
                  name="Dob"
                  defaultValue={lead?.dob}
                  disableFuture
                />
              </div>
              <div className={fieldClass("Gender")}>
                <label>
                  Gender <span className="req">*</span>
                </label>
                <CareaiSelect
                  name="Gender"
                  onChange={() => clearInvalid("Gender")}
                  defaultValue={lead?.gender ?? ""}
                  placeholder="--Select--"
                  options={genderOptions}
                />
              </div>
              <div className="lm-field">
                <label>Nationality</label>
                <CareaiSelect
                  name="Nationality"
                  defaultValue={lead?.nationality ?? ""}
                  placeholder="--Select--"
                  searchable
                  options={nationalityOptions}
                />
              </div>
              <div className={fieldClass("CallingCd", "MobileNo")}>
                <label>
                  Contact Number <span className="req">*</span>
                </label>
                <div className="lm-phone-row">
                  <input
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
                  <input
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
              </div>
            </div>

            <div className="lm-field">
              <label>Select Category</label>
              <div className="lm-radio-row">
                <label className="lm-radio">
                  <input
                    type="radio"
                    name="LeadType"
                    value={LEAD_TYPES.priority}
                    defaultChecked={lead?.leadType === LEAD_TYPES.priority}
                  />{" "}
                  Priority
                </label>
                <label className="lm-radio">
                  <input
                    type="radio"
                    name="LeadType"
                    value={LEAD_TYPES.emergency}
                    defaultChecked={lead?.leadType === LEAD_TYPES.emergency}
                  />{" "}
                  Emergency
                </label>
                <label className="lm-radio">
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
            </div>

            <div className="lm-grid2">
              <div className={fieldClass("PatientLocation")}>
                <label>
                  Patient Location <span className="req">*</span>
                </label>
                <CareaiSelect
                  name="PatientLocation"
                  onChange={() => clearInvalid("PatientLocation")}
                  defaultValue={lead?.patientLocation ?? ""}
                  placeholder="--Select--"
                  searchable
                  options={locationOptions}
                />
              </div>
              <div className={fieldClass("DocumentType")}>
                <label>
                  Identification Document <span className="req">*</span>
                </label>
                <CareaiSelect
                  name="DocumentType"
                  onChange={() => clearInvalid("DocumentType")}
                  defaultValue={lead?.documentType ?? ""}
                  placeholder="--Select--"
                  options={docTypeOptions}
                />
              </div>
              <div className={fieldClass("DocumentNo")}>
                <label>
                  Document Number <span className="req">*</span>
                </label>
                <input
                  type="text"
                  name="DocumentNo"
                  defaultValue={lead?.documentNo}
                  placeholder="Document number"
                />
              </div>
            </div>

            <div className={fieldClass(ID_FILE)}>
              <label htmlFor="id-doc-input">
                Upload Identification Document
              </label>
              <label className="lm-file-row" htmlFor="id-doc-input">
                <input
                  ref={idFileRef}
                  id="id-doc-input"
                  type="file"
                  className="lm-file-input"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(event) => {
                    onIdFileChange(event);
                    clearInvalid(ID_FILE);
                  }}
                />
                <span className="lm-choose-btn">Choose File</span>
                <span className="lm-file-name">{idFileLabel}</span>
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
            </div>

            <div className="lm-form-actions">
              <div />
              <button
                type="button"
                className="lm-btn lm-btn-primary"
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
            <div className="lm-form-head">
              <div className="lm-form-head-left">
                <div className="lm-form-icon">
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
                <div className="lm-form-title">Medical Information</div>
              </div>
              <div className="lm-step-pill">Step 2 of 3</div>
            </div>

            <div className="lm-grid2">
              <div className={fieldClass("TreatmentType")}>
                <label>
                  Treatment Type <span className="req">*</span>
                </label>
                <CareaiSelect
                  name="TreatmentType"
                  defaultValue={lead?.treatmentType ?? ""}
                  placeholder="--Select--"
                  options={treatmentOptions}
                  onChange={(value) => {
                    setTreatment(value);
                    clearInvalid("TreatmentType");
                  }}
                />
              </div>
              <div className="lm-field">
                <label>Department</label>
                <CareaiSelect
                  key={treatment}
                  name="Department"
                  defaultValue={whenSame(
                    treatment,
                    lead?.treatmentType,
                    lead?.department,
                  )}
                  placeholder="--Select--"
                  options={departmentOptions}
                />
              </div>
              <div className="lm-field">
                <label>Preferred Hospital</label>
                <CareaiSelect
                  name="ProviderCd"
                  defaultValue={lead?.providerCd ?? ""}
                  placeholder="--Select--"
                  options={providerOptions}
                  onChange={setProvider}
                  searchable
                />
              </div>
              <div className="lm-field">
                <label>Branch Location</label>
                <CareaiSelect
                  key={provider}
                  name="BranchCd"
                  defaultValue={whenSame(
                    provider,
                    lead?.providerCd,
                    lead?.branchCd,
                  )}
                  placeholder="--Select--"
                  options={branchOptions}
                />
              </div>
              <div className="lm-field">
                <label>Preferred Doctor</label>
                <CareaiSelect
                  key={provider}
                  name="DoctorCd"
                  defaultValue={whenSame(
                    provider,
                    lead?.providerCd,
                    lead?.doctorCd,
                  )}
                  placeholder="--Select--"
                  options={doctorOptions}
                />
              </div>
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
            </div>

            <div className="lm-field">
              <label>Diagnosis</label>
              <textarea
                name="Diagnosis"
                defaultValue={lead?.diagnosis}
                placeholder="Enter diagnosis details..."
              />
            </div>
            <div className="lm-field">
              <label>Treatment</label>
              <textarea
                name="Treatment"
                defaultValue={lead?.treatment}
                placeholder="Enter treatment details..."
              />
            </div>

            <div className={fieldClass(MEDICAL_FILES)}>
              <label htmlFor="med-reports-input">Medical Reports</label>
              <label
                className={cn("lm-upload", medFileLabel && "has-file")}
                htmlFor="med-reports-input"
              >
                <input
                  ref={medFileRef}
                  id="med-reports-input"
                  type="file"
                  className="lm-file-input"
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
            </div>

            <div className="lm-field">
              <label>Case Notes & Remarks</label>
              <textarea
                name="CaseNote"
                defaultValue={lead?.caseNote}
                placeholder="Enter any special requirements, notes, or additional information..."
              />
            </div>

            <div className="lm-form-actions">
              <button
                type="button"
                className="lm-btn lm-btn-ghost"
                onClick={() => goStep(1)}
              >
                Previous
              </button>
              <button
                type="button"
                className="lm-btn lm-btn-primary"
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
            <div className="lm-form-head">
              <div className="lm-form-head-left">
                <div className="lm-form-icon">
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
                <div className="lm-form-title">Mode of Payment</div>
              </div>
              <div className="lm-step-pill">Step 3 of 3</div>
            </div>

            <div className="lm-grid2">
              <div className={fieldClass("PaymentMode")}>
                <label>
                  Payment Mode <span className="req">*</span>
                </label>
                <CareaiSelect
                  name="PaymentMode"
                  defaultValue={lead?.paymentMode ?? ""}
                  placeholder="--Select--"
                  options={paymentOptions}
                  onChange={(value) => {
                    setPaymentMode(value);
                    clearInvalid("PaymentMode");
                  }}
                />
              </div>
              <div className="lm-field">
                <label>Payment Type</label>
                <CareaiSelect
                  key={paymentMode}
                  name="Guarantor"
                  defaultValue={whenSame(
                    paymentMode,
                    lead?.paymentMode,
                    lead?.guarantor,
                  )}
                  placeholder="--Select--"
                  options={guarantorOptions}
                />
              </div>
            </div>

            <div className="lm-form-actions">
              <button
                type="button"
                className="lm-btn lm-btn-ghost"
                onClick={() => goStep(2)}
                disabled={submitting}
              >
                Previous
              </button>
              <button
                type="submit"
                className="lm-btn lm-btn-primary"
                disabled={submitting}
              >
                {submitting ?
                  "Saving…"
                : lead ?
                  "Save changes"
                : "Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className={cn("lm-success", showSuccess && "show")}>
        <div className="lm-success-check">
          <svg fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h2>Success!</h2>
        <p>
          {lead ?
            "The registration has been updated."
          : "Patient lead has been successfully submitted."}
        </p>
        <div className="lm-member">
          <div className="lm-member-icon">
            <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="9" cy="11" r="2" />
              <path d="M15 9h3M15 13h3M6 17c0-1.5 1.5-2.5 3-2.5s3 1 3 2.5" />
            </svg>
          </div>
          <div className="lm-member-text">
            <div className="lm-member-label">Member ID</div>
            <div className="lm-member-id">{memberId || "—"}</div>
            <div className="lm-member-label" style={{ marginTop: "0.75rem" }}>
              Treatment ID
            </div>
            <div className="lm-member-id">{claimNo || "—"}</div>
          </div>
        </div>
        {uploadResult ?
          <div className="lm-upload-result" role="status">
            {uploadResult.uploaded.length > 0 ?
              <div className="ok">
                <b>Documents uploaded</b>
                <ul>
                  {uploadResult.uploaded.map((name) => (
                    <li key={name}>{name}</li>
                  ))}
                </ul>
              </div>
            : null}
            {uploadResult.errors.length > 0 ?
              <div className="bad">
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
        <p className="lm-success-note">Thank you for completing the form.</p>
        <div className="lm-success-actions">
          {lead ?
            <Link
              href={`${ROUTES.agent.caseRegistration}/${encodeURIComponent(lead.claimNo)}/edit`}
              className="lm-btn lm-btn-primary"
            >
              Continue editing
            </Link>
          : <button
              type="button"
              className="lm-btn lm-btn-primary"
              onClick={resetWizard}
            >
              + Add New Request
            </button>
          }
          <Link
            href={ROUTES.agent.caseRegistration}
            className="lm-btn lm-btn-ghost"
          >
            View all registrations
          </Link>
        </div>
      </div>
      <CareaiValidationDialog messages={issues} onClose={() => setIssues([])} />
    </div>
  );
}
