import Link from "next/link";
import {
  JOURNEY_STAGES,
  JOURNEY_STAGE_TIPS,
  journeyStageIndex,
} from "@/lib/journey-stage";
import type { JourneyStage } from "@/lib/user-profile";

type JourneyStageTrackerProps = {
  stage: JourneyStage;
};

export function JourneyStageTracker({ stage }: JourneyStageTrackerProps) {
  const currentIndex = journeyStageIndex(stage);
  const tip = JOURNEY_STAGE_TIPS[stage];
  const progress =
    JOURNEY_STAGES.length > 1
      ? (currentIndex / (JOURNEY_STAGES.length - 1)) * 100
      : 0;

  return (
    <section className="mb-8 rounded-2xl border border-white/10 bg-[#1B4332]/40 p-6 shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#E8D5B7]">
        Your journey
      </p>

      <div className="relative mt-6">
        <div
          className="absolute left-0 right-0 top-4 h-0.5 bg-white/10"
          aria-hidden
        />
        <div
          className="absolute left-0 top-4 h-0.5 bg-[#E8D5B7]/60 transition-all"
          style={{ width: `${progress}%` }}
          aria-hidden
        />

        <ol className="relative flex justify-between gap-1">
          {JOURNEY_STAGES.map((item, index) => {
            const isCurrent = index === currentIndex;
            const isComplete = index < currentIndex;

            return (
              <li
                key={item.id}
                className="flex min-w-0 flex-1 flex-col items-center text-center"
              >
                <span
                  className={[
                    "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    isCurrent
                      ? "border-[#1B4332] bg-[#1B4332] text-white shadow-[0_0_0_3px_rgba(27,67,50,0.35)]"
                      : isComplete
                        ? "border-[#E8D5B7] bg-[#E8D5B7] text-[#1B4332]"
                        : "border-white/20 bg-[#0d2818] text-white/40",
                  ].join(" ")}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {index + 1}
                </span>
                <span
                  className={[
                    "mt-2 hidden text-[10px] font-medium leading-tight sm:block lg:text-xs",
                    isCurrent
                      ? "font-semibold text-white"
                      : isComplete
                        ? "text-[#E8D5B7]/80"
                        : "text-white/40",
                  ].join(" ")}
                >
                  {item.label}
                </span>
              </li>
            );
          })}
        </ol>

        <p className="mt-3 text-center text-sm font-semibold text-white sm:hidden">
          {JOURNEY_STAGES[currentIndex]?.label}
        </p>
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
          Next step
        </p>
        <Link
          href={tip.href}
          className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#E8D5B7] transition hover:text-[#F0E4CE]"
        >
          {tip.text}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}
