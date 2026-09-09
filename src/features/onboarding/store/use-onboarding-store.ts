"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ONBOARDING_STEPS } from "@/consts/onboarding-step";
import type { AuthWorkspace } from "@/features/auth/store/use-auth-store";

type OnboardingState = {
  stepIndex: number;
  workspaceId: string | null;
  workspaceName: string;
  slug: string;
  forwardingConfirmed: boolean;
  inviteEmails: string;
  goNext: () => void;
  goBack: () => void;
  goTo: (index: number) => void;
  setWorkspace: (workspace: { id: string; name: string; slug: string }) => void;
  setForwardingConfirmed: (value: boolean) => void;
  setInviteEmails: (value: string) => void;
  syncFromWorkspace: (workspace: AuthWorkspace | null) => void;
  reset: () => void;
};

const emptyOnboarding = {
  stepIndex: 0,
  workspaceId: null,
  workspaceName: "",
  slug: "",
  forwardingConfirmed: false,
  inviteEmails: "",
};

export const ONBOARDING_STORAGE_KEY = "sperraw-onboarding";

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...emptyOnboarding,
      goNext: () =>
        set({
          stepIndex: Math.min(get().stepIndex + 1, ONBOARDING_STEPS.length - 1),
        }),
      goBack: () => set({ stepIndex: Math.max(get().stepIndex - 1, 0) }),
      goTo: (index) => {
        if (index <= get().stepIndex) {
          set({ stepIndex: index });
        }
      },
      setWorkspace: (workspace) =>
        set({
          workspaceId: workspace.id,
          workspaceName: workspace.name,
          slug: workspace.slug,
        }),
      setForwardingConfirmed: (forwardingConfirmed) =>
        set({ forwardingConfirmed }),
      setInviteEmails: (inviteEmails) => set({ inviteEmails }),
      syncFromWorkspace: (workspace) => {
        if (!workspace) {
          return;
        }

        const current = get();
        set({
          workspaceId: current.workspaceId ?? workspace.id,
          workspaceName: current.workspaceName || workspace.name,
          slug: current.slug || workspace.slug,
          stepIndex:
            current.workspaceId || workspace.id
              ? Math.max(current.stepIndex, 1)
              : current.stepIndex,
        });
      },
      reset: () => set(emptyOnboarding),
    }),
    {
      name: ONBOARDING_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: (state) => ({
        stepIndex: state.stepIndex,
        workspaceId: state.workspaceId,
        workspaceName: state.workspaceName,
        slug: state.slug,
        forwardingConfirmed: state.forwardingConfirmed,
        inviteEmails: state.inviteEmails,
      }),
    }
  )
);
