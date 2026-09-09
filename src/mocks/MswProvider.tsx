"use client";

import { useEffect, useState, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";

async function bootstrapSession() {
  if (process.env.NODE_ENV === "development") {
    const { startWorker } = await import("@/mocks/browser");
    await startWorker();
  }

  await Promise.all([
    useAuthStore.persist.rehydrate(),
    useOnboardingStore.persist.rehydrate(),
  ]);

  const { account, workspace } = useAuthStore.getState();
  useOnboardingStore.getState().syncFromWorkspace(workspace);

  if (process.env.NODE_ENV !== "development") {
    return;
  }

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
