"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { StepActions } from "@/features/onboarding/components/FormStep/StepActions";
import { StepLayout } from "@/features/onboarding/components/FormStep/StepLayout";
import {
  createInviteStepSchema,
  type InviteStepValues,
} from "@/features/onboarding/components/FormStep/StepInvite/StepInviteSchema";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";

export function StepInvite() {
  const account = useAuthStore((state) => state.account);
  const inviteEmails = useOnboardingStore((state) => state.inviteEmails);
  const setInviteEmails = useOnboardingStore((state) => state.setInviteEmails);
  const goNext = useOnboardingStore((state) => state.goNext);
  const goBack = useOnboardingStore((state) => state.goBack);

  const form = useForm<InviteStepValues>({
    resolver: zodResolver(createInviteStepSchema(account?.email ?? "")),
    defaultValues: { emails: inviteEmails },
  });

  return (
    <StepLayout stepIndex={2}>
      <form
        className="flex flex-1 flex-col"
        onSubmit={form.handleSubmit((values) => {
          setInviteEmails(values.emails);
          goNext();
        })}
      >
        <div className="grid gap-2">
          <Label htmlFor="emails">Teammate emails</Label>
          <textarea
            id="emails"
            rows={5}
            placeholder="alex@company.com, sam@company.com"
            className="border-input bg-surface-muted placeholder:text-text-muted focus-visible:border-primary focus-visible:ring-ring/20 w-full rounded-lg border px-3 py-2 text-sm outline-none focus-visible:ring-2"
            aria-invalid={Boolean(form.formState.errors.emails)}
            {...form.register("emails")}
          />
          <p className="text-muted-foreground text-xs">
            Optional. Separate addresses with commas or new lines.
          </p>
          {form.formState.errors.emails ? (
            <p className="text-destructive text-xs">
              {form.formState.errors.emails.message}
            </p>
          ) : null}
        </div>
        <StepActions onBack={goBack} continueLabel="Save and continue" />
      </form>
    </StepLayout>
  );
}
