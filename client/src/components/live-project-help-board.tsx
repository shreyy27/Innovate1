import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, Plus, MessageSquare, Clock, Users, Zap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface HelpRequest {
  id: number;
  title: string;
  description: string;
  projectName: string;
  skillsNeeded: string[];
  urgency: 'low' | 'medium' | 'high';
  requestType: 'frontend' | 'backend' | 'mobile' | 'design' | 'data' | 'other';
  author: {
    id: number;
    fullName: string;
    avatar?: string;
  };
  createdAt: string;
  responses: number;
}

export function LiveProjectHelpBoard() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    projectName: '',
    skillsNeeded: '',
    urgency: 'medium' as const,
    requestType: 'frontend' as const,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: helpRequests, isLoading } = useQuery({
    queryKey: ["/api/help-requests"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/help-requests");
      return response.json() as Promise<HelpRequest[]>;
    },
    refetchInterval: 15000, // Refetch every 15 seconds for real-time updates
  });

  const createRequestMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/help-requests", {
        ...newRequest,
        skillsNeeded: newRequest.skillsNeeded.split(',').map(s => s.trim()).filter(Boolean),
        authorId: 1, // Mock user ID
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/help-requests"] });
      setIsCreateDialogOpen(false);
      setNewRequest({
        title: '',
        description: '',
        projectName: '',
        skillsNeeded: '',
        urgency: 'medium',
        requestType: 'frontend',
      });
      toast({
        title: "Help Request Posted!",
        description: "Your request is now live. Other students can offer help.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Post",
        description: error.message || "Failed to create help request.",
        variant: "destructive",
      });
    },
  });

  const offerHelpMutation = useMutation({
    mutationFn: async (requestId: number) => {
      const response = await apiRequest("POST", `/api/help-requests/${requestId}/offer-help`, {
        userId: 1, // Mock user ID
        message: "I'd like to help with this project!",
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Help Offered!",
        description: "Your offer to help has been sent to the project owner.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Offer Help",
        description: error.message || "Failed to send help offer.",
        variant: "destructive",
      });
    },
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-material-orange text-white';
      case 'low': return 'bg-material-green text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRequestTypeIcon = (type: string) => {
    switch (type) {
      case 'frontend': return '🎨';
      case 'backend': return '⚙️';
      case 'mobile': return '📱';
      case 'design': return '✨';
      case 'data': return '📊';
      default: return '💡';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Just posted";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card className="material-elevation-2 animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-material-amber bg-opacity-10 p-3 rounded-full">
              <HelpCircle className="h-6 w-6 text-material-amber" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-material-grey font-['Inter']">
                Live Project Help Board
              </CardTitle>
              <div className="flex items-center text-material-green mt-1">
                <div className="w-2 h-2 bg-material-green rounded-full animate-pulse mr-2"></div>
                <span className="text-sm">Live Updates</span>
              </div>
            </div>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-material-amber hover:bg-yellow-600 text-white ripple">
                <Plus className="mr-2 h-4 w-4" />
                Ask for Help
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Request Project Help</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">What do you need help with?</Label>
                  <Input
                    id="title"
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    placeholder="e.g., Need React developer for e-commerce app"
                  />
                </div>
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={newRequest.projectName}
                    onChange={(e) => setNewRequest({...newRequest, projectName: e.target.value})}
                    placeholder="e.g., Campus Marketplace"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    placeholder="Describe what kind of help you need..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="skills">Skills Needed (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={newRequest.skillsNeeded}
                    onChange={(e) => setNewRequest({...newRequest, skillsNeeded: e.target.value})}
                    placeholder="React, Node.js, MongoDB"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Request Type</Label>
                    <Select value={newRequest.requestType} onValueChange={(value: any) => setNewRequest({...newRequest, requestType: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="data">Data Science</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Urgency</Label>
                    <Select value={newRequest.urgency} onValueChange={(value: any) => setNewRequest({...newRequest, urgency: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button 
                  onClick={() => createRequestMutation.mutate()}
                  disabled={createRequestMutation.isPending || !newRequest.title || !newRequest.description}
                  className="w-full bg-material-amber hover:bg-yellow-600 text-white"
                >
                  Post Help Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg animate-pulse">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 w-16 bg-gray-200 rounded"></div>
                      <div className="h-6 w-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {helpRequests?.map((request) => (
              <div
                key={request.id}
                className="p-4 border border-gray-200 rounded-lg hover:material-elevation-2 transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={request.author.avatar} />
                      <AvatarFallback>
                        {request.author.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getRequestTypeIcon(request.requestType)}</span>
                        <h4 className="font-medium text-material-grey">{request.title}</h4>
                        <Badge className={`text-xs ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency}
                        </Badge>
                      </div>
                      <p className="text-sm text-material-grey-light mb-2">{request.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {request.skillsNeeded?.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-xs text-material-grey-light space-x-4">
                        <span>Project: <strong>{request.projectName}</strong></span>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{formatTimestamp(request.createdAt)}</span>
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          <span>{request.responses || 0} responses</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => offerHelpMutation.mutate(request.id)}
                    disabled={offerHelpMutation.isPending}
                    className="bg-material-blue hover:bg-blue-600 text-white ripple text-sm px-4"
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Offer Help
                  </Button>
                </div>
              </div>
            ))}
            {!helpRequests?.length && (
              <div className="text-center py-8 text-material-grey-light">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No help requests yet. Be the first to ask for assistance!</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}