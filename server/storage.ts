import {
  users,
  goals,
  milestones,
  goalCollaborators,
  progressEntries,
  dailyCheckins,
  activities,
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
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private goals: Map<string, Goal>;
  private milestones: Map<string, Milestone>;
  private goalCollaborators: Map<string, GoalCollaborator>;
  private progressEntries: Map<string, ProgressEntry>;
  private dailyCheckins: Map<string, DailyCheckin>;
  private activities: Map<string, Activity>;

  constructor() {
    this.users = new Map();
    this.goals = new Map();
    this.milestones = new Map();
    this.goalCollaborators = new Map();
    this.progressEntries = new Map();
    this.dailyCheckins = new Map();
    this.activities = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const user: User = {
      ...userData,
      id: userData.id || randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Goal operations
  async getGoals(userId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(goal => goal.userId === userId);
  }

  async getGoal(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async createGoal(goalData: InsertGoal): Promise<Goal> {
    const goal: Goal = {
      ...goalData,
      id: randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.goals.set(goal.id, goal);

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
    const goal = this.goals.get(id);
    if (!goal) throw new Error("Goal not found");

    const updatedGoal: Goal = {
      ...goal,
      ...updates,
      updatedAt: new Date(),
    };
    this.goals.set(id, updatedGoal);

    // Create activity for progress updates
    if (updates.progress !== undefined && updates.progress !== goal.progress) {
      await this.createActivity({
        type: "progress_updated",
        userId: goal.userId,
        goalId: goal.id,
        data: { 
          goalTitle: goal.title,
          previousProgress: goal.progress,
          newProgress: updates.progress 
        },
      });
    }

    return updatedGoal;
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals.delete(id);
    // Also delete related data
    Array.from(this.milestones.entries()).forEach(([key, milestone]) => {
      if (milestone.goalId === id) this.milestones.delete(key);
    });
    Array.from(this.goalCollaborators.entries()).forEach(([key, collab]) => {
      if (collab.goalId === id) this.goalCollaborators.delete(key);
    });
  }

  // Milestone operations
  async getMilestones(goalId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values())
      .filter(milestone => milestone.goalId === goalId)
      .sort((a, b) => a.order - b.order);
  }

  async createMilestone(milestoneData: InsertMilestone): Promise<Milestone> {
    const milestone: Milestone = {
      ...milestoneData,
      id: randomUUID(),
      createdAt: new Date(),
      completedAt: null,
    };
    this.milestones.set(milestone.id, milestone);
    return milestone;
  }

  async updateMilestone(id: string, updates: Partial<Milestone>): Promise<Milestone> {
    const milestone = this.milestones.get(id);
    if (!milestone) throw new Error("Milestone not found");

    const updatedMilestone: Milestone = {
      ...milestone,
      ...updates,
      completedAt: updates.isCompleted ? new Date() : milestone.completedAt,
    };
    this.milestones.set(id, updatedMilestone);

    // Create activity for milestone completion
    if (updates.isCompleted && !milestone.isCompleted) {
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

    return updatedMilestone;
  }

  async deleteMilestone(id: string): Promise<void> {
    this.milestones.delete(id);
  }

  // Progress operations
  async getProgressEntries(goalId: string): Promise<ProgressEntry[]> {
    return Array.from(this.progressEntries.values())
      .filter(entry => entry.goalId === goalId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createProgressEntry(entryData: InsertProgressEntry): Promise<ProgressEntry> {
    const entry: ProgressEntry = {
      ...entryData,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.progressEntries.set(entry.id, entry);
    return entry;
  }

  // Collaboration operations
  async getGoalCollaborators(goalId: string): Promise<GoalCollaborator[]> {
    return Array.from(this.goalCollaborators.values()).filter(collab => collab.goalId === goalId);
  }

  async addCollaborator(goalId: string, userId: string, role: string = "collaborator"): Promise<GoalCollaborator> {
    const collaborator: GoalCollaborator = {
      id: randomUUID(),
      goalId,
      userId,
      role,
      createdAt: new Date(),
    };
    this.goalCollaborators.set(collaborator.id, collaborator);
    return collaborator;
  }

  async removeCollaborator(goalId: string, userId: string): Promise<void> {
    Array.from(this.goalCollaborators.entries()).forEach(([key, collab]) => {
      if (collab.goalId === goalId && collab.userId === userId) {
        this.goalCollaborators.delete(key);
      }
    });
  }

  async getTeamGoals(userId: string): Promise<Goal[]> {
    const collaboratorGoalIds = Array.from(this.goalCollaborators.values())
      .filter(collab => collab.userId === userId)
      .map(collab => collab.goalId);

    return Array.from(this.goals.values()).filter(goal => 
      goal.isTeamGoal && (goal.userId === userId || collaboratorGoalIds.includes(goal.id))
    );
  }

  // Daily checkin operations
  async getTodayCheckin(userId: string): Promise<DailyCheckin | undefined> {
    const today = new Date().toDateString();
    return Array.from(this.dailyCheckins.values()).find(checkin => 
      checkin.userId === userId && checkin.date.toDateString() === today
    );
  }

  async createDailyCheckin(checkinData: InsertDailyCheckin): Promise<DailyCheckin> {
    const checkin: DailyCheckin = {
      ...checkinData,
      id: randomUUID(),
      date: new Date(),
      createdAt: new Date(),
    };
    this.dailyCheckins.set(checkin.id, checkin);

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
    // Get activities from user's team goals and collaborations
    const teamGoals = await this.getTeamGoals(userId);
    const teamGoalIds = teamGoals.map(goal => goal.id);

    return Array.from(this.activities.values())
      .filter(activity => 
        activity.userId === userId || 
        (activity.goalId && teamGoalIds.includes(activity.goalId))
      )
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createActivity(activityData: InsertActivity): Promise<Activity> {
    const activity: Activity = {
      ...activityData,
      id: randomUUID(),
      createdAt: new Date(),
    };
    this.activities.set(activity.id, activity);
    return activity;
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    activeGoals: number;
    completedWeek: number;
    teamGoals: number;
    avgProgress: number;
  }> {
    const userGoals = await this.getGoals(userId);
    const teamGoals = await this.getTeamGoals(userId);
    
    const activeGoals = userGoals.filter(goal => !goal.isCompleted).length;
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const completedWeek = userGoals.filter(goal => 
      goal.isCompleted && goal.updatedAt >= weekAgo
    ).length;
    
    const totalProgress = userGoals.reduce((sum, goal) => sum + (goal.progress || 0), 0);
    const avgProgress = userGoals.length > 0 ? Math.round(totalProgress / userGoals.length) : 0;

    return {
      activeGoals,
      completedWeek,
      teamGoals: teamGoals.length,
      avgProgress,
    };
  }
}

export const storage = new MemStorage();
