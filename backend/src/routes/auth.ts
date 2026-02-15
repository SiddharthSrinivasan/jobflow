import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db";
import { loginSchema, registerSchema } from "../schemas/authSchemas";

const router = Router();

router.post("/register", async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if(!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({where: { email }});
    if(existing) {
        return res.status(400).json({ error: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { email, passwordHash },
        select: {id: true, email: true , createdAt: true},
    });

    res.json({ user });
});

router.post("/login", async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if(!parsed.success) {
        return res.status(400).json({ error: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;

    const existing = await prisma.user.findUnique({where: { email }});
    if(!existing) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, existing.passwordHash);
    if(!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
        { userId: existing.id }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: "7d" }
    );

    res.json({ token });
});

export default router;