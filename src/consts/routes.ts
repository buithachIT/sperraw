export const ROUTES = {
  HOME: "/",
  REGISTER: "/register",
  ONBOARDING: "/onboarding",
} as const;

export const AUTH_REQUIRED_ROUTES = [ROUTES.ONBOARDING] as const;
export const GUEST_ONLY_ROUTES = [ROUTES.REGISTER] as const;

export function matchesPath(
  pathname: string,
  paths: readonly string[]
): boolean {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}
