import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { rateLimit } from "express-rate-limit";
import { randomBytes } from "node:crypto";
import * as zod from "zod";
import { db, packagesTable, activitiesTable, accommodationsTable, inquiriesTable, packageActivitiesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const sessions = new Set<string>();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.admin_session as string | undefined;
  if (!token || !sessions.has(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

// ── Auth ──────────────────────────────────────────────────

router.post("/admin/login", loginLimiter, (req: Request, res: Response): void => {
  const parsed = zod.object({ password: zod.string() }).safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Password required" });
    return;
  }
  const expected = process.env.ADMIN_PASSWORD ?? "admin123";
  if (parsed.data.password !== expected) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  const token = randomBytes(32).toString("hex");
  sessions.add(token);
  res.cookie("admin_session", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  });
  res.json({ ok: true });
});

router.post("/admin/logout", (req: Request, res: Response): void => {
  const token = req.cookies?.admin_session as string | undefined;
  if (token) sessions.delete(token);
  res.clearCookie("admin_session");
  res.json({ ok: true });
});

router.use("/admin", adminAuth);

// ── Zod schemas ───────────────────────────────────────────

const PackageBody = zod.object({
  name: zod.string().min(1),
  slug: zod.string().min(1),
  tagline: zod.string().min(1),
  description: zod.string().min(1),
  category: zod.string().min(1),
  minDays: zod.number().int().positive(),
  maxDays: zod.number().int().positive(),
  basePricePerPersonPerDay: zod.number().positive(),
  imageUrl: zod.string().url().or(zod.literal("")),
  galleryImages: zod.array(zod.string()).default([]),
  accommodationId: zod.number().int().positive(),
  highlights: zod.array(zod.string()).default([]),
  isFeatured: zod.boolean().default(false),
  rating: zod.number().min(0).max(5).default(4.5),
  reviewCount: zod.number().int().min(0).default(0),
});

const ActivityBody = zod.object({
  name: zod.string().min(1),
  description: zod.string().min(1),
  category: zod.string().min(1),
  durationHours: zod.number().positive(),
  pricePerPerson: zod.number().positive(),
  imageUrl: zod.string().url().or(zod.literal("")),
  isPopular: zod.boolean().default(false),
});

const AccommodationBody = zod.object({
  name: zod.string().min(1),
  type: zod.string().min(1),
  description: zod.string().min(1),
  location: zod.string().min(1),
  pricePerNight: zod.number().positive(),
  imageUrl: zod.string().url().or(zod.literal("")),
  amenities: zod.array(zod.string()).default([]),
  stars: zod.number().int().min(1).max(5),
});

const IdParam = zod.object({ id: zod.coerce.number().int().positive() });

// ── Inquiries ─────────────────────────────────────────────

router.get("/admin/inquiries", async (_req, res): Promise<void> => {
  const rows = await db.select().from(inquiriesTable).orderBy(inquiriesTable.createdAt);
  res.json(rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.patch("/admin/inquiries/:id/status", async (req, res): Promise<void> => {
  const idParsed = IdParam.safeParse(req.params);
  if (!idParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = zod.object({ status: zod.enum(["pending", "contacted", "confirmed", "cancelled"]) }).safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: "Invalid status" }); return; }
  const [row] = await db.update(inquiriesTable).set({ status: bodyParsed.data.status }).where(eq(inquiriesTable.id, idParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/admin/inquiries/:id", async (req, res): Promise<void> => {
  const parsed = IdParam.safeParse(req.params);
  if (!parsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(inquiriesTable).where(eq(inquiriesTable.id, parsed.data.id));
  res.json({ ok: true });
});

// ── Packages ──────────────────────────────────────────────

router.get("/admin/packages", async (_req, res): Promise<void> => {
  const rows = await db.select().from(packagesTable).orderBy(packagesTable.id);
  res.json(rows);
});

router.post("/admin/packages", async (req, res): Promise<void> => {
  const parsed = PackageBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(packagesTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/admin/packages/:id", async (req, res): Promise<void> => {
  const idParsed = IdParam.safeParse(req.params);
  if (!idParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = PackageBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [row] = await db.update(packagesTable).set(bodyParsed.data).where(eq(packagesTable.id, idParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/packages/:id", async (req, res): Promise<void> => {
  const parsed = IdParam.safeParse(req.params);
  if (!parsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(packageActivitiesTable).where(eq(packageActivitiesTable.packageId, parsed.data.id));
  await db.delete(packagesTable).where(eq(packagesTable.id, parsed.data.id));
  res.json({ ok: true });
});

// ── Activities ────────────────────────────────────────────

router.get("/admin/activities", async (_req, res): Promise<void> => {
  const rows = await db.select().from(activitiesTable).orderBy(activitiesTable.id);
  res.json(rows);
});

router.post("/admin/activities", async (req, res): Promise<void> => {
  const parsed = ActivityBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(activitiesTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/admin/activities/:id", async (req, res): Promise<void> => {
  const idParsed = IdParam.safeParse(req.params);
  if (!idParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = ActivityBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [row] = await db.update(activitiesTable).set(bodyParsed.data).where(eq(activitiesTable.id, idParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/activities/:id", async (req, res): Promise<void> => {
  const parsed = IdParam.safeParse(req.params);
  if (!parsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(activitiesTable).where(eq(activitiesTable.id, parsed.data.id));
  res.json({ ok: true });
});

// ── Accommodations ────────────────────────────────────────

router.get("/admin/accommodations", async (_req, res): Promise<void> => {
  const rows = await db.select().from(accommodationsTable).orderBy(accommodationsTable.id);
  res.json(rows);
});

router.post("/admin/accommodations", async (req, res): Promise<void> => {
  const parsed = AccommodationBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const [row] = await db.insert(accommodationsTable).values(parsed.data).returning();
  res.status(201).json(row);
});

router.put("/admin/accommodations/:id", async (req, res): Promise<void> => {
  const idParsed = IdParam.safeParse(req.params);
  if (!idParsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  const bodyParsed = AccommodationBody.safeParse(req.body);
  if (!bodyParsed.success) { res.status(400).json({ error: bodyParsed.error.message }); return; }
  const [row] = await db.update(accommodationsTable).set(bodyParsed.data).where(eq(accommodationsTable.id, idParsed.data.id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(row);
});

router.delete("/admin/accommodations/:id", async (req, res): Promise<void> => {
  const parsed = IdParam.safeParse(req.params);
  if (!parsed.success) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(accommodationsTable).where(eq(accommodationsTable.id, parsed.data.id));
  res.json({ ok: true });
});

export default router;
