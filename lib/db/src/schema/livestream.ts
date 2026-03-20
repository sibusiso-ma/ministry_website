import { pgTable, serial, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const livestreamTable = pgTable("livestream", {
  id: serial("id").primaryKey(),
  isLive: boolean("is_live").notNull().default(false),
  youtubeStreamUrl: text("youtube_stream_url"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  title: text("title"),
  description: text("description"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertLivestreamSchema = createInsertSchema(livestreamTable).omit({ id: true });
export type InsertLivestream = z.infer<typeof insertLivestreamSchema>;
export type Livestream = typeof livestreamTable.$inferSelect;
