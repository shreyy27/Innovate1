import { useState } from "react";
import { NavigationHeader } from "@/components/navigation-header";
import { WelcomeBanner } from "@/components/welcome-banner";
import { AIIdeaGenerator } from "@/components/ai-idea-generator";
import { SkillProjectMatcher } from "@/components/skill-project-matcher";
import { LiveProjectHelpBoard } from "@/components/live-project-help-board";
import { MentorMatching } from "@/components/mentor-matching";
import { GoogleTechBadgesShowcase } from "@/components/google-tech-badges";
import { ProjectShowcase } from "@/components/project-showcase";
import { ActivityFeed } from "@/components/activity-feed";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Lightbulb, Target, HelpCircle, Users, Trophy } from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("ideas");

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeBanner />
        
        {/* Enhanced Feature Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 bg-white material-elevation-2">
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Ideas
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Skill Match
            </TabsTrigger>
            <TabsTrigger value="help" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Help Board
            </TabsTrigger>
            <TabsTrigger value="mentors" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Mentors
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              Badges
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="ideas" className="space-y-6">
              <AIIdeaGenerator />
            </TabsContent>
            
            <TabsContent value="skills" className="space-y-6">
              <SkillProjectMatcher />
            </TabsContent>
            
            <TabsContent value="help" className="space-y-6">
              <LiveProjectHelpBoard />
            </TabsContent>
            
            <TabsContent value="mentors" className="space-y-6">
              <MentorMatching />
            </TabsContent>
            
            <TabsContent value="badges" className="space-y-6">
              <GoogleTechBadgesShowcase />
            </TabsContent>
          </div>
        </Tabs>

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
