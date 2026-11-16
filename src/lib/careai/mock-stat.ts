/** Safe read for dashboard KPI mock objects ({ value, badge }). */
type CareaiMockStat = {
  value: string;
  badge: string;
};

const EMPTY_STAT: CareaiMockStat = { value: "—", badge: "" };

export function readCareaiMockStat(
  stat: CareaiMockStat | undefined | null,
): CareaiMockStat {
  if (!stat) return EMPTY_STAT;
  return {
    value: stat.value ?? EMPTY_STAT.value,
    badge: stat.badge ?? EMPTY_STAT.badge,
  };
}
