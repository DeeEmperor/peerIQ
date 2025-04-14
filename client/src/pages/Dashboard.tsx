import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import StatsOverview from "@/components/dashboard/StatsOverview";
import StudyGroupsList from "@/components/dashboard/StudyGroupsList";
import RecentFlashcards from "@/components/dashboard/RecentFlashcards";
import UpcomingTests from "@/components/dashboard/UpcomingTests";
import Leaderboard from "@/components/dashboard/Leaderboard";
import JoinRequests from "@/components/dashboard/JoinRequests";
import CreateGroupModal from "@/components/studygroup/CreateGroupModal";
import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { StatOverview } from "@/types";

export default function Dashboard() {
  const { userProfile } = useAuthContext();
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: statsData } = useQuery({
    queryKey: ['/api/stats/overview'],
    placeholderData: {
      weeklyTime: "8.5 hrs",
      testsCompleted: 12,
      flashcardsCreated: 87,
      activeGroups: 4
    } as StatOverview
  });

  const { data: notifications } = useQuery({
    queryKey: ['/api/notifications'],
  });

  const unreadNotifications = notifications?.filter((notif: any) => !notif.read)?.length || 0;

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar - only on desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header */}
        <div className="relative z-10 flex-shrink-0 h-16 bg-white border-b border-gray-200 md:hidden">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center">
              <button 
                className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-light"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="ml-4 flex items-center">
                <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
                <span className="ml-2 text-primary text-xl font-semibold">StudySync</span>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-1 rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative">
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <div className="ml-4">
                <Avatar className="h-8 w-8">
                  {userProfile?.avatar ? (
                    <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                  ) : (
                    <AvatarFallback>{userProfile?.name?.charAt(0) || "U"}</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          {/* Dashboard Header */}
          <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <div className="flex space-x-3">
                <Button 
                  className="inline-flex items-center"
                  onClick={() => setCreateGroupOpen(true)}
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Create Group
                </Button>
                <div className="relative md:hidden">
                  <button className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-500 focus:outline-none">
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs font-medium text-white">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Stats Cards */}
            <StatsOverview stats={statsData || {
              weeklyTime: "0 hrs",
              testsCompleted: 0,
              flashcardsCreated: 0,
              activeGroups: 0
            }} />

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Study Groups and Flashcards */}
              <div className="lg:col-span-2">
                {/* My Study Groups Section */}
                <StudyGroupsList />

                {/* Recent Flashcards */}
                <RecentFlashcards />
              </div>

              {/* Right Column: Upcoming Tests, Leaderboard, Join Requests */}
              <div className="space-y-6">
                {/* Upcoming Tests */}
                <UpcomingTests />

                {/* Leaderboard */}
                <Leaderboard />

                {/* Join Requests */}
                <JoinRequests />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Create Group Modal */}
      <CreateGroupModal 
        isOpen={createGroupOpen}
        onClose={() => setCreateGroupOpen(false)}
      />
    </div>
  );
}
