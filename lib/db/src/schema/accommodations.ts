import { pgTable, text, serial, real, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const accommodationsTable = pgTable("accommodations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  pricePerNight: real("price_per_night").notNull(),
  imageUrl: text("image_url").notNull(),
  amenities: text("amenities").array().notNull().default([]),
  stars: integer("stars").notNull(),
});

export const insertAccommodationSchema = createInsertSchema(accommodationsTable).omit({ id: true });
export type InsertAccommodation = z.infer<typeof insertAccommodationSchema>;
export type Accommodation = typeof accommodationsTable.$inferSelect;
