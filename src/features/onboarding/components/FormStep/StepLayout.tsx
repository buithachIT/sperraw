import type { ReactNode } from "react";

import { ONBOARDING_STEPS } from "@/consts/onboarding-step";

type StepLayoutProps = {
  stepIndex: number;
  children: ReactNode;
};

export function StepLayout({ stepIndex, children }: StepLayoutProps) {
  const step = ONBOARDING_STEPS[stepIndex];

  return (
    <div className="flex h-full min-h-[560px] flex-col px-6 py-8 md:px-10 md:py-10">
      <p className="text-primary text-xs font-semibold tracking-wider uppercase">
        Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
      </p>
      <h2 className="text-text mt-3 text-2xl font-semibold tracking-tight md:text-[1.75rem]">
        {step.heading}
      </h2>
      <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
        {step.subtitle}
      </p>
      <div className="mt-8 flex flex-1 flex-col">{children}</div>
    </div>
  );
}
