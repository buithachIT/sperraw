"use client";

import { Check, Info } from "lucide-react";

import { ONBOARDING_STEPS } from "@/consts/onboarding-step";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";
import { cn } from "@/lib/utils";

export function StepIndicator() {
  const stepIndex = useOnboardingStore((state) => state.stepIndex);
  const goTo = useOnboardingStore((state) => state.goTo);

  return (
    <aside className="bg-sidebar relative flex min-h-[560px] flex-col overflow-hidden rounded-[1.25rem] p-6 md:p-8">
      <div className="text-text-secondary flex gap-2.5 text-sm">
        <Info className="mt-0.5 size-4 shrink-0" />
        <p>
          Get started by setting up your workspace in a few quick steps. You can
          change these later.
        </p>
      </div>

      <ol className="mt-10 flex flex-col">
        {ONBOARDING_STEPS.map((step, index) => {
          const isComplete = index < stepIndex;
          const isCurrent = index === stepIndex;
          const isUpcoming = index > stepIndex;
          const isLast = index === ONBOARDING_STEPS.length - 1;

          return (
            <li key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  disabled={isUpcoming}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={step.title}
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-[color,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.45,0.05,0.15,1)]",
                    isComplete &&
                      "border-primary bg-primary text-primary-foreground",
                    isCurrent &&
                      "border-primary text-primary delay-200 bg-white shadow-[0_0_0_4px_var(--accent)]",
                    isUpcoming &&
                      "border-border-strong text-text-muted border-dashed bg-white"
                  )}
                  onClick={() => goTo(index)}
                >
                  {isComplete ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </button>
                {!isLast ? (
                  <span
                    aria-hidden="true"
                    className="relative my-1 min-h-10 w-0.5 flex-1 overflow-hidden rounded-full bg-[repeating-linear-gradient(to_bottom,var(--border-strong)_0_3px,transparent_3px_7px)]"
                  >
                    <span
                      className={cn(
                        "bg-primary absolute inset-x-0 top-0 h-full origin-top rounded-full will-change-transform transition-transform duration-700 ease-[cubic-bezier(0.45,0.05,0.15,1)]",
                        isComplete ? "scale-y-100" : "scale-y-0"
                      )}
                    />
                  </span>
                ) : null}
              </div>
              <div className={cn("pb-8", isLast && "pb-0")}>
                <p
                  className={cn(
                    "font-semibold transition-colors duration-500 ease-[cubic-bezier(0.45,0.05,0.15,1)]",
                    isUpcoming ? "text-text-muted" : "text-text"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-text-secondary mt-1 text-sm leading-5">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <GeometricArt />
    </aside>
  );
}

function GeometricArt() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none mt-auto flex justify-center pt-10 opacity-80"
    >
      <svg
        width="220"
        height="120"
        viewBox="0 0 220 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M40 78 L70 58 L100 78 L70 98 Z" fill="#f4c6e4" />
        <path d="M40 78 L70 58 L70 38 L40 58 Z" fill="#e89ac8" />
        <path d="M70 58 L100 78 L100 58 L70 38 Z" fill="#d66eae" />
        <path d="M108 62 L138 42 L168 62 L138 82 Z" fill="#c9d9f5" />
        <path d="M108 62 L138 42 L138 22 L108 42 Z" fill="#9eb6e8" />
        <path d="M138 42 L168 62 L168 42 L138 22 Z" fill="#7f9ad6" />
        <path d="M78 96 L108 78 L138 96 L108 114 Z" fill="#ead7f4" />
        <path d="M78 96 L108 78 L108 62 L78 80 Z" fill="#d3b6e6" />
        <path d="M108 78 L138 96 L138 80 L108 62 Z" fill="#b992d4" />
      </svg>
    </div>
  );
}
