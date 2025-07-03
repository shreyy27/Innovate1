import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Target, Loader2, X, Users, Clock, Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MatchedProject {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  teamSize: string;
  difficulty: string;
  author: {
    fullName: string;
    avatar?: string;
  };
  matchScore: number;
  matchReason: string;
  starCount: number;
}

export function SkillProjectMatcher() {
  const [skills, setSkills] = useState<string[]>(["React", "Node.js"]);
  const [newSkill, setNewSkill] = useState("");
  const [matchedProjects, setMatchedProjects] = useState<MatchedProject[]>([]);
  const { toast } = useToast();

  const findProjectsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/projects/match-skills", {
        skills,
        userId: 1, // Mock user ID
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMatchedProjects(data.projects || []);
      toast({
        title: "Projects Found!",
        description: `Found ${data.projects?.length || 0} projects matching your skills`,
      });
    },
    onError: (error) => {
      toast({
        title: "Search Failed",
        description: error.message || "Failed to find matching projects. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addSkill();
    }
  };

  return (
    <Card className="material-elevation-2 animate-slide-up">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="bg-material-blue bg-opacity-10 p-3 rounded-full">
            <Target className="h-6 w-6 text-material-blue" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-material-grey font-['Inter']">
              Skill-to-Project Matcher
            </CardTitle>
            <p className="text-material-grey-light">Find projects that need your expertise</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-material-grey mb-2 block">
            What are your skills?
          </Label>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.map((skill) => (
              <Badge
                key={skill}
                className="bg-material-green text-white px-3 py-1 flex items-center gap-2"
              >
                {skill}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-green-700"
                  onClick={() => removeSkill(skill)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add skills (React, Python, UI/UX, Marketing...)"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            className="focus:ring-2 focus:ring-material-blue"
          />
        </div>

        <Button
          onClick={() => findProjectsMutation.mutate()}
          disabled={findProjectsMutation.isPending || skills.length === 0}
          className="w-full bg-material-blue hover:bg-blue-600 text-white ripple"
        >
          {findProjectsMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Finding Projects...
            </>
          ) : (
            <>
              <Target className="mr-2 h-4 w-4" />
              Find Matching Projects
            </>
          )}
        </Button>

        {matchedProjects.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-material-grey">Projects Needing Your Skills</h3>
            {matchedProjects.map((project) => (
              <Card key={project.id} className="border border-gray-200 hover:material-elevation-2 transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-material-grey">{project.title}</h4>
                        <Badge className="bg-material-green text-white text-xs">
                          {project.matchScore}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-material-grey-light mb-3">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies?.map((tech) => (
                          <Badge 
                            key={tech} 
                            variant="secondary" 
                            className={`text-xs ${skills.includes(tech) ? 'bg-material-blue text-white' : ''}`}
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center text-xs text-material-grey-light space-x-4 mb-3">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{project.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{project.teamSize}</span>
                        </div>
                        <div className="flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          <span>{project.starCount}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={project.author.avatar} />
                            <AvatarFallback>
                              {project.author.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-material-grey-light ml-2">
                            {project.author.fullName}
                          </span>
                        </div>
                        <Button className="bg-material-orange hover:bg-orange-600 text-white ripple text-xs px-3 py-1">
                          Request to Join
                        </Button>
                      </div>

                      <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-material-grey-light">
                        <strong>Why this matches:</strong> {project.matchReason}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}