import { Router, type IRouter } from "express";
import { db, inquiriesTable } from "@workspace/db";
import { CreateInquiryBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/inquiries", async (req, res): Promise<void> => {
  const parsed = CreateInquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [inquiry] = await db
    .insert(inquiriesTable)
    .values({
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      packageId: parsed.data.packageId ?? null,
      numberOfVisitors: parsed.data.numberOfVisitors,
      numberOfDays: parsed.data.numberOfDays,
      preferredStartDate: parsed.data.preferredStartDate ?? null,
      message: parsed.data.message,
      activityIds: parsed.data.activityIds ?? [],
      accommodationId: parsed.data.accommodationId ?? null,
      estimatedTotal: parsed.data.estimatedTotal ?? null,
      status: "pending",
    })
    .returning();

  res.status(201).json({
    ...inquiry,
    createdAt: inquiry.createdAt.toISOString(),
  });
});

export default router;
