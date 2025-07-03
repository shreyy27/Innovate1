import { GoogleGenAI } from "@google/genai";
import type { User } from "@shared/schema";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || ""
});

export interface ProjectIdea {
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  teamSize: string;
  difficulty: string;
  architecture?: string;
}

export interface MentorMatch {
  id: number;
  fullName: string;
  avatar?: string;
  expertise: string[];
  bio?: string;
  rating: number;
  matchScore: number;
  matchReason: string;
}

export async function generateProjectIdeas(
  tags: string[], 
  difficulty: string
): Promise<ProjectIdea[]> {
  try {
    const systemPrompt = `You are an expert software engineering professor at SIESGST college helping students create innovative project ideas. 
Generate creative, practical project ideas based on the given technologies and difficulty level.
Each project should be campus-relevant, use modern technologies, and encourage innovation.
Focus on real-world problems that students can solve.
Provide exactly 3-5 unique project ideas.

For each project, provide:
- title: Creative, engaging project name
- description: Detailed explanation of what the project does and its impact
- technologies: Array of relevant tech stack items
- duration: Realistic timeframe (e.g., "4-6 weeks", "2-3 months")
- teamSize: Recommended team size (e.g., "3-4 members", "2-3 developers")
- difficulty: The provided difficulty level
- architecture: Brief technical architecture overview

Respond with valid JSON in this exact format:
{
  "ideas": [
    {
      "title": "Project Name",
      "description": "Detailed description...",
      "technologies": ["Tech1", "Tech2", "Tech3"],
      "duration": "4-6 weeks",
      "teamSize": "3-4 members", 
      "difficulty": "${difficulty}",
      "architecture": "Technical architecture overview..."
    }
  ]
}`;

    const userPrompt = `Generate innovative project ideas for SIESGST students with these interests: ${tags.join(', ')}
Difficulty level: ${difficulty}

Consider these aspects:
- Campus life improvement
- Academic productivity tools
- Sustainability solutions
- Student collaboration platforms
- Smart campus technologies
- Industry-relevant applications

Make sure each project is feasible for ${difficulty} level students and uses at least some of: ${tags.join(', ')}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            ideas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  technologies: { 
                    type: "array",
                    items: { type: "string" }
                  },
                  duration: { type: "string" },
                  teamSize: { type: "string" },
                  difficulty: { type: "string" },
                  architecture: { type: "string" }
                },
                required: ["title", "description", "technologies", "duration", "teamSize", "difficulty"]
              }
            }
          },
          required: ["ideas"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    console.log(`AI Ideas Response: ${rawJson}`);

    if (rawJson) {
      const data = JSON.parse(rawJson);
      return data.ideas || [];
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback response for demo purposes
    return [
      {
        title: "Smart Campus Navigator",
        description: "An AI-powered indoor navigation system using computer vision and IoT sensors to help students navigate the campus efficiently, find available study spaces, and locate resources.",
        technologies: tags.slice(0, 3).concat(["React", "TensorFlow", "Firebase"]),
        duration: "6-8 weeks",
        teamSize: "4-5 members",
        difficulty,
        architecture: "Frontend: React PWA, Backend: Node.js + Firebase, AI: TensorFlow.js for computer vision, IoT: Raspberry Pi sensors"
      },
      {
        title: "EcoTracker Campus",
        description: "A sustainability dashboard that tracks campus carbon footprint using IoT sensors and machine learning analytics to promote environmental awareness and green practices.",
        technologies: tags.slice(0, 2).concat(["IoT", "Machine Learning", "React"]),
        duration: "4-6 weeks", 
        teamSize: "3-4 members",
        difficulty,
        architecture: "IoT Layer: Sensor network with MQTT, Analytics: Python ML pipeline, Frontend: React dashboard with real-time data visualization"
      },
      {
        title: "StudyBuddy AI",
        description: "AI-powered study companion that creates personalized learning paths, connects students for collaborative study sessions, and provides intelligent tutoring assistance.",
        technologies: tags.slice(0, 2).concat(["Gemini API", "Flutter", "Firestore"]),
        duration: "5-7 weeks",
        teamSize: "3-4 members", 
        difficulty,
        architecture: "Mobile: Flutter cross-platform app, AI: Gemini API for personalized content, Backend: Firebase with real-time collaboration features"
      }
    ];
  }
}

export async function analyzeMentorMatch(
  studentTags: string[], 
  mentors: User[]
): Promise<MentorMatch[]> {
  try {
    const systemPrompt = `You are an expert mentor-matching system for SIESGST college.
Analyze the compatibility between a student's interests and available mentors based on expertise overlap.
Consider factors like expertise alignment, experience level, and potential learning opportunities.
Return the top 3 best matches with match scores and reasons.

Respond with valid JSON in this exact format:
{
  "matches": [
    {
      "mentorId": number,
      "matchScore": number (0-100),
      "matchReason": "Detailed explanation of why this mentor is a good match"
    }
  ]
}`;

    const mentorData = mentors.map(m => ({
      id: m.id,
      name: m.fullName,
      expertise: m.expertise,
      bio: m.bio,
      rating: m.rating
    }));

    const userPrompt = `Student interests: ${studentTags.join(', ')}

Available mentors:
${mentorData.map(m => 
  `ID: ${m.id}, Name: ${m.name}, Expertise: ${m.expertise?.join(', ')}, Bio: ${m.bio}, Rating: ${m.rating}`
).join('\n')}

Find the best mentor matches considering:
- Expertise overlap with student interests
- Mentor's experience and rating
- Potential for meaningful guidance
- Complementary skills that could benefit the student`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", 
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  mentorId: { type: "number" },
                  matchScore: { type: "number" },
                  matchReason: { type: "string" }
                },
                required: ["mentorId", "matchScore", "matchReason"]
              }
            }
          },
          required: ["matches"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    console.log(`AI Mentor Matching Response: ${rawJson}`);

    if (rawJson) {
      const data = JSON.parse(rawJson);
      const aiMatches = data.matches || [];
      
      // Combine AI results with actual mentor data
      const mentorMatches: MentorMatch[] = aiMatches
        .map((match: any) => {
          const mentor = mentors.find(m => m.id === match.mentorId);
          if (mentor) {
            return {
              id: mentor.id,
              fullName: mentor.fullName,
              avatar: mentor.avatar,
              expertise: mentor.expertise || [],
              bio: mentor.bio,
              rating: mentor.rating || 0,
              matchScore: match.matchScore,
              matchReason: match.matchReason
            };
          }
          return null;
        })
        .filter(Boolean)
        .slice(0, 3);

      return mentorMatches;
    } else {
      throw new Error("Empty response from Gemini API");
    }
  } catch (error) {
    console.error("Mentor matching error:", error);
    
    // Fallback: Return mentors with basic scoring
    return mentors
      .filter(m => m.role === "mentor" || m.role === "faculty")
      .map(mentor => {
        // Simple scoring based on expertise overlap
        const overlapCount = mentor.expertise?.filter(exp => 
          studentTags.some(tag => 
            exp.toLowerCase().includes(tag.toLowerCase()) || 
            tag.toLowerCase().includes(exp.toLowerCase())
          )
        ).length || 0;
        
        const matchScore = Math.min(95, (overlapCount / Math.max(studentTags.length, 1)) * 100 + 
          (mentor.rating || 0) * 10);

        return {
          id: mentor.id,
          fullName: mentor.fullName,
          avatar: mentor.avatar,
          expertise: mentor.expertise || [],
          bio: mentor.bio,
          rating: mentor.rating || 0,
          matchScore: Math.round(matchScore),
          matchReason: `Strong expertise match in ${mentor.expertise?.slice(0, 2).join(' and ')} with excellent track record (${mentor.rating}/5 rating)`
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }
}
