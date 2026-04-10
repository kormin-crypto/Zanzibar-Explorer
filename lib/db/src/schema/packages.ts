import { pgTable, text, serial, real, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const packagesTable = pgTable("packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  minDays: integer("min_days").notNull(),
  maxDays: integer("max_days").notNull(),
  basePricePerPersonPerDay: real("base_price_per_person_per_day").notNull(),
  imageUrl: text("image_url").notNull(),
  galleryImages: text("gallery_images").array().notNull().default([]),
  accommodationId: integer("accommodation_id").notNull(),
  highlights: text("highlights").array().notNull().default([]),
  isFeatured: boolean("is_featured").notNull().default(false),
  rating: real("rating").notNull().default(4.5),
  reviewCount: integer("review_count").notNull().default(0),
});

export const packageActivitiesTable = pgTable("package_activities", {
  packageId: integer("package_id").notNull(),
  activityId: integer("activity_id").notNull(),
});

export const insertPackageSchema = createInsertSchema(packagesTable).omit({ id: true });
export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packagesTable.$inferSelect;
