import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Loader2, X, Clock, Users, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProjectIdea {
  title: string;
  description: string;
  technologies: string[];
  duration: string;
  teamSize: string;
}

export function AIIdeaGenerator() {
  const [tags, setTags] = useState<string[]>(["Machine Learning", "Web Development"]);
  const [newTag, setNewTag] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [generatedIdeas, setGeneratedIdeas] = useState<ProjectIdea[]>([]);
  const { toast } = useToast();

  const generateIdeasMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/generate-ideas", {
        tags,
        difficulty,
        userId: 1, // Mock user ID
      });
      return response.json();
    },
    onSuccess: (data) => {
      setGeneratedIdeas(data.ideas || []);
      toast({
        title: "Ideas Generated!",
        description: `Generated ${data.ideas?.length || 0} project ideas using AI`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate ideas. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTag();
    }
  };

  return (
    <Card className="material-elevation-2 animate-slide-up">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="bg-material-orange bg-opacity-10 p-3 rounded-full">
            <Lightbulb className="h-6 w-6 text-material-orange" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold text-material-grey font-['Inter']">
              AI Idea Generator
            </CardTitle>
            <p className="text-material-grey-light">Powered by Gemini API</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-material-grey mb-2 block">
            What interests you?
          </Label>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="bg-material-blue text-white px-3 py-1 flex items-center gap-2"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-blue-700"
                  onClick={() => removeTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Add tags (AI, Web Dev, Mobile, IoT...)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={handleKeyPress}
            className="focus:ring-2 focus:ring-material-blue"
          />
        </div>

        <div>
          <Label className="text-sm font-medium text-material-grey mb-2 block">
            Difficulty Level
          </Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger className="focus:ring-2 focus:ring-material-blue">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => generateIdeasMutation.mutate()}
          disabled={generateIdeasMutation.isPending || tags.length === 0}
          className="w-full bg-material-orange hover:bg-orange-600 text-white ripple"
        >
          {generateIdeasMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Ideas...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Ideas
            </>
          )}
        </Button>

        {generatedIdeas.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-material-grey">Generated Ideas</h3>
            {generatedIdeas.map((idea, index) => (
              <Card key={index} className="border border-gray-200 hover:material-elevation-2 transition-shadow duration-200">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-material-grey mb-2">{idea.title}</h4>
                      <p className="text-sm text-material-grey-light mb-3">{idea.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {idea.technologies?.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-material-grey-light space-x-4">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{idea.duration}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{idea.teamSize}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="ml-4 bg-material-blue hover:bg-blue-600 text-white ripple">
                      Start Project
                    </Button>
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
