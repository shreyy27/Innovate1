import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function NavigationHeader() {
  return (
    <header className="bg-white material-elevation-4 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-2xl font-bold text-material-blue font-['Inter']">InnovHub</span>
              <span className="text-sm text-material-grey-light ml-2">SIESGST</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Button variant="default" className="bg-material-blue text-white">
                  Dashboard
                </Button>
                <Button variant="ghost" className="text-material-grey hover:text-material-blue">
                  Projects
                </Button>
                <Button variant="ghost" className="text-material-grey hover:text-material-blue">
                  Mentors
                </Button>
                <Button variant="ghost" className="text-material-grey hover:text-material-blue">
                  Community
                </Button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="text-material-grey hover:text-material-blue">
                <Bell className="h-5 w-5" />
              </Button>
              <Badge className="absolute -top-1 -right-1 bg-material-orange text-white text-xs h-5 w-5 flex items-center justify-center p-0 rounded-full">
                3
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium text-material-grey">
                Arjun Sharma
              </span>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
