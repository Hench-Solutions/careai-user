export type CareaiSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

/** Build options from plain labels (value = label). */
export function careaiOptionsFromLabels(
  labels: readonly string[],
  empty?: { label: string; value?: string },
): CareaiSelectOption[] {
  const out: CareaiSelectOption[] = [];
  if (empty) {
    out.push({ value: empty.value ?? "", label: empty.label });
  }
  for (const label of labels) {
    out.push({ value: label, label });
  }
  return out;
}
