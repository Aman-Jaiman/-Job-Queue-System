import { z } from "zod";

const emailSchema = z.object({
    to: z.string().email("Invalid email address"),

    subject: z
        .string()
        .min(1, "Subject is required")
        .max(150),

    text: z
        .string()
        .min(1, "Text is required"),

    html: z
        .string()
        .min(1, "HTML is required"),
});

export default emailSchema;