import { ApiError, readErrorMessage } from "@/lib/api/http";

export type Workspace = {
  id: string;
  name: string;
  slug: string;
};

export async function checkSlugAvailability(value: string): Promise<boolean> {
  const response = await fetch(
    `/api/onboarding/slug?value=${encodeURIComponent(value)}`
  );

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  const body = (await response.json()) as { available: boolean };
  return body.available;
}

export async function createWorkspace(payload: {
  name: string;
  slug: string;
}): Promise<Workspace> {
  const response = await fetch("/api/onboarding/workspace", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  const body = (await response.json()) as { workspace: Workspace };
  return body.workspace;
}

export async function getWorkspace(): Promise<Workspace | null> {
  const response = await fetch("/api/onboarding/workspace");

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }

  const body = (await response.json()) as { workspace: Workspace };
  return body.workspace;
}
