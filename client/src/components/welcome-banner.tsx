import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";

export function WelcomeBanner() {
  const { data: user } = useQuery({
    queryKey: ["/api/users/me"],
  });

  return (
    <Card className="bg-gradient-to-r from-material-blue to-blue-600 rounded-lg p-6 mb-8 text-white material-elevation-2 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 font-['Inter']">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-blue-100 text-lg">Ready to innovate? Let's build something amazing today.</p>
        </div>
        <div className="hidden md:flex space-x-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{user?.projectCount || 0}</div>
            <div className="text-blue-200 text-sm">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user?.collaborationCount || 0}</div>
            <div className="text-blue-200 text-sm">Collaborations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user?.mentorshipCount || 0}</div>
            <div className="text-blue-200 text-sm">Mentorships</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
