import { z } from "zod";

export const companyStepSchema = z.object({
  workspaceName: z
    .string()
    .trim()
    .min(2, "Workspace name must be at least 2 characters")
    .max(50, "Workspace name is too long"),
  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(32, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens"
    ),
});

export type CompanyStepValues = z.infer<typeof companyStepSchema>;
