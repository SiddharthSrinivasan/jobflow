import { z } from "zod";

export const createApplicationSchema = z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    status: z.enum(["APPLIED", "INTERVIEW", "OFFER", "REJECTED"]).optional(),
    link: z.string().url("Link must be a valid URL").optional().or(z.literal("")),
    notes: z.string().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

