import type { LeadField } from "@/config/lead";

import {
  LEAD_CALLING_CODE_PATTERN,
  LEAD_EMAIL_PATTERN,
  LEAD_MAX_LENGTHS,
  LEAD_MESSAGES,
  LEAD_PHONE_MAX_DIGITS,
  LEAD_REQUIRED_FIELDS,
  LEAD_UPLOAD_EXTENSIONS,
  LEAD_UPLOAD_MAX_FILE_MB,
} from "@/config/lead";

/** `field` is the form field name, or an upload key, so the form can mark it. */
export type LeadIssue = {
  step: 1 | 2 | 3;
  message: string;
  field: LeadField | typeof ID_FILE | typeof MEDICAL_FILES;
};

export const ID_FILE = "idFile";
export const MEDICAL_FILES = "medicalFiles";

type LeadValues = Partial<Record<LeadField, string>>;

const isBlank = (value: string | undefined) => !value?.trim();

/** A real calendar date (yyyy-MM-dd) that is not in the future. */
function isPastDate(iso: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return false;
  const [year, month, day] = match.slice(1).map(Number) as [
    number,
    number,
    number,
  ];
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date <= new Date()
  );
}

/** "91", " +91 " and "+91" all become "+91"; anything without digits becomes "". */
export function normalizeCallingCode(value: string): string {
  const digits = value.replace(/[^\d-]/g, "");
  return /\d/.test(digits) ? `+${digits}` : "";
}

/** Every problem in the lead form, in the order the fields appear. */
export function validateLead(values: LeadValues): LeadIssue[] {
  const issues: LeadIssue[] = [];
  for (const { field, label, step } of LEAD_REQUIRED_FIELDS) {
    if (isBlank(values[field])) {
      issues.push({ step, field, message: LEAD_MESSAGES.required(label) });
    }
  }
  for (const { field, label, max } of LEAD_MAX_LENGTHS) {
    if ((values[field]?.trim().length ?? 0) > max) {
      issues.push({
        step: 1,
        field,
        message: LEAD_MESSAGES.tooLong(label, max),
      });
    }
  }
  const dob = values.Dob?.trim();
  if (dob && !isPastDate(dob)) {
    issues.push({ step: 1, field: "Dob", message: LEAD_MESSAGES.dobInvalid });
  }
  const email = values.EmailId?.trim();
  if (email && !LEAD_EMAIL_PATTERN.test(email)) {
    issues.push({
      step: 1,
      field: "EmailId",
      message: LEAD_MESSAGES.emailInvalid,
    });
  }
  const calling = values.CallingCd?.trim();
  if (calling && !LEAD_CALLING_CODE_PATTERN.test(calling)) {
    issues.push({
      step: 1,
      field: "CallingCd",
      message: LEAD_MESSAGES.callingCodeInvalid,
    });
  }
  const phone = values.MobileNo?.trim();
  if (phone && !new RegExp(`^\\d{1,${LEAD_PHONE_MAX_DIGITS}}$`).test(phone)) {
    issues.push({
      step: 1,
      field: "MobileNo",
      message: LEAD_MESSAGES.phoneInvalid,
    });
  }
  return issues;
}

/** Problems with the chosen files that the API would otherwise only report after the case is saved. */
export function validateUploads(
  files: readonly File[],
  step: 1 | 2,
  field: typeof ID_FILE | typeof MEDICAL_FILES,
): LeadIssue[] {
  const issues: LeadIssue[] = [];
  for (const file of files) {
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    if (file.size === 0) {
      issues.push({ step, field, message: LEAD_MESSAGES.fileEmpty(file.name) });
    } else if (
      !(LEAD_UPLOAD_EXTENSIONS as readonly string[]).includes(extension)
    ) {
      issues.push({
        step,
        field,
        message: LEAD_MESSAGES.fileTypeNotAllowed(file.name),
      });
    } else if (file.size > LEAD_UPLOAD_MAX_FILE_MB * 1024 * 1024) {
      issues.push({
        step,
        field,
        message: LEAD_MESSAGES.fileTooLarge(file.name),
      });
    }
  }
  return issues;
}
