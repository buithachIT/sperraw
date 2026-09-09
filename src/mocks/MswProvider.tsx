"use client";

import { useEffect, useState, type ReactNode } from "react";

import { isMswEnabled } from "@/consts/msw";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";

async function restoreMockDatabase() {
  const { account, workspace } = useAuthStore.getState();
  if (!account) {
    return;
  }

  const { restoreSession } = await import("@/mocks/auth-db");
  restoreSession(account);

  if (!workspace) {
    return;
  }

  const { restoreWorkspace } = await import("@/mocks/onboarding-db");
  restoreWorkspace({
    id: workspace.id,
    ownerId: account.id,
    name: workspace.name,
    slug: workspace.slug,
  });
}

async function bootstrapSession() {
  if (isMswEnabled()) {
    const { startWorker } = await import("@/mocks/browser");
    await startWorker();
  }

  await Promise.all([
    useAuthStore.persist.rehydrate(),
    useOnboardingStore.persist.rehydrate(),
  ]);

  const { workspace } = useAuthStore.getState();
  useOnboardingStore.getState().syncFromWorkspace(workspace);

  if (isMswEnabled()) {
    await restoreMockDatabase();
  }
}

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void bootstrapSession().then(() => {
      if (!cancelled) {
        setReady(true);
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return null;
  }

  return children;
}
