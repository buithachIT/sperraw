import { delay, http, HttpResponse } from "msw";

import { logoutSession, tryCreateAccount } from "@/mocks/auth-db";

export const authHandlers = [
  http.post("/api/auth/register", async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as {
      fullName?: string;
      email?: string;
      password?: string;
    };
    const result = tryCreateAccount(body);

    if (!result.ok) {
      return HttpResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }

    return HttpResponse.json({ user: result.user }, { status: 201 });
  }),

  http.post("/api/auth/logout", async () => {
    await delay(400);
    logoutSession();
    return HttpResponse.json({ ok: true });
  }),
];
