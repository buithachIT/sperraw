import { delay, http, HttpResponse } from "msw";

import { getCurrentSession } from "@/mocks/auth-db";
import { authHandlers } from "@/mocks/auth-handlers";
import {
  getWorkspaceForOwner,
  isSlugTaken,
  tryCreateWorkspace,
} from "@/mocks/onboarding-db";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const handlers = [
  ...authHandlers,
  http.get("/api/onboarding/slug", async ({ request }) => {
    await delay(400);
    const value = new URL(request.url).searchParams.get("value")?.trim() ?? "";

    if (!value || !SLUG_PATTERN.test(value) || value.length < 3) {
      return HttpResponse.json({ available: false });
    }

    return HttpResponse.json({ available: !isSlugTaken(value) });
  }),

  http.get("/api/onboarding/workspace", async () => {
    await delay(400);
    const session = getCurrentSession();

    if (!session) {
      return HttpResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const workspace = getWorkspaceForOwner(session.id);

    if (!workspace) {
      return HttpResponse.json(
        { message: "Workspace not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({ workspace });
  }),

  http.post("/api/onboarding/workspace", async ({ request }) => {
    await delay(400);
    const session = getCurrentSession();

    if (!session) {
      return HttpResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as { name?: string; slug?: string };
    const result = tryCreateWorkspace({
      name: body.name,
      slug: body.slug,
      ownerId: session.id,
    });

    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return HttpResponse.json({ workspace: result.workspace }, { status: 201 });
  }),
];
