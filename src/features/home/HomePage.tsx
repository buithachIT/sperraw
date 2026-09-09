"use client";

import { useEffect } from "react";
import Link from "next/link";

import { AppLogo } from "@/components/AppLogo";
import { ONBOARDING_STEPS } from "@/consts/onboarding-step";
import { ROUTES } from "@/consts/routes";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { WorkspaceHome } from "@/features/home/WorkspaceHome";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";
import { getWorkspace } from "@/lib/api/onboarding";

export function HomePage() {
  const account = useAuthStore((state) => state.account);
  const workspace = useAuthStore((state) => state.workspace);
  const setWorkspace = useAuthStore((state) => state.setWorkspace);
  const stepIndex = useOnboardingStore((state) => state.stepIndex);

  useEffect(() => {
    if (!account || workspace) {
      return;
    }

    let cancelled = false;

    void getWorkspace()
      .then((result) => {
        if (!cancelled && result) {
          setWorkspace(result);
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [account, setWorkspace, workspace]);

  if (account && workspace) {
    return (
      <WorkspaceHome
        name={workspace.name}
        slug={workspace.slug}
        showFinishSetup={stepIndex < ONBOARDING_STEPS.length - 1}
      />
    );
  }

  return (
    <main className="bg-surface mx-auto flex min-h-full max-w-lg flex-col gap-4 px-4 py-16">
      <div className="flex items-center gap-3">
        <AppLogo size={40} priority />
        <h1 className="text-3xl font-semibold tracking-tight">Sperraw</h1>
      </div>
      <p className="text-muted-foreground">
        Recognition & Rewards for your company. Create a workspace to get
        started.
      </p>
      <Link
        href={account ? ROUTES.ONBOARDING : ROUTES.REGISTER}
        className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex w-fit rounded-md px-4 py-2 text-sm font-medium"
      >
        {account ? "Continue setup" : "Create workspace"}
      </Link>
      {account ? null : (
        <p className="text-text-muted text-sm">Already have an account?</p>
      )}
    </main>
  );
}
