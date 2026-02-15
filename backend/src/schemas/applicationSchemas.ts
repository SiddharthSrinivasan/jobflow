import { z } from "zod";

export const createApplicationSchema = z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
    link: z.string().url().optional(),
    notes: z.string().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

