import { NavigationHeader } from "@/components/navigation-header";
import { WelcomeBanner } from "@/components/welcome-banner";
import { AIIdeaGenerator } from "@/components/ai-idea-generator";
import { MentorMatching } from "@/components/mentor-matching";
import { ProjectShowcase } from "@/components/project-showcase";
import { ActivityFeed } from "@/components/activity-feed";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <AIIdeaGenerator />
          </div>
          <div className="space-y-6">
            <MentorMatching />
          </div>
        </div>

        <ProjectShowcase />
        
        <div className="mt-8">
          <ActivityFeed />
        </div>
      </main>

      {/* Floating Action Button */}
      <Button
        className="fixed bottom-6 right-6 bg-material-orange hover:bg-orange-600 text-white p-4 rounded-full material-elevation-8 ripple transition-all duration-300 hover:scale-110"
        size="icon"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  );
}
