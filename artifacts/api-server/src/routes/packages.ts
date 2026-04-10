import { Router, type IRouter } from "express";
import { db, packagesTable, activitiesTable, accommodationsTable, packageActivitiesTable } from "@workspace/db";
import { eq, and, gte, lte, inArray } from "drizzle-orm";
import {
  ListPackagesResponse,
  GetPackageResponse,
  GetPackageParams,
  ListPackagesQueryParams,
  GetFeaturedPackagesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function buildPackageWithDetails(pkg: typeof packagesTable.$inferSelect) {
  const accommodation = await db
    .select()
    .from(accommodationsTable)
    .where(eq(accommodationsTable.id, pkg.accommodationId))
    .then((rows) => rows[0]);

  const packageActivityLinks = await db
    .select()
    .from(packageActivitiesTable)
    .where(eq(packageActivitiesTable.packageId, pkg.id));

  const activityIds = packageActivityLinks.map((pa) => pa.activityId);
  const activities =
    activityIds.length > 0
      ? await db.select().from(activitiesTable).where(inArray(activitiesTable.id, activityIds))
      : [];

  return {
    ...pkg,
    accommodation: accommodation ?? {
      id: 0,
      name: "Standard",
      type: "hotel",
      description: "",
      location: "Zanzibar",
      pricePerNight: 100,
      imageUrl: "",
      amenities: [],
      stars: 3,
    },
    includedActivities: activities,
  };
}

router.get("/packages/featured", async (req, res): Promise<void> => {
  const featured = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.isFeatured, true))
    .orderBy(packagesTable.id);

  const result = await Promise.all(featured.map(buildPackageWithDetails));
  res.json(GetFeaturedPackagesResponse.parse(result));
});

router.get("/packages", async (req, res): Promise<void> => {
  const queryParsed = ListPackagesQueryParams.safeParse(req.query);
  const query = queryParsed.success ? queryParsed.data : {};

  let conditions = [];
  if (query.category) conditions.push(eq(packagesTable.category, query.category));
  if (query.minDays) conditions.push(gte(packagesTable.minDays, query.minDays));
  if (query.maxDays) conditions.push(lte(packagesTable.maxDays, query.maxDays));
  if (query.maxPrice) conditions.push(lte(packagesTable.basePricePerPersonPerDay, query.maxPrice));

  const pkgs =
    conditions.length > 0
      ? await db
          .select()
          .from(packagesTable)
          .where(and(...conditions))
      : await db.select().from(packagesTable).orderBy(packagesTable.id);

  const result = await Promise.all(pkgs.map(buildPackageWithDetails));
  res.json(ListPackagesResponse.parse(result));
});

router.get("/packages/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPackageParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: "Invalid package id" });
    return;
  }

  const [pkg] = await db
    .select()
    .from(packagesTable)
    .where(eq(packagesTable.id, params.data.id));

  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }

  const result = await buildPackageWithDetails(pkg);
  res.json(GetPackageResponse.parse(result));
});

export default router;
