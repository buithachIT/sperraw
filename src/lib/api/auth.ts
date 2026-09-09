import { ApiError, readErrorMessage } from "@/lib/api/http";

export async function registerAccount(payload: {
  fullName: string;
  email: string;
  password: string;
}): Promise<{ id: string; fullName: string; email: string }> {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  const body = (await response.json()) as {
    user: { id: string; fullName: string; email: string };
  };
  return body.user;
}

export async function logoutAccount(): Promise<void> {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }
}
