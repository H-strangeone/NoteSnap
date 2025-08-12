import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSimpleAuth, isAuthenticated } from "./simple-auth";
import { 
  insertGoalSchema, 
  insertMilestoneSchema, 
  insertProgressEntrySchema,
  insertDailyCheckinSchema,
  insertPhotoMemorySchema,
  insertFitnessTrackingSchema
} from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { uploadFile, deleteFile } from "./supabase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Multer setup for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  });

  // Auth middleware
  setupSimpleAuth(app);

  // Auth routes are handled by setupSimpleAuth

  // Goal routes
  app.get('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goals = await storage.getGoals(userId);
      
      // Get milestones for each goal
      const goalsWithMilestones = await Promise.all(
        goals.map(async (goal) => {
          const milestones = await storage.getMilestones(goal.id);
          const collaborators = await storage.getGoalCollaborators(goal.id);
          return { ...goal, milestones, collaborators };
        })
      );
      
      res.json(goalsWithMilestones);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ message: "Failed to fetch goals" });
    }
  });

  app.post('/api/goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goalData = insertGoalSchema.parse({ ...req.body, userId });
      
      const goal = await storage.createGoal(goalData);
      
      // Create milestones if provided
      if (req.body.milestones && Array.isArray(req.body.milestones)) {
        const milestones = await Promise.all(
          req.body.milestones.map((milestone: any, index: number) => 
            storage.createMilestone({
              title: milestone,
              goalId: goal.id,
              order: index,
            })
          )
        );
        res.json({ ...goal, milestones });
      } else {
        res.json(goal);
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ message: "Failed to create goal" });
    }
  });

  app.put('/api/goals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const goalId = req.params.id;
      const updates = req.body;
      
      const goal = await storage.updateGoal(goalId, updates);
      res.json(goal);
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ message: "Failed to update goal" });
    }
  });

  app.delete('/api/goals/:id', isAuthenticated, async (req: any, res) => {
    try {
      const goalId = req.params.id;
      await storage.deleteGoal(goalId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting goal:", error);
      res.status(500).json({ message: "Failed to delete goal" });
    }
  });

  // Team goals
  app.get('/api/team-goals', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const teamGoals = await storage.getTeamGoals(userId);
      
      const goalsWithDetails = await Promise.all(
        teamGoals.map(async (goal) => {
          const milestones = await storage.getMilestones(goal.id);
          const collaborators = await storage.getGoalCollaborators(goal.id);
          return { ...goal, milestones, collaborators };
        })
      );
      
      res.json(goalsWithDetails);
    } catch (error) {
      console.error("Error fetching team goals:", error);
      res.status(500).json({ message: "Failed to fetch team goals" });
    }
  });

  // Milestone routes
  app.put('/api/milestones/:id', isAuthenticated, async (req: any, res) => {
    try {
      const milestoneId = req.params.id;
      const updates = req.body;
      
      const milestone = await storage.updateMilestone(milestoneId, updates);
      res.json(milestone);
    } catch (error) {
      console.error("Error updating milestone:", error);
      res.status(500).json({ message: "Failed to update milestone" });
    }
  });

  // Progress tracking
  app.post('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const progressData = insertProgressEntrySchema.parse({ ...req.body, userId });
      
      const entry = await storage.createProgressEntry(progressData);
      
      // Update goal progress
      await storage.updateGoal(progressData.goalId, { 
        progress: progressData.newProgress 
      });
      
      res.json(entry);
    } catch (error) {
      console.error("Error creating progress entry:", error);
      res.status(500).json({ message: "Failed to create progress entry" });
    }
  });

  // Daily check-in
  app.get('/api/checkin/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const checkin = await storage.getTodayCheckin(userId);
      res.json(checkin);
    } catch (error) {
      console.error("Error fetching today's check-in:", error);
      res.status(500).json({ message: "Failed to fetch check-in" });
    }
  });

  app.post('/api/checkin', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const checkinData = insertDailyCheckinSchema.parse({ ...req.body, userId });
      
      const checkin = await storage.createDailyCheckin(checkinData);
      res.json(checkin);
    } catch (error) {
      console.error("Error creating daily check-in:", error);
      res.status(500).json({ message: "Failed to create check-in" });
    }
  });

  // Activity feed
  app.get('/api/activities', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await storage.getRecentActivities(userId, limit);
      
      // Populate user information for activities
      const activitiesWithUsers = await Promise.all(
        activities.map(async (activity) => {
          const user = await storage.getUser(activity.userId);
          return { ...activity, user };
        })
      );
      
      res.json(activitiesWithUsers);
    } catch (error) {
      console.error("Error fetching activities:", error);
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Analytics
  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Collaboration
  app.post('/api/goals/:id/collaborators', isAuthenticated, async (req: any, res) => {
    try {
      const goalId = req.params.id;
      const { userId: collaboratorId, role = "collaborator" } = req.body;
      
      const collaborator = await storage.addCollaborator(goalId, collaboratorId, role);
      res.json(collaborator);
    } catch (error) {
      console.error("Error adding collaborator:", error);
      res.status(500).json({ message: "Failed to add collaborator" });
    }
  });

  // Photo memory routes
  app.get('/api/memories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const goalId = req.query.goalId as string;
      
      const memories = await storage.getPhotoMemories(userId, goalId);
      res.json(memories);
    } catch (error) {
      console.error("Error fetching memories:", error);
      res.status(500).json({ message: "Failed to fetch memories" });
    }
  });

  app.post('/api/memories/upload', isAuthenticated, upload.single('photo'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { caption, goalId, progressEntryId } = req.body;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "No photo provided" });
      }

      // Upload to Supabase storage
      const fileName = `${userId}/${Date.now()}-${file.originalname}`;
      const { url, error } = await uploadFile('progress-photos', fileName, file.buffer, file.mimetype);

      if (error || !url) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Failed to upload photo" });
      }

      // Save to database
      const memory = await storage.createPhotoMemory({
        userId,
        goalId: goalId || null,
        progressEntryId: progressEntryId || null,
        photoUrl: url,
        caption: caption || null,
        tags: [], // You can add tag parsing here
      });

      res.json(memory);
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
    }
  });

  app.delete('/api/memories/:id', isAuthenticated, async (req: any, res) => {
    try {
      const memoryId = req.params.id;
      await storage.deletePhotoMemory(memoryId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting memory:", error);
      res.status(500).json({ message: "Failed to delete memory" });
    }
  });

  // Fitness tracking routes
  app.get('/api/fitness/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const fitness = await storage.getTodayFitness(userId);
      res.json(fitness);
    } catch (error) {
      console.error("Error fetching today's fitness:", error);
      res.status(500).json({ message: "Failed to fetch fitness data" });
    }
  });

  app.get('/api/fitness/weekly', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const days = parseInt(req.query.days as string) || 7;
      const fitness = await storage.getFitnessData(userId, days);
      res.json(fitness);
    } catch (error) {
      console.error("Error fetching weekly fitness:", error);
      res.status(500).json({ message: "Failed to fetch fitness data" });
    }
  });

  app.post('/api/fitness', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const fitnessData = insertFitnessTrackingSchema.parse({ ...req.body, userId });
      
      const fitness = await storage.createFitnessEntry(fitnessData);
      res.json(fitness);
    } catch (error) {
      console.error("Error creating fitness entry:", error);
      res.status(500).json({ message: "Failed to create fitness entry" });
    }
  });

  app.put('/api/fitness/:id', isAuthenticated, async (req: any, res) => {
    try {
      const fitnessId = req.params.id;
      const updates = req.body;
      
      const fitness = await storage.updateFitnessEntry(fitnessId, updates);
      res.json(fitness);
    } catch (error) {
      console.error("Error updating fitness entry:", error);
      res.status(500).json({ message: "Failed to update fitness entry" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
