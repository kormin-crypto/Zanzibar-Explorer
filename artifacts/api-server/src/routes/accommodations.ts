import { Router, type IRouter } from "express";
import { db, accommodationsTable } from "@workspace/db";
import { ListAccommodationsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/accommodations", async (req, res): Promise<void> => {
  const accommodations = await db.select().from(accommodationsTable).orderBy(accommodationsTable.id);
  res.json(ListAccommodationsResponse.parse(accommodations));
});

export default router;
