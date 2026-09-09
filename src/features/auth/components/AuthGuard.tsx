"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  AUTH_REQUIRED_ROUTES,
  GUEST_ONLY_ROUTES,
  ROUTES,
  matchesPath,
} from "@/consts/routes";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";

export function AuthGuard({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const account = useAuthStore((state) => state.account);
  const workspace = useAuthStore((state) => state.workspace);
  const resetOnboarding = useOnboardingStore((state) => state.reset);

  const requiresAuth = matchesPath(pathname, AUTH_REQUIRED_ROUTES);
  const guestOnly = matchesPath(pathname, GUEST_ONLY_ROUTES);
  const nextRoute = workspace ? ROUTES.HOME : ROUTES.ONBOARDING;

  useEffect(() => {
    if (requiresAuth && !account) {
      resetOnboarding();
      router.replace(ROUTES.REGISTER);
      return;
    }

    if (guestOnly && account) {
      router.replace(nextRoute);
    }
  }, [account, guestOnly, nextRoute, requiresAuth, resetOnboarding, router]);

  if (requiresAuth && !account) {
    return null;
  }

  if (guestOnly && account) {
    return null;
  }

  return children;
}
