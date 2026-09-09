"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleHelp, LogOut } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AppLogo } from "@/components/AppLogo";
import { ROUTES } from "@/consts/routes";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";
import { logoutAccount } from "@/lib/api/auth";

export function AppHeader() {
  const router = useRouter();
  const account = useAuthStore((state) => state.account);
  const clearAccount = useAuthStore((state) => state.clearAccount);
  const resetOnboarding = useOnboardingStore((state) => state.reset);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      await logoutAccount();
      clearAccount();
      resetOnboarding();
      toast.success("Logged out");
      router.replace(ROUTES.HOME);
    } catch {
      toast.error("Could not log out. Try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="border-border flex items-center justify-between gap-4 border-b px-6 py-4 md:px-8">
      <Link href={ROUTES.HOME} className="flex items-center gap-2.5">
        <AppLogo size={32} />
        <span className="text-lg font-semibold tracking-tight">Sperraw</span>
      </Link>
      <div className="flex items-center gap-1 sm:gap-2">
        {account ? (
          <p className="text-text-muted mr-2 hidden text-xs sm:block">
            Login as {account.email}
          </p>
        ) : null}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-text-secondary cursor-pointer"
        >
          <CircleHelp />
          <span className="hidden md:inline">Help Assistance</span>
        </Button>
        {account ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-text-secondary cursor-pointer"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            <LogOut />
            <span className="hidden md:inline">
              {isLoggingOut ? "Logging out..." : "Log out"}
            </span>
          </Button>
        ) : null}
      </div>
    </header>
  );
}
