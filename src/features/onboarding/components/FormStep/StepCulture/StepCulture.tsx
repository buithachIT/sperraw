"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Copy } from "lucide-react";
import { Controller, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FORWARDING_ADDRESS } from "@/consts/onboarding-step";
import { StepActions } from "@/features/onboarding/components/FormStep/StepActions";
import { StepLayout } from "@/features/onboarding/components/FormStep/StepLayout";
import { GuidanceCards } from "@/features/onboarding/components/FormStep/StepCulture/GuidanceCards";
import {
  cultureStepSchema,
  type CultureStepValues,
} from "@/features/onboarding/components/FormStep/StepCulture/StepCultureSchema";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";

export function StepCulture() {
  const forwardingConfirmed = useOnboardingStore(
    (state) => state.forwardingConfirmed
  );
  const setForwardingConfirmed = useOnboardingStore(
    (state) => state.setForwardingConfirmed
  );
  const goNext = useOnboardingStore((state) => state.goNext);
  const goBack = useOnboardingStore((state) => state.goBack);
  const [copied, setCopied] = useState(false);

  const form = useForm<CultureStepValues>({
    resolver: zodResolver(cultureStepSchema),
    defaultValues: { forwardingConfirmed },
  });

  async function copyAddress() {
    await navigator.clipboard.writeText(FORWARDING_ADDRESS);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <StepLayout stepIndex={1}>
      <form
        className="flex flex-1 flex-col"
        onSubmit={form.handleSubmit((values) => {
          setForwardingConfirmed(values.forwardingConfirmed);
          goNext();
        })}
      >
        <p className="text-muted-foreground text-sm">
          Your designated forwarding address for this workspace is:
        </p>
        <div className="relative mt-3">
          <Input
            readOnly
            value={FORWARDING_ADDRESS}
            className="pr-12 font-medium"
            aria-label="Forwarding address"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-text-secondary absolute top-1/2 right-1.5 size-8 -translate-y-1/2"
            onClick={copyAddress}
            aria-label="Copy forwarding address"
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>

        <div className="bg-surface-muted text-text mt-4 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm">
          <span className="bg-primary text-primary-foreground flex size-5 items-center justify-center rounded-full">
            <Check className="size-3" strokeWidth={3} />
          </span>
          Email forwarding has been activated
        </div>

        <Controller
          control={form.control}
          name="forwardingConfirmed"
          render={({ field, fieldState }) => (
            <div className="mt-6">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="forwardingConfirmed"
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  className="mt-0.5"
                />
                <Label
                  htmlFor="forwardingConfirmed"
                  className="text-text text-sm leading-5 font-normal"
                >
                  I confirm that I have access to this email and will set up
                  forwarding from my current provider.
                </Label>
              </div>
              {fieldState.error ? (
                <p className="text-destructive mt-2 text-xs">
                  {fieldState.error.message}
                </p>
              ) : null}
            </div>
          )}
        />

        <GuidanceCards />
        <StepActions onBack={goBack} />
      </form>
    </StepLayout>
  );
}
