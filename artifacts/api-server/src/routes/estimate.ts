import { Router, type IRouter } from "express";
import { db, activitiesTable, accommodationsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { EstimateCostBody, EstimateCostResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/estimate", async (req, res): Promise<void> => {
  const parsed = EstimateCostBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { accommodationId, activityIds, numberOfVisitors, numberOfDays } = parsed.data;

  const [accommodation] = await db
    .select()
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, accommodationId));

  if (!accommodation) {
    res.status(404).json({ error: "Accommodation not found" });
    return;
  }

  const activities =
    activityIds.length > 0
      ? await db.select().from(activitiesTable).where(inArray(activitiesTable.id, activityIds))
      : [];

  const accommodationCost = accommodation.pricePerNight * numberOfDays * Math.ceil(numberOfVisitors / 2);
  const activitiesCost = activities.reduce((sum, a) => sum + a.pricePerPerson * numberOfVisitors, 0);
  const guideCost = numberOfDays * 80;
  const subtotal = accommodationCost + activitiesCost + guideCost;
  const taxes = subtotal * 0.16;
  const totalCost = subtotal + taxes;
  const perPersonCost = totalCost / numberOfVisitors;

  const breakdown = [
    {
      label: "Accommodation",
      amount: accommodationCost,
      detail: `${accommodation.name} — $${accommodation.pricePerNight}/night × ${numberOfDays} nights`,
    },
    ...activities.map((a) => ({
      label: a.name,
      amount: a.pricePerPerson * numberOfVisitors,
      detail: `$${a.pricePerPerson}/person × ${numberOfVisitors} visitors`,
    })),
    {
      label: "Local Guide",
      amount: guideCost,
      detail: `$80/day × ${numberOfDays} days`,
    },
    {
      label: "Taxes & Fees (16%)",
      amount: taxes,
      detail: "Government tourism taxes",
    },
  ];

  res.json(
    EstimateCostResponse.parse({
      accommodationCost,
      activitiesCost,
      guideCost,
      subtotal,
      taxes,
      totalCost,
      perPersonCost,
      breakdown,
    })
  );
});

export default router;
