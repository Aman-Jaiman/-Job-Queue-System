import { z } from "zod";

const emailSchema = z.object({
  to: z.string().email("Invalid email address"),

  subject: z.string().min(1, "Subject is required").max(150),

  text: z
    .string()
    .min(1, "Text is required")
    .max(100000, "Text must be at most 100000 characters"),

  html: z
    .string()
    .min(1, "HTML is required")
    .max(500000, "HTML must be at most 500000 characters")
    .optional(),
});

export default emailSchema;
