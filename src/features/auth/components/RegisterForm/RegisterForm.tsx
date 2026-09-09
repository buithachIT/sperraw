"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/consts/routes";
import {
  registerFormSchema,
  type RegisterFormValues,
} from "@/features/auth/components/RegisterForm/RegisterFormSchema";
import { useAuthStore } from "@/features/auth/store/use-auth-store";
import { ApiError } from "@/lib/api/http";
import { registerAccount } from "@/lib/api/auth";

export function RegisterForm() {
  const router = useRouter();
  const account = useAuthStore((state) => state.account);
  const setAccount = useAuthStore((state) => state.setAccount);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      fullName: account?.fullName ?? "",
      email: account?.email ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  const { formState, handleSubmit, register, setError } = form;

  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={handleSubmit(async (values) => {
        try {
          const user = await registerAccount({
            fullName: values.fullName,
            email: values.email,
            password: values.password,
          });
          setAccount(user);
          toast.success("Account created", {
            description: "Continue to set up your workspace.",
          });
          router.push(ROUTES.ONBOARDING);
        } catch (error) {
          const message =
            error instanceof ApiError
              ? error.message
              : "Could not create your account. Try again.";
          setError("email", { message });
        }
      })}
    >
      <div className="grid gap-5">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            autoComplete="name"
            aria-invalid={Boolean(formState.errors.fullName)}
            {...register("fullName")}
          />
          {formState.errors.fullName ? (
            <p className="text-destructive text-xs">
              {formState.errors.fullName.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(formState.errors.email)}
            {...register("email")}
          />
          {formState.errors.email ? (
            <p className="text-destructive text-xs">
              {formState.errors.email.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(formState.errors.password)}
            {...register("password")}
          />
          {formState.errors.password ? (
            <p className="text-destructive text-xs">
              {formState.errors.password.message}
            </p>
          ) : null}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(formState.errors.confirmPassword)}
            {...register("confirmPassword")}
          />
          {formState.errors.confirmPassword ? (
            <p className="text-destructive text-xs">
              {formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </div>
      </div>
      <div className="mt-auto flex items-center justify-end pt-10">
        <Button type="submit" size="lg" disabled={formState.isSubmitting}>
          {formState.isSubmitting ? "Saving..." : "Create account"}
        </Button>
      </div>
    </form>
  );
}
