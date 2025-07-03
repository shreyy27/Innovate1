import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateProjectIdeas, analyzeMentorMatch } from "./services/gemini";
import { insertProjectSchema, insertUserSchema, insertProjectStarSchema, insertMentorshipSchema, insertActivitySchema } from "@shared/schema";
import { z } from "zod";
import { firebaseService } from "./services/firebase";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      res.json({ success: true, user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/me", async (req, res) => {
    // Mock authenticated user - in production, this would come from session/JWT
    const mockUserId = 1;
    try {
      const user = await storage.getUserWithStats(mockUserId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user data" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // AI Idea Generation
  app.post("/api/ai/generate-ideas", async (req, res) => {
    try {
      const { tags, difficulty, userId } = req.body;
      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({ error: "Tags are required" });
      }
      if (!difficulty) {
        return res.status(400).json({ error: "Difficulty level is required" });
      }

      const ideas = await generateProjectIdeas(tags, difficulty);
      
      // Store the generated ideas
      if (userId) {
        await storage.createAiIdea({
          userId: parseInt(userId),
          tags,
          difficulty,
          ideas: ideas as any,
        });
      }

      res.json({ ideas });
    } catch (error) {
      console.error("AI idea generation error:", error);
      res.status(500).json({ error: "Failed to generate ideas. Please try again." });
    }
  });

  // Mentor matching
  app.post("/api/mentors/match", async (req, res) => {
    try {
      const { tags, userId } = req.body;
      if (!tags || !Array.isArray(tags)) {
        return res.status(400).json({ error: "Interest tags are required" });
      }

      const mentors = await storage.getMentors();
      const matches = await analyzeMentorMatch(tags, mentors);
      
      res.json({ mentors: matches });
    } catch (error) {
      console.error("Mentor matching error:", error);
      res.status(500).json({ error: "Failed to find mentor matches. Please try again." });
    }
  });

  app.post("/api/mentors/connect", async (req, res) => {
    try {
      const mentorshipData = insertMentorshipSchema.parse(req.body);
      const mentorship = await storage.createMentorship(mentorshipData);
      
      // Create activity
      await storage.createActivity({
        userId: mentorshipData.menteeId,
        action: "requested_mentorship",
        targetType: "mentorship",
        targetId: mentorship.id,
        metadata: { mentorId: mentorshipData.mentorId },
      });

      res.json({ success: true, mentorship });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to connect with mentor" });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const { featured, limit } = req.query;
      const projects = await storage.getProjectsWithAuthors({
        featured: featured === 'true',
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to get projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProjectWithAuthor(projectId);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to get project" });
    }
  });

  app.post("/api/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      
      // Create activity
      await storage.createActivity({
        userId: projectData.authorId,
        action: "created_project",
        targetType: "project",
        targetId: project.id,
        metadata: { projectTitle: project.title },
      });

      res.json({ success: true, project });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create project" });
    }
  });

  app.post("/api/projects/:id/star", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { userId } = req.body;
      
      const star = await storage.starProject({ projectId, userId });
      
      // Create activity
      await storage.createActivity({
        userId,
        action: "starred_project",
        targetType: "project",
        targetId: projectId,
        metadata: {},
      });

      res.json({ success: true, star });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to star project" });
    }
  });

  app.delete("/api/projects/:id/star", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { userId } = req.body;
      
      await storage.unstarProject(projectId, userId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to unstar project" });
    }
  });

  app.post("/api/projects/:id/join", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { userId } = req.body;
      
      const member = await storage.addProjectMember({ projectId, userId });
      
      // Create activity
      await storage.createActivity({
        userId,
        action: "joined_project",
        targetType: "project",
        targetId: projectId,
        metadata: {},
      });

      res.json({ success: true, member });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : "Failed to join project" });
    }
  });

  // Activity feed
  app.get("/api/activities", async (req, res) => {
    try {
      const { limit } = req.query;
      const activities = await storage.getActivitiesWithUsers({
        limit: limit ? parseInt(limit as string) : 20,
      });
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get activities" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
