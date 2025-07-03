import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Star, Trophy, Zap } from "lucide-react";

interface GoogleTechBadge {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
  requirements: string[];
}

const googleTechBadges: GoogleTechBadge[] = [
  {
    id: "firebase-master",
    name: "Firebase Master",
    icon: Award,
    description: "Successfully integrated Firebase Auth, Firestore, and Functions",
    color: "bg-material-orange text-white",
    requirements: ["Firebase Auth", "Firestore", "Cloud Functions"]
  },
  {
    id: "gemini-innovator",
    name: "Gemini Innovator",
    icon: Zap,
    description: "Leveraged Gemini API for AI-powered features",
    color: "bg-material-blue text-white",
    requirements: ["Gemini API", "AI Integration"]
  },
  {
    id: "vertex-ai-pioneer",
    name: "Vertex AI Pioneer",
    icon: Star,
    description: "Implemented machine learning with Vertex AI",
    color: "bg-material-green text-white",
    requirements: ["Vertex AI", "ML Model", "Data Processing"]
  },
  {
    id: "gcp-architect",
    name: "GCP Architect",
    icon: Trophy,
    description: "Built scalable solutions using Google Cloud Platform",
    color: "bg-material-amber text-white",
    requirements: ["Cloud Storage", "Cloud Functions", "Cloud Run"]
  }
];

interface GoogleTechBadgesProps {
  projectTechnologies: string[];
  className?: string;
}

export function GoogleTechBadges({ projectTechnologies, className = "" }: GoogleTechBadgesProps) {
  const earnedBadges = googleTechBadges.filter(badge => 
    badge.requirements.some(req => 
      projectTechnologies.some(tech => 
        tech.toLowerCase().includes(req.toLowerCase()) || 
        req.toLowerCase().includes(tech.toLowerCase())
      )
    )
  );

  if (earnedBadges.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {earnedBadges.map(badge => (
        <Badge
          key={badge.id}
          className={`${badge.color} px-3 py-1 flex items-center gap-1 text-xs font-medium`}
          title={badge.description}
        >
          <badge.icon className="h-3 w-3" />
          {badge.name}
        </Badge>
      ))}
    </div>
  );
}

export function GoogleTechBadgesShowcase() {
  return (
    <Card className="material-elevation-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-material-grey font-['Inter'] flex items-center gap-2">
          <Trophy className="h-5 w-5 text-material-amber" />
          Google Tech Badges
        </CardTitle>
        <p className="text-material-grey-light text-sm">
          Earn badges by integrating Google technologies into your projects
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {googleTechBadges.map(badge => (
          <div
            key={badge.id}
            className="flex items-center p-3 border border-gray-200 rounded-lg hover:material-elevation-2 transition-shadow duration-200"
          >
            <div className={`${badge.color} p-2 rounded-full`}>
              <badge.icon className="h-4 w-4" />
            </div>
            <div className="ml-3 flex-1">
              <div className="font-medium text-material-grey text-sm">{badge.name}</div>
              <div className="text-xs text-material-grey-light">{badge.description}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {badge.requirements.map(req => (
                  <span key={req} className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {req}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}