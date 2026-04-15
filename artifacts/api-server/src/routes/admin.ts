import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, packagesTable, activitiesTable, accommodationsTable, inquiriesTable, packageActivitiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const provided = req.headers["x-admin-password"];
  if (provided !== password) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use("/admin", adminAuth);

// ── Inquiries ─────────────────────────────────────────────
router.get("/admin/inquiries", async (_req, res): Promise<void> => {
  const rows = await db.select().from(inquiriesTable).orderBy(inquiriesTable.createdAt);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.patch("/admin/inquiries/:id/status", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body as { status: string };
  const allowed = ["pending", "contacted", "confirmed", "cancelled"];
  if (!allowed.includes(status)) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }
  const [row] = await db.update(inquiriesTable).set({ status }).where(eq(inquiriesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/admin/inquiries/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  await db.delete(inquiriesTable).where(eq(inquiriesTable.id, id));
  res.json({ ok: true });
});

// ── Packages ──────────────────────────────────────────────
router.get("/admin/packages", async (_req, res): Promise<void> => {
  const rows = await db.select().from(packagesTable).orderBy(packagesTable.id);
  res.json(rows);
});

router.post("/admin/packages", async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const [row] = await db.insert(packagesTable).values({
    name: String(body.name),
    slug: String(body.slug),
    tagline: String(body.tagline),
    description: String(body.description),
    category: String(body.category),
    minDays: Number(body.minDays),
    maxDays: Number(body.maxDays),
    basePricePerPersonPerDay: Number(body.basePricePerPersonPerDay),
    imageUrl: String(body.imageUrl ?? ""),
    galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages.map(String) : [],
    accommodationId: Number(body.accommodationId),
    highlights: Array.isArray(body.highlights) ? body.highlights.map(String) : [],
    isFeatured: Boolean(body.isFeatured),
    rating: Number(body.rating ?? 4.5),
    reviewCount: Number(body.reviewCount ?? 0),
  }).returning();
  res.status(201).json(row);
});

router.put("/admin/packages/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const body = req.body as Record<string, unknown>;
  const [row] = await db.update(packagesTable).set({
    name: String(body.name),
    slug: String(body.slug),
    tagline: String(body.tagline),
    description: String(body.description),
    category: String(body.category),
    minDays: Number(body.minDays),
    maxDays: Number(body.maxDays),
    basePricePerPersonPerDay: Number(body.basePricePerPersonPerDay),
    imageUrl: String(body.imageUrl ?? ""),
    galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages.map(String) : [],
    accommodationId: Number(body.accommodationId),
    highlights: Array.isArray(body.highlights) ? body.highlights.map(String) : [],
    isFeatured: Boolean(body.isFeatured),
    rating: Number(body.rating ?? 4.5),
    reviewCount: Number(body.reviewCount ?? 0),
  }).where(eq(packagesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/packages/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  await db.delete(packageActivitiesTable).where(eq(packageActivitiesTable.packageId, id));
  await db.delete(packagesTable).where(eq(packagesTable.id, id));
  res.json({ ok: true });
});

// ── Activities ────────────────────────────────────────────
router.get("/admin/activities", async (_req, res): Promise<void> => {
  const rows = await db.select().from(activitiesTable).orderBy(activitiesTable.id);
  res.json(rows);
});

router.post("/admin/activities", async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const [row] = await db.insert(activitiesTable).values({
    name: String(body.name),
    description: String(body.description),
    category: String(body.category),
    durationHours: Number(body.durationHours),
    pricePerPerson: Number(body.pricePerPerson),
    imageUrl: String(body.imageUrl ?? ""),
    isPopular: Boolean(body.isPopular),
  }).returning();
  res.status(201).json(row);
});

router.put("/admin/activities/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const body = req.body as Record<string, unknown>;
  const [row] = await db.update(activitiesTable).set({
    name: String(body.name),
    description: String(body.description),
    category: String(body.category),
    durationHours: Number(body.durationHours),
    pricePerPerson: Number(body.pricePerPerson),
    imageUrl: String(body.imageUrl ?? ""),
    isPopular: Boolean(body.isPopular),
  }).where(eq(activitiesTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/activities/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  await db.delete(activitiesTable).where(eq(activitiesTable.id, id));
  res.json({ ok: true });
});

// ── Accommodations ────────────────────────────────────────
router.get("/admin/accommodations", async (_req, res): Promise<void> => {
  const rows = await db.select().from(accommodationsTable).orderBy(accommodationsTable.id);
  res.json(rows);
});

router.post("/admin/accommodations", async (req, res): Promise<void> => {
  const body = req.body as Record<string, unknown>;
  const [row] = await db.insert(accommodationsTable).values({
    name: String(body.name),
    type: String(body.type),
    description: String(body.description),
    location: String(body.location),
    pricePerNight: Number(body.pricePerNight),
    imageUrl: String(body.imageUrl ?? ""),
    amenities: Array.isArray(body.amenities) ? body.amenities.map(String) : [],
    stars: Number(body.stars),
  }).returning();
  res.status(201).json(row);
});

router.put("/admin/accommodations/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const body = req.body as Record<string, unknown>;
  const [row] = await db.update(accommodationsTable).set({
    name: String(body.name),
    type: String(body.type),
    description: String(body.description),
    location: String(body.location),
    pricePerNight: Number(body.pricePerNight),
    imageUrl: String(body.imageUrl ?? ""),
    amenities: Array.isArray(body.amenities) ? body.amenities.map(String) : [],
    stars: Number(body.stars),
  }).where(eq(accommodationsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/accommodations/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  await db.delete(accommodationsTable).where(eq(accommodationsTable.id, id));
  res.json({ ok: true });
});

export default router;
