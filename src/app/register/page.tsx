import { AppHeader } from "@/features/auth/components/AppHeader";
import { RegisterForm } from "@/features/auth/components/RegisterForm/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="border-border mx-auto w-full max-w-xl overflow-hidden rounded-2xl border bg-white shadow-sm">
      <AppHeader />
      <div className="flex min-h-[560px] flex-col px-6 py-8 md:px-10 md:py-10">
        <p className="text-primary text-xs font-semibold tracking-wider uppercase">
          Create account
        </p>
        <h1 className="text-text mt-3 text-2xl font-semibold tracking-tight md:text-[1.75rem]">
          Create your admin account
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-6">
          You will be the admin of the workspace you set up next. Use your
          company email so teammates can recognize you.
        </p>
        <div className="mt-8 flex flex-1 flex-col">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
