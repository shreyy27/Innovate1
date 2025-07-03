import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  avatar: text("avatar"),
  role: text("role").notNull().default("student"), // student, mentor, faculty
  expertise: text("expertise").array().default([]),
  bio: text("bio"),
  rating: integer("rating").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  technologies: text("technologies").array().default([]),
  tags: text("tags").array().default([]),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  duration: text("duration"),
  teamSize: text("team_size"),
  repoLink: text("repo_link"),
  imageUrl: text("image_url"),
  stars: integer("stars").default(0),
  status: text("status").notNull().default("active"), // active, completed, archived
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  role: text("role").notNull().default("member"), // owner, member
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const projectStars = pgTable("project_stars", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  starredAt: timestamp("starred_at").defaultNow(),
});

export const mentorships = pgTable("mentorships", {
  id: serial("id").primaryKey(),
  mentorId: integer("mentor_id").references(() => users.id).notNull(),
  menteeId: integer("mentee_id").references(() => users.id).notNull(),
  projectId: integer("project_id").references(() => projects.id),
  status: text("status").notNull().default("pending"), // pending, active, completed
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(),
  targetType: text("target_type").notNull(), // project, mentorship, user
  targetId: integer("target_id").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiIdeas = pgTable("ai_ideas", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tags: text("tags").array().notNull(),
  difficulty: text("difficulty").notNull(),
  ideas: jsonb("ideas").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  stars: true,
});

export const insertProjectMemberSchema = createInsertSchema(projectMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertProjectStarSchema = createInsertSchema(projectStars).omit({
  id: true,
  starredAt: true,
});

export const insertMentorshipSchema = createInsertSchema(mentorships).omit({
  id: true,
  createdAt: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  createdAt: true,
});

export const insertAiIdeaSchema = createInsertSchema(aiIdeas).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = z.infer<typeof insertProjectMemberSchema>;
export type ProjectStar = typeof projectStars.$inferSelect;
export type InsertProjectStar = z.infer<typeof insertProjectStarSchema>;
export type Mentorship = typeof mentorships.$inferSelect;
export type InsertMentorship = z.infer<typeof insertMentorshipSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type AiIdea = typeof aiIdeas.$inferSelect;
export type InsertAiIdea = z.infer<typeof insertAiIdeaSchema>;

// Extended types for API responses
export type ProjectWithAuthor = Project & {
  author: Pick<User, 'id' | 'fullName' | 'avatar' | 'username'>;
  isStarred?: boolean;
  starCount: number;
};

export type UserWithStats = User & {
  projectCount: number;
  collaborationCount: number;
  mentorshipCount: number;
};

export type ActivityWithUser = Activity & {
  user: Pick<User, 'id' | 'fullName' | 'avatar' | 'username'>;
};
