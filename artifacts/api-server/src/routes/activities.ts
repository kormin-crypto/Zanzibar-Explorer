import { Router, type IRouter } from "express";
import { db, activitiesTable } from "@workspace/db";
import { ListActivitiesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/activities", async (req, res): Promise<void> => {
  const activities = await db.select().from(activitiesTable).orderBy(activitiesTable.id);
  res.json(ListActivitiesResponse.parse(activities));
});

export default router;
