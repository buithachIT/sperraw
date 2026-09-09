"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

type StepActionsProps = {
  onBack?: () => void;
  continueLabel?: string;
  hideBack?: boolean;
  isSubmitting?: boolean;
};

export function StepActions({
  onBack,
  continueLabel = "Save and continue",
  hideBack = false,
  isSubmitting = false,
}: StepActionsProps) {
  return (
    <div className="mt-auto flex items-center justify-between gap-3 pt-10">
      {hideBack ? (
        <span />
      ) : (
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isSubmitting}
        >
          <ArrowLeft />
          Back
        </Button>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : continueLabel}
      </Button>
    </div>
  );
}
