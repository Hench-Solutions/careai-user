type AgentCaseTrackerProps = {
  /** 1 = Registered, 4 = all stages complete (Closed). */
  currentStage: number;
};

function CheckIcon() {
  return (
    <svg fill="none" stroke="#fff" strokeWidth="3" viewBox="0 0 24 24">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function stepState(
  stage: number,
  activeStage: number,
): "done" | "current" | "pending" {
  if (activeStage >= 5) return "done";
  if (stage < activeStage) return "done";
  if (stage === activeStage) return "current";
  return "pending";
}

export function AgentCaseTracker({ currentStage }: AgentCaseTrackerProps) {
  const labels = [
    "Registered",
    "Under Review",
    "Treatment Ongoing",
    "Closed",
  ] as const;

  return (
    <>
      {labels.map((label, index) => {
        const stage = index + 1;
        const state = stepState(stage, currentStage);
        const isLast = index === labels.length - 1;

        return (
          <div
            key={label}
            className={
              state === "done" ? "cs-tstep done"
              : state === "current" ?
                "cs-tstep current"
              : "cs-tstep"
            }
          >
            {!isLast ?
              <div className="cs-tline" />
            : null}
            <div className="cs-tdot">
              {state === "done" ?
                <CheckIcon />
              : state === "current" ?
                <div className="dotinner" />
              : null}
            </div>
            <div className="cs-tlabel">{label}</div>
          </div>
        );
      })}
    </>
  );
}
