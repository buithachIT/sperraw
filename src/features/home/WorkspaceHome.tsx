"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/consts/routes";
import { AppHeader } from "@/features/auth/components/AppHeader";

type WorkspaceHomeProps = {
  name: string;
  slug: string;
  showFinishSetup: boolean;
};

export function WorkspaceHome({
  name,
  slug,
  showFinishSetup,
}: WorkspaceHomeProps) {
  return (
    <div className="border-border mx-auto w-full max-w-6xl overflow-hidden rounded-2xl border bg-white shadow-sm">
      <AppHeader />
      <main className="flex min-h-[560px] flex-col px-6 py-8 md:px-10 md:py-10">
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">
          Workspace
        </p>
        <h1 className="text-text mt-3 text-2xl font-semibold tracking-tight md:text-[1.75rem]">
          {name}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
          sperraw.app/w/{slug}
        </p>
        <div className="border-border bg-surface-muted mt-8 rounded-xl border p-4 text-sm">
          <p className="font-medium">Your workspace is ready</p>
          <p className="text-muted-foreground mt-1 leading-6">
            Recognition & Rewards for this company will live here. Invite your
            team and start sending kudos from this home.
          </p>
        </div>
        {showFinishSetup ? (
          <div className="mt-8">
            <Button asChild>
              <Link href={ROUTES.ONBOARDING}>Finish workspace setup</Link>
            </Button>
          </div>
        ) : null}
      </main>
    </div>
  );
}
