"use client";

import { useCallback, useRef, useState } from "react";

import type { CareaiSelectHandle } from "@/components/careai/careai-select";

import { CareaiDateField } from "@/components/careai/careai-date-field";
import {
  careaiOptionsFromLabels,
  CareaiSelect,
} from "@/components/careai/careai-select";
import { careaiMockCaseRegistrationMemberId } from "@/config/careai-mock";
import { cn } from "@/lib/utils";

type WizardStep = 1 | 2 | 3;

function stepClass(current: WizardStep, step: WizardStep) {
  if (step < current) return "lm-step done";
  if (step === current) return "lm-step current";
  return "lm-step";
}

export function AgentCaseRegistrationContent() {
  const [step, setStep] = useState<WizardStep>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [memberId, setMemberId] = useState(careaiMockCaseRegistrationMemberId);
  const [idFileLabel, setIdFileLabel] = useState("No file chosen");
  const [medFileLabel, setMedFileLabel] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const treatmentRef = useRef<CareaiSelectHandle>(null);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const rand = Math.floor(100_000_000 + Math.random() * 900_000_000);
    setMemberId(`MEM${rand}`);
    setShowSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetWizard = () => {
    setShowSuccess(false);
    setStep(1);
    setIdFileLabel("No file chosen");
    setMedFileLabel(null);
    setStepError(null);
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
                Personal
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
                  <div className="lm-form-title">Personal Information</div>
                </div>
                <div className="lm-step-pill">Step 1 of 3</div>
              </div>

              <div className="lm-grid2">
                <div className="lm-field">
                  <label>
                    First Name <span className="req">*</span>
                  </label>
                  <input
                    ref={firstNameRef}
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="lm-field">
                  <label>Middle Name</label>
                  <input type="text" placeholder="Middle Name" />
                </div>
                <div className="lm-field">
                  <label>Last Name</label>
                  <input type="text" placeholder="Last Name" />
                </div>
                <div className="lm-field">
                  <label>Email Address</label>
                  <input type="email" placeholder="name@example.com" />
                </div>
                <div className="lm-field">
                  <label>Date of Birth</label>
                  <CareaiDateField />
                </div>
                <div className="lm-field">
                  <label>Gender</label>
                  <CareaiSelect
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels(
                      ["Male", "Female", "Other"],
                      { label: "--Select--" },
                    )}
                  />
                </div>
                <div className="lm-field">
                  <label>Nationality</label>
                  <CareaiSelect
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels(
                      ["India", "UAE", "UK", "Other"],
                      { label: "--Select--" },
                    )}
                  />
                </div>
                <div className="lm-field">
                  <label>Contact Number</label>
                  <input type="tel" placeholder="Phone" />
                </div>
              </div>

              <div className="lm-field">
                <label>Select Category</label>
                <div className="lm-radio-row">
                  <label className="lm-radio">
                    <input type="radio" name="category" /> Priority
                  </label>
                  <label className="lm-radio">
                    <input type="radio" name="category" /> Emergency
                  </label>
                  <label className="lm-radio">
                    <input type="radio" name="category" defaultChecked /> Normal
                  </label>
                </div>
              </div>

              <div className="lm-grid2">
                <div className="lm-field">
                  <label>Patient Location</label>
                  <CareaiSelect
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels([], {
                      label: "--Select--",
                    })}
                  />
                </div>
                <div className="lm-field">
                  <label>ID Document</label>
                  <CareaiSelect
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels(
                      ["Passport", "National ID"],
                      { label: "--Select--" },
                    )}
                  />
                </div>
              </div>

              <div className="lm-field">
                <label htmlFor="id-doc-input">
                  Upload Identification Document
                </label>
                <label className="lm-file-row" htmlFor="id-doc-input">
                  <input
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
                    required
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels(
                      ["Cardiology", "Orthopedic", "Oncology", "Neurology"],
                      { label: "--Select--" },
                    )}
                  />
                </div>
                <div className="lm-field">
                  <label>Department</label>
                  <CareaiSelect
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
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels([], {
                      label: "--Select--",
                    })}
                  />
                </div>
              </div>

              <div className="lm-field">
                <label htmlFor="med-reports-input">Medical Reports</label>
                <label
                  className={cn("lm-upload", medFileLabel && "has-file")}
                  htmlFor="med-reports-input"
                >
                  <input
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
                <textarea placeholder="Enter any special requirements, notes, or additional information..." />
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
                  <label>Guarantor</label>
                  <CareaiSelect
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels(
                      ["Self", "Insurance", "Corporate / TPA"],
                      { label: "--Select--" },
                    )}
                  />
                </div>
                <div className="lm-field">
                  <label>Payee</label>
                  <CareaiSelect
                    defaultValue=""
                    placeholder="--Select--"
                    options={careaiOptionsFromLabels(
                      ["Patient", "Insurance Company", "Employer"],
                      { label: "--Select--" },
                    )}
                  />
                </div>
              </div>

              <div className="lm-form-actions">
                <button
                  type="button"
                  className="lm-btn lm-btn-ghost"
                  onClick={() => goStep(2)}
                >
                  Previous
                </button>
                <button type="submit" className="lm-btn lm-btn-primary">
                  Submit
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
            <div className="lm-member-id">{memberId}</div>
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
