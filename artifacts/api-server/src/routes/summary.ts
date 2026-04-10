import { Router, type IRouter } from "express";
import { db, packagesTable, activitiesTable, accommodationsTable, inquiriesTable, packageActivitiesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { GetSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/summary", async (_req, res): Promise<void> => {
  const [packages, activities, accommodations, inquiries] = await Promise.all([
    db.select().from(packagesTable),
    db.select().from(activitiesTable),
    db.select().from(accommodationsTable),
    db.select().from(inquiriesTable),
  ]);

  const categories = [...new Set(packages.map((p) => p.category))];
  const popularActivities = activities.filter((a) => a.isPopular).slice(0, 6);
  const featuredPkgs = packages.filter((p) => p.isFeatured).slice(0, 3);

  const featuredPackages = await Promise.all(
    featuredPkgs.map(async (pkg) => {
      const [accommodation] = await db
        .select()
        .from(accommodationsTable)
        .where(eq(accommodationsTable.id, pkg.accommodationId));

      const links = await db
        .select()
        .from(packageActivitiesTable)
        .where(eq(packageActivitiesTable.packageId, pkg.id));

      const activityIds = links.map((l) => l.activityId);
      const includedActivities =
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
        includedActivities,
      };
    })
  );

  res.json(
    GetSummaryResponse.parse({
      totalPackages: packages.length,
      totalActivities: activities.length,
      totalAccommodations: accommodations.length,
      totalInquiries: inquiries.length,
      categories,
      popularActivities,
      featuredPackages,
    })
  );
});

export default router;
