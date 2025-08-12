import {
  users,
  goals,
  milestones,
  goalCollaborators,
  progressEntries,
  dailyCheckins,
  activities,
  photoMemories,
  fitnessTracking,
  type User,
  type UpsertUser,
  type Goal,
  type InsertGoal,
  type Milestone,
  type InsertMilestone,
  type GoalCollaborator,
  type ProgressEntry,
  type InsertProgressEntry,
  type DailyCheckin,
  type InsertDailyCheckin,
  type Activity,
  type InsertActivity,
  type PhotoMemory,
  type InsertPhotoMemory,
  type FitnessTracking,
  type InsertFitnessTracking,
} from "@shared/schema";
import { randomUUID } from "crypto";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Goal operations
  getGoals(userId: string): Promise<Goal[]>;
  getGoal(id: string): Promise<Goal | undefined>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, updates: Partial<Goal>): Promise<Goal>;
  deleteGoal(id: string): Promise<void>;
  
  // Milestone operations
  getMilestones(goalId: string): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone>;
  deleteMilestone(id: string): Promise<void>;
  
  // Progress operations
  getProgressEntries(goalId: string): Promise<ProgressEntry[]>;
  createProgressEntry(entry: InsertProgressEntry): Promise<ProgressEntry>;
  
  // Collaboration operations
  getGoalCollaborators(goalId: string): Promise<GoalCollaborator[]>;
  addCollaborator(goalId: string, userId: string, role?: string): Promise<GoalCollaborator>;
  removeCollaborator(goalId: string, userId: string): Promise<void>;
  getTeamGoals(userId: string): Promise<Goal[]>;
  
  // Daily checkin operations
  getTodayCheckin(userId: string): Promise<DailyCheckin | undefined>;
  createDailyCheckin(checkin: InsertDailyCheckin): Promise<DailyCheckin>;
  
  // Activity operations
  getRecentActivities(userId: string, limit?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Analytics operations
  getUserStats(userId: string): Promise<{
    activeGoals: number;
    completedWeek: number;
    teamGoals: number;
    avgProgress: number;
    totalSteps: number;
  }>;

  // Photo memory operations
  getPhotoMemories(userId: string, goalId?: string): Promise<PhotoMemory[]>;
  createPhotoMemory(memory: InsertPhotoMemory): Promise<PhotoMemory>;
  deletePhotoMemory(id: string): Promise<void>;

  // Fitness tracking operations
  getFitnessData(userId: string, days?: number): Promise<FitnessTracking[]>;
  getTodayFitness(userId: string): Promise<FitnessTracking | undefined>;
  createFitnessEntry(entry: InsertFitnessTracking): Promise<FitnessTracking>;
  updateFitnessEntry(id: string, updates: Partial<FitnessTracking>): Promise<FitnessTracking>;
}

import { db } from "./db";
import { eq, and, or, gte, lt, desc, inArray } from "drizzle-orm";

export class DatabaseStorage implements IStorage {

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Goal operations
  async getGoals(userId: string): Promise<Goal[]> {
    return await db.select().from(goals).where(eq(goals.userId, userId));
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    const [goal] = await db.select().from(goals).where(eq(goals.id, id));
    return goal;
  }

  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const [goal] = await db.insert(goals).values(goalData).returning();

    // Create activity
    await this.createActivity({
      type: "goal_created",
      userId: goal.userId,
      goalId: goal.id,
      data: { goalTitle: goal.title },
    });

    return goal;
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal> {
    const [goal] = await db
      .update(goals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(goals.id, id))
      .returning();

    if (!goal) throw new Error("Goal not found");

    // Create activity for progress updates
    if (updates.progress !== undefined) {
      await this.createActivity({
        type: "progress_updated",
        userId: goal.userId,
        goalId: goal.id,
        data: { 
          goalTitle: goal.title,
          newProgress: updates.progress 
        },
      });
    }

    return goal;
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }

  // Milestone operations
  async getMilestones(goalId: string): Promise<Milestone[]> {
    return await db
      .select()
      .from(milestones)
      .where(eq(milestones.goalId, goalId))
      .orderBy(milestones.order);
  }

  async createMilestone(milestoneData: InsertMilestone): Promise<Milestone> {
    const [milestone] = await db.insert(milestones).values(milestoneData).returning();
    return milestone;
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone> {
    const updateData = {
      ...updates,
      ...(updates.isCompleted ? { completedAt: new Date() } : {}),
    };

    const [milestone] = await db
      .update(milestones)
      .set(updateData)
      .where(eq(milestones.id, id))
      .returning();

    if (!milestone) throw new Error("Milestone not found");

    // Create activity for milestone completion
    if (updates.isCompleted) {
      const goal = await this.getGoal(milestone.goalId);
      await this.createActivity({
        type: "milestone_completed",
        userId: goal?.userId || "",
        goalId: milestone.goalId,
        milestoneId: milestone.id,
        data: { 
          milestoneTitle: milestone.title,
          goalTitle: goal?.title 
        },
      });
    }

    return milestone;
  }

  async deleteMilestone(id: string): Promise<void> {
    await db.delete(milestones).where(eq(milestones.id, id));
  }

  // Progress operations
  async getProgressEntries(goalId: string): Promise<ProgressEntry[]> {
    return await db
      .select()
      .from(progressEntries)
      .where(eq(progressEntries.goalId, goalId))
      .orderBy(desc(progressEntries.createdAt));
  }

  async createProgressEntry(entryData: InsertProgressEntry): Promise<ProgressEntry> {
    const [entry] = await db.insert(progressEntries).values(entryData).returning();
    return entry;
  }

  // Collaboration operations
  async getGoalCollaborators(goalId: string): Promise<GoalCollaborator[]> {
    return await db.select().from(goalCollaborators).where(eq(goalCollaborators.goalId, goalId));
  }

  async addCollaborator(goalId: string, userId: string, role: string = "collaborator"): Promise<GoalCollaborator> {
    const [collaborator] = await db
      .insert(goalCollaborators)
      .values({ goalId, userId, role })
      .returning();
    return collaborator;
  }

  async removeCollaborator(goalId: string, userId: string): Promise<void> {
    await db
      .delete(goalCollaborators)
      .where(and(eq(goalCollaborators.goalId, goalId), eq(goalCollaborators.userId, userId)));
  }

  async getTeamGoals(userId: string): Promise<Goal[]> {
    const collaboratorGoals = await db
      .select({ goalId: goalCollaborators.goalId })
      .from(goalCollaborators)
      .where(eq(goalCollaborators.userId, userId));

    const goalIds = collaboratorGoals.map(c => c.goalId);

    return await db
      .select()
      .from(goals)
      .where(
        and(
          eq(goals.isTeamGoal, true),
          or(eq(goals.userId, userId), inArray(goals.id, goalIds))
        )
      );
  }

  // Daily checkin operations
  async getTodayCheckin(userId: string): Promise<DailyCheckin | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [checkin] = await db
      .select()
      .from(dailyCheckins)
      .where(
        and(
          eq(dailyCheckins.userId, userId),
          gte(dailyCheckins.date, today),
          lt(dailyCheckins.date, tomorrow)
        )
      );

    return checkin;
  }

  async createDailyCheckin(checkinData: InsertDailyCheckin): Promise<DailyCheckin> {
    const [checkin] = await db
      .insert(dailyCheckins)
      .values({ ...checkinData, date: new Date() })
      .returning();

    // Create activity
    await this.createActivity({
      type: "daily_checkin",
      userId: checkin.userId,
      data: { mood: checkin.mood },
    });

    return checkin;
  }

  // Activity operations
  async getRecentActivities(userId: string, limit: number = 10): Promise<Activity[]> {
    const teamGoals = await this.getTeamGoals(userId);
    const teamGoalIds = teamGoals.map(goal => goal.id);

    let whereCondition;
    if (teamGoalIds.length > 0) {
      whereCondition = or(
        eq(activities.userId, userId),
        inArray(activities.goalId!, teamGoalIds)
      );
    } else {
      whereCondition = eq(activities.userId, userId);
    }

    return await db
      .select()
      .from(activities)
      .where(whereCondition)
      .orderBy(desc(activities.createdAt))
      .limit(limit);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const [activity] = await db.insert(activities).values(activityData).returning();
    return activity;
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    activeGoals: number;
    completedWeek: number;
    teamGoals: number;
    avgProgress: number;
    totalSteps: number;
  }> {
    const userGoals = await this.getGoals(userId);
    const teamGoals = await this.getTeamGoals(userId);
    
    const activeGoals = userGoals.filter(goal => !goal.isCompleted).length;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const completedWeek = userGoals.filter(goal => 
      goal.isCompleted && goal.updatedAt && goal.updatedAt >= weekAgo
    ).length;
    
    const totalProgress = userGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
    const avgProgress = userGoals.length > 0 ? Math.round(totalProgress / userGoals.length) : 0;

    // Get total steps from fitness tracking
    const weeklyFitness = await db
      .select()
      .from(fitnessTracking)
      .where(and(eq(fitnessTracking.userId, userId), gte(fitnessTracking.date, weekAgo)));
    
    const totalSteps = weeklyFitness.reduce((sum, entry) => sum + (entry.steps || 0), 0);

    return {
      activeGoals,
      completedWeek,
      teamGoals: teamGoals.length,
      avgProgress,
      totalSteps,
    };
  }

  // Photo memory operations
  async getPhotoMemories(userId: string, goalId?: string): Promise<PhotoMemory[]> {
    let query = db.select().from(photoMemories).where(eq(photoMemories.userId, userId));
    
    if (goalId) {
      query = query.where(eq(photoMemories.goalId, goalId));
    }
    
    return await query.orderBy(desc(photoMemories.createdAt));
  }

  async createPhotoMemory(memoryData: InsertPhotoMemory): Promise<PhotoMemory> {
    const [memory] = await db.insert(photoMemories).values(memoryData).returning();
    return memory;
  }

  async deletePhotoMemory(id: string): Promise<void> {
    await db.delete(photoMemories).where(eq(photoMemories.id, id));
  }

  // Fitness tracking operations
  async getFitnessData(userId: string, days: number = 7): Promise<FitnessTracking[]> {
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    
    return await db
      .select()
      .from(fitnessTracking)
      .where(and(eq(fitnessTracking.userId, userId), gte(fitnessTracking.date, startDate)))
      .orderBy(desc(fitnessTracking.date));
  }

  async getTodayFitness(userId: string): Promise<FitnessTracking | undefined> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [fitness] = await db
      .select()
      .from(fitnessTracking)
      .where(
        and(
          eq(fitnessTracking.userId, userId),
          gte(fitnessTracking.date, today),
          lt(fitnessTracking.date, tomorrow)
        )
      );

    return fitness;
  }

  async createFitnessEntry(entryData: InsertFitnessTracking): Promise<FitnessTracking> {
    const [entry] = await db
      .insert(fitnessTracking)
      .values({ ...entryData, date: new Date() })
      .returning();

    return entry;
  }

  async updateFitnessEntry(id: string, updates: Partial<FitnessTracking>): Promise<FitnessTracking> {
    const [entry] = await db
      .update(fitnessTracking)
      .set(updates)
      .where(eq(fitnessTracking.id, id))
      .returning();

    if (!entry) throw new Error("Fitness entry not found");
    return entry;
  }
}

export const storage = new DatabaseStorage();
