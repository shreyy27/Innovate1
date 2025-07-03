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
import { FirebaseAuth } from "@/components/firebase-auth";
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
          <TabsList className="grid w-full grid-cols-6 bg-white material-elevation-2">
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
            <TabsTrigger value="firebase" className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.818-3.482a.542.542 0 00-.96 0L3.53 17.984z"/>
              </svg>
              Firebase
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
            
            <TabsContent value="firebase" className="space-y-6">
              <div className="bg-white rounded-lg material-elevation-2 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <svg className="h-8 w-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.89 15.672L6.255.461A.542.542 0 017.27.288l2.543 4.771zm16.794 3.692l-2.25-14a.54.54 0 00-.919-.295L3.316 19.365l7.856 4.427a1.621 1.621 0 001.588 0zM14.3 7.147l-1.818-3.482a.542.542 0 00-.96 0L3.53 17.984z"/>
                  </svg>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">Firebase Integration</h2>
                    <p className="text-gray-600">Demonstration of Firebase SDK integration for authentication and real-time features</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Firebase Authentication Demo</h3>
                    <p className="text-gray-600 mb-4">
                      Experience Firebase Authentication with email/password sign-in. This demo shows how Firebase can be integrated 
                      into InnovHub for secure user authentication and session management.
                    </p>
                    <FirebaseAuth />
                  </div>
                  
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Firebase Features Available</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>• Authentication with email/password, Google OAuth, and more</li>
                      <li>• Real-time database updates with Firestore</li>
                      <li>• File storage and media management</li>
                      <li>• Push notifications via Firebase Cloud Messaging</li>
                      <li>• Analytics and performance monitoring</li>
                      <li>• Hosting for web applications</li>
                    </ul>
                  </div>
                </div>
              </div>
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
