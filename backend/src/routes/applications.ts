import { Router } from "express";
import { prisma } from "../db";
import { requireAuth, AuthRequest } from "../middleware/requireAuth";
import {
    createApplicationSchema,
    updateApplicationSchema,
} from "../schemas/applicationSchemas";

const router = Router();

router.use(requireAuth);

export default router;

router.post("/", async (req: AuthRequest, res) => {
  const parsed = createApplicationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid Input value...",
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  const { company, role, status, link, notes } = parsed.data;

  const application = await prisma.jobApplication.create({
    data: {
      company,
      role,
      ...(status ? { status } : {}),
      ...(link ? { link } : {}),
      ...(notes ? { notes } : {}),
      userId: req.userId!,
    },
  });

  return res.status(201).json(application);
});


router.get("/", async (req: AuthRequest, res) => {
    const { status, search } = req.query;

    const application = await prisma.jobApplication.findMany({
        where: {
            userId: req.userId!,
            ...(status ? { status: status as any } : {}),
            ...(search ? {
                OR: [
                    { company: { contains: String(search), mode: "insensitive" } },
                    { role: { contains: String(search), mode: "insensitive" } },
                ],
            }
            : {}),
        },
        orderBy: {createdAt: "desc"},
    });

    res.json(application);
});

router.get("/analytics", async(req: AuthRequest, res) => {
    const grouped = await prisma.jobApplication.groupBy({
        by: ["status"],
        where: {
            userId: req.userId!,
        },
        _count: {
            status: true,
        },
    });

    const total = await prisma.jobApplication.count({
        where: {
            userId: req.userId!,
        },
    })

    const lastUpdated = await prisma.jobApplication.findFirst({
        where: {
            userId: req.userId!,
        },
        orderBy: {
            updatedAt: "desc",
        },
        select: {
            updatedAt: true,
        }
    });

    const result = {
        APPLIED: 0,
        INTERVIEW: 0,
        OFFER: 0,
        REJECTED: 0,
    }

    for (const row of grouped) {
        result[row.status] = row._count.status;
    }

    res.json({
        total,
        lastUpdated: lastUpdated?.updatedAt ?? null,
        byStatus: result,
    });
});

router.patch("/:id", async (req: AuthRequest, res) => {
  const parsed = updateApplicationSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const { id } = req.params as { id: string };

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId: req.userId! },
  });

  if (!existing) {
    return res.status(404).json({ error: "Application not found" });
  }

  const cleanedData = Object.fromEntries(
    Object.entries(parsed.data).filter(([_, value]) => value !== undefined)
  );

  const updated = await prisma.jobApplication.update({
    where: { id },
    data: cleanedData,
  });

  res.json(updated);
});

router.delete("/:id", async (req: AuthRequest, res) => {
  const { id } = req.params as { id: string };

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId: req.userId! },
  });

  if (!existing) {
    return res.status(404).json({ error: "Application not found" });
  }

  await prisma.jobApplication.delete({
    where: { id },
  });

  res.json({ success: true });
});


            