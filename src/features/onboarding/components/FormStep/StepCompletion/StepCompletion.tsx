"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/consts/routes";
import { StepLayout } from "@/features/onboarding/components/FormStep/StepLayout";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";

export function StepCompletion() {
  const router = useRouter();
  const workspaceName = useOnboardingStore((state) => state.workspaceName);
  const slug = useOnboardingStore((state) => state.slug);
  const goBack = useOnboardingStore((state) => state.goBack);

  return (
    <StepLayout stepIndex={3}>
      <div className="flex flex-1 flex-col">
        <dl className="border-border bg-surface-muted grid gap-3 rounded-xl border p-4 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Workspace</dt>
            <dd className="font-medium">{workspaceName}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">URL</dt>
            <dd className="font-medium">sperraw.app/w/{slug}</dd>
          </div>
        </dl>
        <div className="mt-auto flex items-center justify-between gap-3 pt-10">
          <Button type="button" variant="ghost" onClick={goBack}>
            Back
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={() => router.push(ROUTES.HOME)}
          >
            Go to workspace
          </Button>
        </div>
      </div>
    </StepLayout>
  );
}
