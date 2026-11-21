import { LEAD_STAGES } from "@/config/lead";
import { cn } from "@/lib/utils";

const portalCaseTracker = {
  line: (done: boolean, isLast: boolean) =>
    cn(
      "absolute top-3.5 left-1/2 z-[1] h-[3px] w-full bg-[#eeebf6]",
      isLast && "hidden",
      done && "bg-care-grad",
    ),
  dot: (state: "done" | "current" | "pending") =>
    cn(
      "z-[2] flex size-7 items-center justify-center rounded-full border-[3px] border-[#eeebf6] bg-[#eeebf6]",
      state === "done" &&
        "border-care-purple bg-care-grad [&_svg]:size-[13px] [&_svg]:text-white",
      state === "current" && "border-care-purple bg-white",
    ),
  label: (active: boolean) =>
    cn("text-xs font-bold text-[#b3acc7]", active && "text-care-ink"),
} as const;

type AgentCaseTrackerProps = {
  /** 1-based step in LEAD_STAGES. */
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
  if (stage < activeStage) return "done";
  if (stage === activeStage) return "current";
  return "pending";
}

export function AgentCaseTracker({ currentStage }: AgentCaseTrackerProps) {
  const labels = LEAD_STAGES.map((stage) => stage.label);

  return (
    <>
      {labels.map((label, index) => {
        const stage = index + 1;
        const state = stepState(stage, currentStage);
        const isLast = index === labels.length - 1;

        return (
          <div
            key={label}
            className="relative flex flex-1 flex-col items-center gap-2 text-center"
          >
            {!isLast ?
              <div
                className={portalCaseTracker.line(state === "done", isLast)}
              />
            : null}
            <div className={portalCaseTracker.dot(state)}>
              {state === "done" ?
                <CheckIcon />
              : state === "current" ?
                <div className="size-[9px] rounded-full bg-care-purple" />
              : null}
            </div>
            <div
              className={portalCaseTracker.label(
                state === "done" || state === "current",
              )}
            >
              {label}
            </div>
          </div>
        );
      })}
    </>
  );
}
