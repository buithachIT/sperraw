"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepActions } from "@/features/onboarding/components/FormStep/StepActions";
import { StepLayout } from "@/features/onboarding/components/FormStep/StepLayout";
import {
  companyStepSchema,
  type CompanyStepValues,
} from "@/features/onboarding/components/FormStep/StepCompany/StepCompanySchema";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { useOnboardingStore } from "@/features/onboarding/store/use-onboarding-store";
import { ApiError } from "@/lib/api/http";
import { checkSlugAvailability, createWorkspace } from "@/lib/api/onboarding";
import { slugify } from "@/lib/utils/slugify";

export function StepCompany() {
  const workspaceName = useOnboardingStore((state) => state.workspaceName);
  const slug = useOnboardingStore((state) => state.slug);
  const workspaceId = useOnboardingStore((state) => state.workspaceId);
  const setWorkspace = useOnboardingStore((state) => state.setWorkspace);
  const setSessionWorkspace = useAuthStore((state) => state.setWorkspace);
  const goNext = useOnboardingStore((state) => state.goNext);

  const form = useForm<CompanyStepValues>({
    resolver: zodResolver(companyStepSchema),
    defaultValues: { workspaceName, slug },
  });

  const { control, setError, clearErrors, setValue, formState, handleSubmit } =
    form;
  const slugValue = useWatch({ control, name: "slug" });

  useEffect(() => {
    const parsed = companyStepSchema.shape.slug.safeParse(slugValue);
    if (!parsed.success) {
      return;
    }

    let cancelled = false;
    const timeoutId = window.setTimeout(async () => {
      try {
        const available = await checkSlugAvailability(parsed.data);
        if (cancelled) {
          return;
        }
        if (!available && parsed.data !== slug) {
          setError("slug", { message: "Slug này đã được dùng" });
          return;
        }
        clearErrors("slug");
      } catch {
        if (!cancelled) {
          setError("slug", { message: "Không kiểm tra được slug. Thử lại." });
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [slug, slugValue, setError, clearErrors]);

  return (
    <StepLayout stepIndex={0}>
      <form
        className="flex flex-1 flex-col"
        onSubmit={handleSubmit(async (values) => {
          if (workspaceId) {
            goNext();
            return;
          }

          try {
            const workspace = await createWorkspace({
              name: values.workspaceName,
              slug: values.slug,
            });
            setWorkspace(workspace);
            setSessionWorkspace(workspace);
            toast.success("Workspace created", {
              description: "Continue to finish setting up your workspace.",
            });
            goNext();
          } catch (error) {
            const message =
              error instanceof ApiError
                ? error.message
                : "Không tạo được workspace. Thử lại.";
            setError("slug", { message });
          }
        })}
      >
        <div className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="workspaceName">Workspace name</Label>
            <Input
              id="workspaceName"
              aria-invalid={Boolean(formState.errors.workspaceName)}
              {...form.register("workspaceName", {
                onChange: (event) => {
                  if (!formState.dirtyFields.slug) {
                    setValue("slug", slugify(event.target.value), {
                      shouldValidate: true,
                    });
                  }
                },
              })}
            />
            {formState.errors.workspaceName ? (
              <p className="text-destructive text-xs">
                {formState.errors.workspaceName.message}
              </p>
            ) : null}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="slug">Workspace URL</Label>
            <div className="flex items-center gap-2">
              <span className="text-text-muted shrink-0 text-sm">
                sperraw.app/w/
              </span>
              <Input
                id="slug"
                aria-invalid={Boolean(formState.errors.slug)}
                {...form.register("slug")}
              />
            </div>
            {formState.errors.slug ? (
              <p className="text-destructive text-xs">
                {formState.errors.slug.message}
              </p>
            ) : null}
          </div>
        </div>
        <StepActions hideBack isSubmitting={formState.isSubmitting} />
      </form>
    </StepLayout>
  );
}
