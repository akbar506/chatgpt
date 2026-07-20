import z from "zod";

export const messageSchema = z.object({
    content: z.string().min(1, "Message content is required"),
    thinkingLevel: z.enum(["Minimal", "Low", "Medium", "High"]).default("Medium"),
    stream: z.boolean().default(false),
})