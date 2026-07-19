import z from "zod";

export const loginSchema = z.object({
    email: z.string().regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, "Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})