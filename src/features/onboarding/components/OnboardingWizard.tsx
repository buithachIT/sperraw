"use client";

import { AppHeader } from "@/features/auth/components/AppHeader";
import { StepCompany } from "@/features/onboarding/components/FormStep/StepCompany/StepCompany";
import { StepCompletion } from "@/features/onboarding/components/FormStep/StepCompletion/StepCompletion";
import { StepCulture } from "@/features/onboarding/components/FormStep/StepCulture/StepCulture";
import { StepInvite } from "@/features/onboarding/components/FormStep/StepInvite/StepInvite";
import { StepIndicator } from "@/features/onboarding/components/StepIndicator";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";

const STEP_PANELS = [StepCompany, StepCulture, StepInvite, StepCompletion];

export function OnboardingWizard() {
  const stepIndex = useOnboardingStore((state) => state.stepIndex);
  const StepPanel = STEP_PANELS[stepIndex] ?? StepCompany;

  return (
    <div className="border-border mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-white shadow-sm">
      <AppHeader />
      <div className="grid md:grid-cols-[minmax(240px,38%)_1fr]">
        <div className="p-3 md:p-4 md:pr-0">
          <StepIndicator />
        </div>
        <main className="min-w-0">
          <StepPanel />
        </main>
      </div>
    </div>
  );
}
