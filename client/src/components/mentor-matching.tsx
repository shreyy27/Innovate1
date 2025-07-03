import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, BadgePlus, Rocket, Star, Contact, Users } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Mentor {
  id: number;
  fullName: string;
  avatar?: string;
  expertise: string[];
  bio?: string;
  rating: number;
}

export function MentorMatching() {
  const [selectedTags] = useState(["Machine Learning", "Web Development"]);
  const { toast } = useToast();

  const { data: mentors } = useQuery({
    queryKey: ["/api/mentors/match", selectedTags],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/mentors/match", {
        tags: selectedTags,
        userId: 1,
      });
      return response.json();
    },
  });

  const connectMutation = useMutation({
    mutationFn: async (mentorId: number) => {
      const response = await apiRequest("POST", "/api/mentors/connect", {
        mentorId,
        menteeId: 1, // Mock user ID
        status: "pending",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Connection Request Sent!",
        description: "Your mentor connection request has been sent.",
      });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to send connection request.",
        variant: "destructive",
      });
    },
  });

  const quickActions = [
    {
      icon: User,
      title: "Find Mentors",
      description: "AI-powered matching",
      bgColor: "bg-material-green bg-opacity-10",
      iconColor: "text-material-green",
    },
    {
      icon: BadgePlus,
      title: "Join a Team",
      description: "Collaborate on projects",
      bgColor: "bg-material-amber bg-opacity-10",
      iconColor: "text-material-amber",
    },
    {
      icon: Rocket,
      title: "Showcase Project",
      description: "Share your work",
      bgColor: "bg-material-blue bg-opacity-10",
      iconColor: "text-material-blue",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="material-elevation-2 animate-slide-up">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-material-grey font-['Inter']">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 ripple justify-start h-auto"
            >
              <div className={`${action.bgColor} p-2 rounded-full`}>
                <action.icon className={`h-5 w-5 ${action.iconColor}`} />
              </div>
              <div className="ml-3 text-left">
                <div className="font-medium text-material-grey">{action.title}</div>
                <div className="text-sm text-material-grey-light">{action.description}</div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Recommended Mentors */}
      <Card className="material-elevation-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-material-grey font-['Inter']">
              Recommended Mentors
            </CardTitle>
            <Badge variant="secondary" className="text-xs">AI Matched</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {mentors?.mentors?.map((mentor: Mentor) => (
            <div
              key={mentor.id}
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:material-elevation-2 transition-shadow duration-200"
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={mentor.avatar} />
                <AvatarFallback>
                  {mentor.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3 flex-1">
                <div className="font-medium text-material-grey text-sm">{mentor.fullName}</div>
                <div className="text-xs text-material-grey-light">
                  {mentor.expertise?.slice(0, 2).join(', ')}
                </div>
                <div className="flex items-center mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-3 w-3 ${i < Math.floor(mentor.rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-xs text-material-grey-light ml-1">{mentor.rating}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => connectMutation.mutate(mentor.id)}
                disabled={connectMutation.isPending}
                className="text-material-blue hover:text-blue-600"
              >
                <Contact className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
