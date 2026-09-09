import { z } from "zod";

export const cultureStepSchema = z.object({
  forwardingConfirmed: z.boolean().refine((value) => value === true, {
    message: "Confirm you have access to the forwarding address",
  }),
});

export type CultureStepValues = z.infer<typeof cultureStepSchema>;
