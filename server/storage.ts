import { 
  users, projects, projectMembers, projectStars, mentorships, activities, aiIdeas,
  type User, type InsertUser, type Project, type InsertProject, 
  type ProjectMember, type InsertProjectMember, type ProjectStar, type InsertProjectStar,
  type Mentorship, type InsertMentorship, type Activity, type InsertActivity,
  type AiIdea, type InsertAiIdea, type ProjectWithAuthor, type UserWithStats, type ActivityWithUser
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserWithStats(id: number): Promise<UserWithStats | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getMentors(): Promise<User[]>;

  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectWithAuthor(id: number): Promise<ProjectWithAuthor | undefined>;
  getProjectsWithAuthors(options?: { featured?: boolean; limit?: number }): Promise<ProjectWithAuthor[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined>;

  // Project interaction operations
  starProject(star: InsertProjectStar): Promise<ProjectStar>;
  unstarProject(projectId: number, userId: number): Promise<void>;
  addProjectMember(member: InsertProjectMember): Promise<ProjectMember>;
  removeProjectMember(projectId: number, userId: number): Promise<void>;

  // Mentorship operations
  createMentorship(mentorship: InsertMentorship): Promise<Mentorship>;
  getMentorships(userId: number): Promise<Mentorship[]>;

  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesWithUsers(options?: { limit?: number }): Promise<ActivityWithUser[]>;

  // AI operations
  createAiIdea(idea: InsertAiIdea): Promise<AiIdea>;
  getAiIdeas(userId: number): Promise<AiIdea[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private projectMembers: Map<number, ProjectMember>;
  private projectStars: Map<number, ProjectStar>;
  private mentorships: Map<number, Mentorship>;
  private activities: Map<number, Activity>;
  private aiIdeas: Map<number, AiIdea>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.projectMembers = new Map();
    this.projectStars = new Map();
    this.mentorships = new Map();
    this.activities = new Map();
    this.aiIdeas = new Map();
    this.currentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample users
    const sampleUsers: User[] = [
      {
        id: 1,
        username: "arjun.sharma",
        email: "arjun@siesgst.ac.in",
        password: "password123",
        fullName: "Arjun Sharma",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        role: "student",
        expertise: ["Web Development", "React", "Node.js"],
        bio: "Final year IT student passionate about full-stack development",
        rating: 0,
        createdAt: new Date(),
      },
      {
        id: 2,
        username: "dr.rajesh.kumar",
        email: "rajesh.kumar@siesgst.ac.in",
        password: "mentor123",
        fullName: "Dr. Rajesh Kumar",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        role: "mentor",
        expertise: ["AI", "Machine Learning", "Data Science"],
        bio: "Professor specializing in AI and ML with 15+ years of experience",
        rating: 4.8,
        createdAt: new Date(),
      },
      {
        id: 3,
        username: "priya.patel",
        email: "priya@siesgst.ac.in",
        password: "student123",
        fullName: "Priya Patel",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
        role: "student",
        expertise: ["Machine Learning", "Python", "TensorFlow"],
        bio: "Third year student interested in AI and sustainability",
        rating: 0,
        createdAt: new Date(),
      }
    ];

    sampleUsers.forEach(user => this.users.set(user.id, user));

    // Sample projects
    const sampleProjects: Project[] = [
      {
        id: 1,
        title: "EcoTracker",
        description: "A sustainability dashboard that tracks campus carbon footprint using IoT sensors and machine learning analytics.",
        authorId: 3,
        technologies: ["React", "Firebase", "ML"],
        tags: ["sustainability", "iot", "dashboard"],
        difficulty: "intermediate",
        duration: "4-6 weeks",
        teamSize: "3-4 members",
        repoLink: "https://github.com/priya/ecotracker",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        stars: 24,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: "StudyBuddy",
        description: "AI-powered study companion that creates personalized learning paths and connects students for collaborative study sessions.",
        authorId: 1,
        technologies: ["Flutter", "Gemini API", "Firestore"],
        tags: ["education", "ai", "mobile"],
        difficulty: "advanced",
        duration: "6-8 weeks",
        teamSize: "4-5 members",
        repoLink: "https://github.com/arjun/studybuddy",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
        stars: 18,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    sampleProjects.forEach(project => this.projects.set(project.id, project));
    this.currentId = Math.max(...sampleUsers.map(u => u.id), ...sampleProjects.map(p => p.id)) + 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserWithStats(id: number): Promise<UserWithStats | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const projectCount = Array.from(this.projects.values()).filter(p => p.authorId === id).length;
    const collaborationCount = Array.from(this.projectMembers.values()).filter(m => m.userId === id).length;
    const mentorshipCount = Array.from(this.mentorships.values()).filter(m => m.mentorId === id || m.menteeId === id).length;

    return {
      ...user,
      projectCount,
      collaborationCount,
      mentorshipCount,
    };
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      rating: insertUser.rating || 0,
      expertise: insertUser.expertise || [],
    };
    this.users.set(id, user);
    return user;
  }

  async getMentors(): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === "mentor" || user.role === "faculty");
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectWithAuthor(id: number): Promise<ProjectWithAuthor | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const author = this.users.get(project.authorId);
    if (!author) return undefined;

    const starCount = Array.from(this.projectStars.values()).filter(s => s.projectId === id).length;

    return {
      ...project,
      author: {
        id: author.id,
        fullName: author.fullName,
        avatar: author.avatar,
        username: author.username,
      },
      starCount,
    };
  }

  async getProjectsWithAuthors(options?: { featured?: boolean; limit?: number }): Promise<ProjectWithAuthor[]> {
    let projectList = Array.from(this.projects.values());
    
    if (options?.featured) {
      projectList = projectList.filter(p => p.stars > 15);
    }

    if (options?.limit) {
      projectList = projectList.slice(0, options.limit);
    }

    const projectsWithAuthors: ProjectWithAuthor[] = [];
    
    for (const project of projectList) {
      const author = this.users.get(project.authorId);
      if (author) {
        const starCount = Array.from(this.projectStars.values()).filter(s => s.projectId === project.id).length;
        projectsWithAuthors.push({
          ...project,
          author: {
            id: author.id,
            fullName: author.fullName,
            avatar: author.avatar,
            username: author.username,
          },
          starCount,
        });
      }
    }

    return projectsWithAuthors.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentId++;
    const project: Project = { 
      ...insertProject, 
      id, 
      stars: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async starProject(star: InsertProjectStar): Promise<ProjectStar> {
    const id = this.currentId++;
    const projectStar: ProjectStar = { 
      ...star, 
      id, 
      starredAt: new Date(),
    };
    this.projectStars.set(id, projectStar);

    // Update project star count
    const project = this.projects.get(star.projectId);
    if (project) {
      project.stars = (project.stars || 0) + 1;
      this.projects.set(star.projectId, project);
    }

    return projectStar;
  }

  async unstarProject(projectId: number, userId: number): Promise<void> {
    const starToRemove = Array.from(this.projectStars.entries()).find(
      ([_, star]) => star.projectId === projectId && star.userId === userId
    );

    if (starToRemove) {
      this.projectStars.delete(starToRemove[0]);
      
      // Update project star count
      const project = this.projects.get(projectId);
      if (project && project.stars > 0) {
        project.stars = project.stars - 1;
        this.projects.set(projectId, project);
      }
    }
  }

  async addProjectMember(member: InsertProjectMember): Promise<ProjectMember> {
    const id = this.currentId++;
    const projectMember: ProjectMember = { 
      ...member, 
      id, 
      joinedAt: new Date(),
    };
    this.projectMembers.set(id, projectMember);
    return projectMember;
  }

  async removeProjectMember(projectId: number, userId: number): Promise<void> {
    const memberToRemove = Array.from(this.projectMembers.entries()).find(
      ([_, member]) => member.projectId === projectId && member.userId === userId
    );

    if (memberToRemove) {
      this.projectMembers.delete(memberToRemove[0]);
    }
  }

  async createMentorship(insertMentorship: InsertMentorship): Promise<Mentorship> {
    const id = this.currentId++;
    const mentorship: Mentorship = { 
      ...insertMentorship, 
      id, 
      createdAt: new Date(),
    };
    this.mentorships.set(id, mentorship);
    return mentorship;
  }

  async getMentorships(userId: number): Promise<Mentorship[]> {
    return Array.from(this.mentorships.values()).filter(
      m => m.mentorId === userId || m.menteeId === userId
    );
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { 
      ...insertActivity, 
      id, 
      createdAt: new Date(),
    };
    this.activities.set(id, activity);
    return activity;
  }

  async getActivitiesWithUsers(options?: { limit?: number }): Promise<ActivityWithUser[]> {
    let activityList = Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (options?.limit) {
      activityList = activityList.slice(0, options.limit);
    }

    const activitiesWithUsers: ActivityWithUser[] = [];
    
    for (const activity of activityList) {
      const user = this.users.get(activity.userId);
      if (user) {
        activitiesWithUsers.push({
          ...activity,
          user: {
            id: user.id,
            fullName: user.fullName,
            avatar: user.avatar,
            username: user.username,
          },
        });
      }
    }

    return activitiesWithUsers;
  }

  async createAiIdea(insertAiIdea: InsertAiIdea): Promise<AiIdea> {
    const id = this.currentId++;
    const aiIdea: AiIdea = { 
      ...insertAiIdea, 
      id, 
      createdAt: new Date(),
    };
    this.aiIdeas.set(id, aiIdea);
    return aiIdea;
  }

  async getAiIdeas(userId: number): Promise<AiIdea[]> {
    return Array.from(this.aiIdeas.values()).filter(idea => idea.userId === userId);
  }
}

export const storage = new MemStorage();
