"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AuthAccount = {
  id: string;
  fullName: string;
  email: string;
};

export type AuthWorkspace = {
  id: string;
  name: string;
  slug: string;
};

type AuthState = {
  account: AuthAccount | null;
  workspace: AuthWorkspace | null;
  setAccount: (account: AuthAccount) => void;
  setWorkspace: (workspace: AuthWorkspace) => void;
  clearAccount: () => void;
};

export const AUTH_STORAGE_KEY = "sperraw-auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      workspace: null,
      setAccount: (account) => set({ account }),
      setWorkspace: (workspace) => set({ workspace }),
      clearAccount: () => set({ account: null, workspace: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => sessionStorage),
      skipHydration: true,
      partialize: (state) => ({
        account: state.account,
        workspace: state.workspace,
      }),
    }
  )
);
