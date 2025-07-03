import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { ActivityWithUser } from "@shared/schema";

export function ActivityFeed() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities", { limit: 10 }],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/activities?limit=10");
      return response.json() as Promise<ActivityWithUser[]>;
    },
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const getActionText = (action: string) => {
    switch (action) {
      case "created_project":
        return "started a new project";
      case "joined_project":
        return "joined team for";
      case "starred_project":
        return "starred project";
      case "requested_mentorship":
        return "requested mentorship for";
      default:
        return action.replace(/_/g, ' ');
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created_project":
        return "bg-material-blue text-white";
      case "joined_project":
        return "bg-material-green text-white";
      case "starred_project":
        return "bg-material-orange text-white";
      case "requested_mentorship":
        return "bg-material-amber text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className="material-elevation-2">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start p-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="material-elevation-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-material-grey font-['Inter']">
            Recent Activity
          </CardTitle>
          <div className="flex items-center text-material-green">
            <div className="w-2 h-2 bg-material-green rounded-full animate-pulse mr-2"></div>
            <span className="text-sm">Live</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={activity.user.avatar} />
                <AvatarFallback>
                  {activity.user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 flex-1">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="font-medium text-material-grey text-sm">
                    {activity.user.fullName}
                  </span>
                  <span className="text-xs text-material-grey-light">
                    {getActionText(activity.action)}
                  </span>
                  {activity.metadata?.projectTitle && (
                    <Badge className={`text-xs px-2 py-1 rounded-full ${getActionColor(activity.action)}`}>
                      {activity.metadata.projectTitle}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-material-grey-light mt-1">
                  {formatTimestamp(activity.createdAt)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-material-grey-light hover:text-material-blue"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          ))}
          
          {!activities?.length && (
            <div className="text-center py-8 text-material-grey-light">
              <p>No recent activity to show</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
