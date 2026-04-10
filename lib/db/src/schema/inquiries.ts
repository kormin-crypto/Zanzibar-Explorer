import { pgTable, text, serial, integer, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const inquiriesTable = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  packageId: integer("package_id"),
  numberOfVisitors: integer("number_of_visitors").notNull(),
  numberOfDays: integer("number_of_days").notNull(),
  preferredStartDate: text("preferred_start_date"),
  message: text("message").notNull(),
  status: text("status").notNull().default("pending"),
  activityIds: integer("activity_ids").array().notNull().default([]),
  accommodationId: integer("accommodation_id"),
  estimatedTotal: real("estimated_total"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiriesTable).omit({ id: true, createdAt: true, status: true });
export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiriesTable.$inferSelect;
