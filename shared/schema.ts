import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  category: varchar("category").notNull().default("personal"),
  targetDate: timestamp("target_date"),
  progress: integer("progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  isTeamGoal: boolean("is_team_goal").default(false),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const milestones = pgTable("milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  isCompleted: boolean("is_completed").default(false),
  goalId: varchar("goal_id").notNull().references(() => goals.id),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const goalCollaborators = pgTable("goal_collaborators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalId: varchar("goal_id").notNull().references(() => goals.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  role: varchar("role").default("collaborator"), // "owner" or "collaborator"
  createdAt: timestamp("created_at").defaultNow(),
});

export const progressEntries = pgTable("progress_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalId: varchar("goal_id").notNull().references(() => goals.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  previousProgress: integer("previous_progress").default(0),
  newProgress: integer("new_progress").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dailyCheckins = pgTable("daily_checkins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  mood: varchar("mood").notNull(), // "great", "good", "okay", "struggling"
  notes: text("notes"),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // "goal_created", "milestone_completed", "progress_updated", etc.
  userId: varchar("user_id").notNull().references(() => users.id),
  goalId: varchar("goal_id").references(() => goals.id),
  milestoneId: varchar("milestone_id").references(() => milestones.id),
  data: jsonb("data"), // Additional activity-specific data
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports
export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertProgressEntrySchema = createInsertSchema(progressEntries).omit({
  id: true,
  createdAt: true,
});

export const insertDailyCheckinSchema = createInsertSchema(dailyCheckins).omit({
  id: true,
  createdAt: true,
  date: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

// Type exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Goal = typeof goals.$inferSelect;
export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type GoalCollaborator = typeof goalCollaborators.$inferSelect;
export type ProgressEntry = typeof progressEntries.$inferSelect;
export type InsertProgressEntry = z.infer<typeof insertProgressEntrySchema>;
export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type InsertDailyCheckin = z.infer<typeof insertDailyCheckinSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
