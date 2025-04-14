import { Link, useLocation } from "wouter";
import { useAuthContext } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileCheck,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar() {
  const { userProfile, logout } = useAuthContext();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { 
      path: "/dashboard", 
      label: "Dashboard", 
      icon: <LayoutDashboard className="h-5 w-5 mr-3" /> 
    },
    { 
      path: "/groups", 
      label: "My Groups", 
      icon: <Users className="h-5 w-5 mr-3" /> 
    },
    { 
      path: "/flashcards", 
      label: "Flashcards", 
      icon: <BookOpen className="h-5 w-5 mr-3" /> 
    },
    { 
      path: "/tests", 
      label: "Tests", 
      icon: <FileCheck className="h-5 w-5 mr-3" /> 
    },
    { 
      path: "/leaderboard", 
      label: "Leaderboard", 
      icon: <BarChart3 className="h-5 w-5 mr-3" /> 
    },
    { 
      path: "/settings", 
      label: "Settings", 
      icon: <Settings className="h-5 w-5 mr-3" /> 
    },
  ];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
        <div className="flex flex-col h-0 flex-1">
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
            <div className="flex items-center">
              <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
              <span className="ml-2 text-white text-xl font-semibold">StudySync</span>
            </div>
          </div>
          <div className="flex-1 flex flex-col overflow-y-auto no-scrollbar">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    location === item.path
                      ? "bg-gray-100 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div>
                <Avatar className="h-10 w-10">
                  {userProfile?.avatar ? (
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  ) : (
                    <AvatarFallback>{userProfile?.name?.charAt(0) || "U"}</AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{userProfile?.name || "User"}</p>
                <Button
                  variant="ghost"
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 p-0 h-auto"
                  onClick={handleLogout}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
