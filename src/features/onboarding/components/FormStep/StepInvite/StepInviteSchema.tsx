import { z } from "zod";

import { parseInviteEmails } from "@/lib/utils/parse-invite-emails";

export function createInviteStepSchema(adminEmail: string) {
  const normalizedAdmin = adminEmail.trim().toLowerCase();

  return z.object({
    emails: z.string().superRefine((value, ctx) => {
      const list = parseInviteEmails(value);
      const invalid = list.filter(
        (email) => !z.email().safeParse(email).success
      );

      if (invalid.length > 0) {
        ctx.addIssue({
          code: "custom",
          message: `Invalid email: ${invalid.join(", ")}`,
        });
      }

      if (normalizedAdmin && list.includes(normalizedAdmin)) {
        ctx.addIssue({
          code: "custom",
          message: "You cannot invite your own admin email",
        });
      }
    }),
  });
}

export type InviteStepValues = z.infer<
  ReturnType<typeof createInviteStepSchema>
>;
