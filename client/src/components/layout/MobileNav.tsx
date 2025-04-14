import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileCheck,
  BarChart3,
} from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    {
      path: "/dashboard",
      label: "Home",
      icon: <LayoutDashboard className="h-6 w-6" />,
    },
    {
      path: "/groups",
      label: "Groups",
      icon: <Users className="h-6 w-6" />,
    },
    {
      path: "/flashcards",
      label: "Cards",
      icon: <BookOpen className="h-6 w-6" />,
    },
    {
      path: "/tests",
      label: "Tests",
      icon: <FileCheck className="h-6 w-6" />,
    },
    {
      path: "/leaderboard",
      label: "Stats",
      icon: <BarChart3 className="h-6 w-6" />,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex flex-col items-center justify-center ${
              location === item.path ? "text-primary" : "text-gray-500"
            }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
