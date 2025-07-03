import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, UserPlus, Star, Plus, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ProjectWithAuthor } from "@shared/schema";

export function ProjectShowcase() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/projects", { featured: true, limit: 6 }],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/projects?featured=true&limit=6");
      return response.json() as Promise<ProjectWithAuthor[]>;
    },
  });

  const starMutation = useMutation({
    mutationFn: async ({ projectId, action }: { projectId: number; action: 'star' | 'unstar' }) => {
      if (action === 'star') {
        const response = await apiRequest("POST", `/api/projects/${projectId}/star`, {
          userId: 1, // Mock user ID
        });
        return response.json();
      } else {
        const response = await apiRequest("DELETE", `/api/projects/${projectId}/star`, {
          userId: 1,
        });
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success!",
        description: "Project starred successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Action Failed",
        description: error.message || "Failed to star project",
        variant: "destructive",
      });
    },
  });

  const joinMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/join`, {
        userId: 1, // Mock user ID
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Joined Team!",
        description: "You've successfully joined the project team",
      });
    },
    onError: (error) => {
      toast({
        title: "Join Failed",
        description: error.message || "Failed to join project",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <Card className="material-elevation-2 animate-slide-up">
        <CardHeader>
          <CardTitle>Featured Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2 mb-3">
                  <div className="h-6 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="material-elevation-2 animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-material-grey font-['Inter']">
              Featured Projects
            </CardTitle>
            <p className="text-material-grey-light">Discover what your peers are building</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="border-material-blue text-material-blue hover:bg-material-blue hover:text-white">
              View All
            </Button>
            <Button className="bg-material-blue hover:bg-blue-600 text-white ripple">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects?.map((project) => (
            <Card key={project.id} className="border border-gray-200 overflow-hidden hover:material-elevation-4 transition-shadow duration-300">
              <div className="relative">
                <img
                  className="w-full h-48 object-cover"
                  src={project.imageUrl || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"}
                  alt={project.title}
                />
                <div className="absolute top-2 right-2 flex items-center bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                  <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {project.starCount || project.stars}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-material-grey">{project.title}</h3>
                </div>
                <p className="text-sm text-material-grey-light mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
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
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-material-grey-light hover:text-material-blue"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-material-grey-light hover:text-material-green"
                      onClick={() => joinMutation.mutate(project.id)}
                      disabled={joinMutation.isPending}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-material-grey-light hover:text-material-orange"
                      onClick={() => starMutation.mutate({ 
                        projectId: project.id, 
                        action: project.isStarred ? 'unstar' : 'star' 
                      })}
                      disabled={starMutation.isPending}
                    >
                      <Star className={`h-4 w-4 ${project.isStarred ? 'fill-current text-yellow-500' : ''}`} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
