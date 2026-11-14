"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { CareaiDateFieldHandle } from "@/components/careai/careai-date-field";
import type { CareaiSelectHandle } from "@/components/careai/careai-select";
import type { LeadRegistrationPayload, MasterOption } from "@/services/lead";

import { CareaiDateField } from "@/components/careai/careai-date-field";
import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  MASTER_DROPDOWN_MODES,
  MASTER_ITEM_TYPES,
  MASTER_LEAD_DOCUMENTS_FILTER,
} from "@/config/api";
import {
  BLANK_OPTION,
  DEFAULT_CALLING_CD,
  LEAD_FIELDS,
  LEAD_MESSAGES,
  LEAD_TYPES,
  PAYMENT_MODE_OPTIONS,
} from "@/config/lead";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  fetchMasterDropdown,
  fetchMasterItems,
  registerLead,
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

/** Agent case registration wizard (BFF → PortalLead/register). */
export function AgentCaseRegistrationContent() {
  const [step, setStep] = useState<WizardStep>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [memberId, setMemberId] = useState("");
  const [claimNo, setClaimNo] = useState("");
  const [idFileLabel, setIdFileLabel] = useState("No file chosen");
  const [medFileLabel, setMedFileLabel] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [sourceOptions, setSourceOptions] = useState([BLANK_OPTION]);
  const [docTypeOptions, setDocTypeOptions] = useState([BLANK_OPTION]);
  const [nationalityOptions, setNationalityOptions] = useState([BLANK_OPTION]);
  const [locationOptions, setLocationOptions] = useState([BLANK_OPTION]);
  const [genderOptions, setGenderOptions] = useState([BLANK_OPTION]);
  const [treatmentOptions, setTreatmentOptions] = useState([BLANK_OPTION]);
  const [guarantorOptions, setGuarantorOptions] = useState([BLANK_OPTION]);

  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<CareaiDateFieldHandle>(null);
  const treatmentRef = useRef<CareaiSelectHandle>(null);
  const idFileRef = useRef<HTMLInputElement>(null);
  const medFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [sources, docs, nations, locations, genders, treatments] =
        await Promise.all([
          fetchMasterDropdown(MASTER_DROPDOWN_MODES.source),
          fetchMasterDropdown(
            MASTER_DROPDOWN_MODES.documentType,
            MASTER_LEAD_DOCUMENTS_FILTER,
          ),
          fetchMasterDropdown(MASTER_DROPDOWN_MODES.nationality),
          fetchMasterDropdown(MASTER_DROPDOWN_MODES.patientLocation),
          fetchMasterItems(MASTER_ITEM_TYPES.gender),
          fetchMasterItems(MASTER_ITEM_TYPES.treatmentType),
        ]);
      if (cancelled) return;
      setSourceOptions(withBlank(sources));
      setDocTypeOptions(withBlank(docs));
      setNationalityOptions(withBlank(nations));
      setLocationOptions(withBlank(locations));
      setGenderOptions(withBlank(genders));
      setTreatmentOptions(withBlank(treatments));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      if (!cancelled) setGuarantorOptions(withBlank(rows));
    })();
    return () => {
      cancelled = true;
    };
  }, [paymentMode]);

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

  const goStep = useCallback((n: WizardStep) => {
    setStepError(null);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToStep2 = () => {
    const first = firstNameRef.current?.value?.trim() ?? "";
    if (!first) {
      setStepError(LEAD_MESSAGES.firstNameRequiredToContinue);
      firstNameRef.current?.focus();
      return;
    }
    goStep(2);
  };

  const goToStep3 = () => {
    const treatment = treatmentRef.current?.value?.trim() ?? "";
    if (!treatment) {
      setStepError(LEAD_MESSAGES.treatmentTypeRequired);
      treatmentRef.current?.focus();
      return;
    }
    goStep(3);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form || submitting) return;

    const firstName = formValue(form, "FirstName");
    const treatmentType = formValue(form, "TreatmentType");
    if (!firstName) {
      goStep(1);
      setStepError(LEAD_MESSAGES.firstNameRequired);
      firstNameRef.current?.focus();
      return;
    }
    if (!treatmentType) {
      goStep(2);
      setStepError(LEAD_MESSAGES.treatmentTypeRequired);
      treatmentRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setStepError(null);
    try {
      const payload = Object.fromEntries(
        LEAD_FIELDS.map((field) => [field, formValue(form, field)]),
      ) as LeadRegistrationPayload;
      payload.Dob ||= dobRef.current?.value?.trim() ?? "";
      payload.CallingCd ||= DEFAULT_CALLING_CD;
      payload.LeadType ||= LEAD_TYPES.normal;
      const result = await registerLead(payload);

      const mem = result.member_Id || "";
      const tid = result.claim_No || "";
      setMemberId(mem);
      setClaimNo(tid);

      const idFile = idFileRef.current?.files?.[0] ?? null;
      const medFiles = medFileRef.current?.files ?? null;
      if (mem && tid && (idFile || (medFiles && medFiles.length > 0))) {
        try {
          await uploadLeadDocuments({
            claimNo: tid,
            memberId: mem,
            idDocument: idFile,
            medicalReports: medFiles,
          });
        } catch {
          setStepError(LEAD_MESSAGES.savedButUploadFailed);
        }
      }

      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : LEAD_MESSAGES.submitFailed;
      setStepError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetWizard = () => {
    setShowSuccess(false);
    setStep(1);
    setMemberId("");
    setClaimNo("");
    setIdFileLabel("No file chosen");
    setMedFileLabel(null);
    setStepError(null);
    setSubmitting(false);
    setPaymentMode("");
    formRef.current?.reset();
  };

  const progress = `${(step / 3) * 100}%`;

  return (
    <div className="lm-wizard">
      <div className={cn("lm-wizard-wrap", showSuccess && "done")}>
        <div className="lm-wiz-head">
          <h1>TREATMENT REQUEST</h1>
          <p>Submit your treatment request in 3 easy steps</p>
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

        <form ref={formRef} className="lm-form-card" onSubmit={handleSubmit}>
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

            {sourceOptions.length > 0 ?
              <div className="lm-field">
                <label>Lead Source</label>
                <CareaiSelect
                  name="Source"
                  defaultValue=""
                  placeholder="--Select--"
                  options={sourceOptions}
                />
              </div>
            : null}

            <div className="lm-grid2">
              <div className="lm-field">
                <label>
                  First Name <span className="req">*</span>
                </label>
                <input
                  ref={firstNameRef}
                  type="text"
                  name="FirstName"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="lm-field">
                <label>Middle Name</label>
                <input
                  type="text"
                  name="MiddleName"
                  placeholder="Middle Name"
                />
              </div>
              <div className="lm-field">
                <label>Last Name</label>
                <input type="text" name="LastName" placeholder="Last Name" />
              </div>
              <div className="lm-field">
                <label>Email Address</label>
                <input
                  type="email"
                  name="EmailId"
                  placeholder="name@example.com"
                />
              </div>
              <div className="lm-field">
                <label>Date of Birth</label>
                <CareaiDateField ref={dobRef} name="Dob" />
              </div>
              <div className="lm-field">
                <label>Gender</label>
                <CareaiSelect
                  name="Gender"
                  defaultValue=""
                  placeholder="--Select--"
                  options={genderOptions}
                />
              </div>
              <div className="lm-field">
                <label>Nationality</label>
                <CareaiSelect
                  name="Nationality"
                  defaultValue=""
                  placeholder="--Select--"
                  options={nationalityOptions}
                />
              </div>
              <div className="lm-field">
                <label>Contact Number</label>
                <div className="lm-grid2" style={{ gap: "0.5rem" }}>
                  <input
                    type="text"
                    name="CallingCd"
                    defaultValue={DEFAULT_CALLING_CD}
                    placeholder="91"
                    aria-label="Calling code"
                  />
                  <input type="tel" name="MobileNo" placeholder="Phone" />
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
                  />{" "}
                  Priority
                </label>
                <label className="lm-radio">
                  <input
                    type="radio"
                    name="LeadType"
                    value={LEAD_TYPES.emergency}
                  />{" "}
                  Emergency
                </label>
                <label className="lm-radio">
                  <input
                    type="radio"
                    name="LeadType"
                    value={LEAD_TYPES.normal}
                    defaultChecked
                  />{" "}
                  Normal
                </label>
              </div>
            </div>

            <div className="lm-grid2">
              <div className="lm-field">
                <label>Patient Location</label>
                <CareaiSelect
                  name="PatientLocation"
                  defaultValue=""
                  placeholder="--Select--"
                  options={locationOptions}
                />
              </div>
              <div className="lm-field">
                <label>Identification Document</label>
                <CareaiSelect
                  name="DocumentType"
                  defaultValue=""
                  placeholder="--Select--"
                  options={docTypeOptions}
                />
              </div>
              <div className="lm-field">
                <label>Document Number</label>
                <input
                  type="text"
                  name="DocumentNo"
                  placeholder="Document number"
                />
              </div>
            </div>

            <div className="lm-field">
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
                  onChange={onIdFileChange}
                />
                <span className="lm-choose-btn">Choose File</span>
                <span className="lm-file-name">{idFileLabel}</span>
              </label>
            </div>

            <div className="lm-form-actions">
              <div />
              <button
                type="button"
                className="lm-btn lm-btn-primary"
                onClick={goToStep2}
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
              <div className="lm-field">
                <label>
                  Treatment Type <span className="req">*</span>
                </label>
                <CareaiSelect
                  ref={treatmentRef}
                  name="TreatmentType"
                  required
                  defaultValue=""
                  placeholder="--Select--"
                  options={treatmentOptions}
                />
              </div>
              <div className="lm-field">
                <label>Department</label>
                <CareaiSelect
                  name="Department"
                  defaultValue=""
                  placeholder="--Select--"
                  options={careaiOptionsFromLabels(
                    ["Inpatient", "Outpatient"],
                    { label: "--Select--" },
                  )}
                />
              </div>
              <div className="lm-field">
                <label>Preferred Hospital</label>
                <CareaiSelect
                  name="ProviderCd"
                  defaultValue=""
                  placeholder="--Select--"
                  options={careaiOptionsFromLabels([], {
                    label: "--Select--",
                  })}
                />
              </div>
              <div className="lm-field">
                <label>Branch Location</label>
                <CareaiSelect
                  name="BranchCd"
                  defaultValue=""
                  placeholder="--Select--"
                  options={careaiOptionsFromLabels([], {
                    label: "--Select--",
                  })}
                />
              </div>
              <div className="lm-field">
                <label>Preferred Doctor</label>
                <CareaiSelect
                  name="DoctorCd"
                  defaultValue=""
                  placeholder="--Select--"
                  options={careaiOptionsFromLabels([], {
                    label: "--Select--",
                  })}
                />
              </div>
              <div className="lm-field">
                <label>ICD Code</label>
                <input type="text" name="IcdCode" placeholder="ICD code" />
              </div>
              <div className="lm-field">
                <label>ICD Description</label>
                <input
                  type="text"
                  name="IcdDesc"
                  placeholder="ICD description"
                />
              </div>
              <div className="lm-field">
                <label>CPT Code</label>
                <input type="text" name="CptCode" placeholder="CPT code" />
              </div>
              <div className="lm-field">
                <label>CPT Description</label>
                <input
                  type="text"
                  name="CptDesc"
                  placeholder="CPT description"
                />
              </div>
            </div>

            <div className="lm-field">
              <label>Diagnosis</label>
              <textarea
                name="Diagnosis"
                placeholder="Enter diagnosis details..."
              />
            </div>
            <div className="lm-field">
              <label>Treatment</label>
              <textarea
                name="Treatment"
                placeholder="Enter treatment details..."
              />
            </div>

            <div className="lm-field">
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
                  onChange={onMedFileChange}
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
            </div>

            <div className="lm-field">
              <label>Case Notes & Remarks</label>
              <textarea
                name="CaseNote"
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
                onClick={goToStep3}
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
              <div className="lm-field">
                <label>
                  Payment Mode <span className="req">*</span>
                </label>
                <CareaiSelect
                  name="PaymentMode"
                  defaultValue=""
                  placeholder="--Select--"
                  options={PAYMENT_MODE_OPTIONS}
                  onChange={(value) => setPaymentMode(value)}
                />
              </div>
              <div className="lm-field">
                <label>Payment Type</label>
                <CareaiSelect
                  name="Guarantor"
                  defaultValue=""
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
                {submitting ? "Submitting…" : "Submit"}
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
        <p>Patient lead has been successfully submitted.</p>
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
        <p className="lm-success-note">Thank you for completing the form.</p>
        <button
          type="button"
          className="lm-btn lm-btn-primary"
          onClick={resetWizard}
        >
          + Add New Request
        </button>
      </div>
    </div>
  );
}
