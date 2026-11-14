"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { CareaiDateFieldHandle } from "@/components/careai/careai-date-field";
import type { CareaiSelectHandle } from "@/components/careai/careai-select";

import { CareaiDateField } from "@/components/careai/careai-date-field";
import { CareaiSelect } from "@/components/careai/careai-select";
import { careaiOptionsFromLabels } from "@/components/careai/select-options";
import {
  DEFAULT_CALLING_CD,
  DOCUMENT_TYPE_LEGACY_OPTIONS,
  GENDER_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  SELF_PAY_GUARANTOR_FALLBACK,
  TREATMENT_TYPE_OPTIONS,
} from "@/config/lead-master-options";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
  fetchMasterDropdown,
  registerLead,
  uploadLeadDocuments,
} from "@/services/lead";

type WizardStep = 1 | 2 | 3;
type SelectOption = { value: string; label: string };

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

function withBlank(options: SelectOption[]): SelectOption[] {
  if (options.some((o) => o.value === "")) return options;
  return [{ value: "", label: "--Select--" }, ...options];
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
  const [sourceOptions, setSourceOptions] = useState<SelectOption[]>([]);
  const [docTypeOptions, setDocTypeOptions] = useState<SelectOption[]>([
    ...DOCUMENT_TYPE_LEGACY_OPTIONS,
  ]);
  const [nationalityOptions, setNationalityOptions] = useState<SelectOption[]>(
    careaiOptionsFromLabels(["India", "UAE", "UK", "Other"], {
      label: "--Select--",
    }),
  );
  const [locationOptions, setLocationOptions] = useState<SelectOption[]>(
    careaiOptionsFromLabels([], { label: "--Select--" }),
  );
  const [guarantorOptions, setGuarantorOptions] = useState<SelectOption[]>(
    SELF_PAY_GUARANTOR_FALLBACK,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<CareaiDateFieldHandle>(null);
  const treatmentRef = useRef<CareaiSelectHandle>(null);
  const idFileRef = useRef<HTMLInputElement>(null);
  const medFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [sources, docs, nations, locations] = await Promise.all([
        fetchMasterDropdown("DrpSource"),
        fetchMasterDropdown("ddlDocumentType", "LEAD_ID"),
        fetchMasterDropdown("ddlNationality"),
        fetchMasterDropdown("ddlPatientLocation"),
      ]);
      if (cancelled) return;
      if (sources.length) setSourceOptions(withBlank(sources));
      if (docs.length) setDocTypeOptions(withBlank(docs));
      if (nations.length) setNationalityOptions(withBlank(nations));
      if (locations.length) setLocationOptions(withBlank(locations));
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!paymentMode) {
        setGuarantorOptions(SELF_PAY_GUARANTOR_FALLBACK);
        return;
      }
      const rows = await fetchMasterDropdown("drpGuarantor", paymentMode);
      if (cancelled) return;
      setGuarantorOptions(
        rows.length ? withBlank(rows) : SELF_PAY_GUARANTOR_FALLBACK,
      );
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
      setStepError("First name is required to continue.");
      firstNameRef.current?.focus();
      return;
    }
    goStep(2);
  };

  const goToStep3 = () => {
    const treatment = treatmentRef.current?.value?.trim() ?? "";
    if (!treatment) {
      setStepError("Please select a treatment type.");
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
      setStepError("First name is required.");
      goStep(1);
      firstNameRef.current?.focus();
      return;
    }
    if (!treatmentType) {
      setStepError("Please select a treatment type.");
      goStep(2);
      treatmentRef.current?.focus();
      return;
    }

    setSubmitting(true);
    setStepError(null);
    try {
      const result = await registerLead({
        FirstName: firstName,
        MiddleName: formValue(form, "MiddleName"),
        LastName: formValue(form, "LastName"),
        EmailId: formValue(form, "EmailId"),
        Dob: formValue(form, "Dob") || dobRef.current?.value?.trim() || "",
        Gender: formValue(form, "Gender"),
        Nationality: formValue(form, "Nationality"),
        CallingCd: formValue(form, "CallingCd") || DEFAULT_CALLING_CD,
        MobileNo: formValue(form, "MobileNo"),
        LeadType: formValue(form, "LeadType") || "Normal",
        PatientLocation: formValue(form, "PatientLocation"),
        DocumentType: formValue(form, "DocumentType"),
        DocumentNo: formValue(form, "DocumentNo"),
        Source: formValue(form, "Source"),
        TreatmentType: treatmentType,
        Department: formValue(form, "Department"),
        ProviderCd: formValue(form, "ProviderCd"),
        BranchCd: formValue(form, "BranchCd"),
        DoctorCd: formValue(form, "DoctorCd"),
        CaseNote: formValue(form, "CaseNote"),
        Diagnosis: formValue(form, "Diagnosis"),
        Treatment: formValue(form, "Treatment"),
        IcdCode: formValue(form, "IcdCode"),
        IcdDesc: formValue(form, "IcdDesc"),
        CptCode: formValue(form, "CptCode"),
        CptDesc: formValue(form, "CptDesc"),
        PaymentMode: formValue(form, "PaymentMode"),
        Guarantor: formValue(form, "Guarantor"),
      });

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
          setStepError(
            "Case saved, but document upload failed. You can attach files later from case details.",
          );
        }
      }

      setShowSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err instanceof ApiError ?
          err.message
        : "Could not submit the case. Please try again.";
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
          {step === 1 ?
            <div className="active">
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
                    options={[...GENDER_OPTIONS]}
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
                    <input type="radio" name="LeadType" value="Priority" />{" "}
                    Priority
                  </label>
                  <label className="lm-radio">
                    <input type="radio" name="LeadType" value="Emergency" />{" "}
                    Emergency
                  </label>
                  <label className="lm-radio">
                    <input
                      type="radio"
                      name="LeadType"
                      value="Normal"
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
          : null}

          {step === 2 ?
            <div className="active">
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
                    options={[...TREATMENT_TYPE_OPTIONS]}
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
          : null}

          {step === 3 ?
            <div className="active">
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
                    options={[...PAYMENT_MODE_OPTIONS]}
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
          : null}
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
