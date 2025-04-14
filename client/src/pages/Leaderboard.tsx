import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useAuthContext } from "@/context/AuthContext";
import { UserStat } from "@/types";
import { BarChart3 } from "lucide-react";

export default function Leaderboard() {
  const { userProfile } = useAuthContext();
  const [timeRange, setTimeRange] = useState("week");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");

  // Fetch user's groups
  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['/api/groups'],
  });

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ['/api/leaderboard', timeRange, selectedGroup],
  });

  if (isLoading || groupsLoading) {
    return (
      <div className="min-h-screen flex overflow-hidden bg-gray-50">
        <Sidebar />
        <div className="flex flex-col w-0 flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
            <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900">Leaderboard</h1>
            </div>
            <div className="py-6 px-4 sm:px-6 lg:px-8">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <CardTitle>Loading...</CardTitle>
                  <div className="flex space-x-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="ml-4">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-6 w-16" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
          <MobileNav />
        </div>
      </div>
    );
  }

  // Convert timeRange to human-readable format
  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "all":
        return "All Time";
      default:
        return "This Week";
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Leaderboard</h1>
          </div>
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle>Top Contributors</CardTitle>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Groups</SelectItem>
                      {groups?.map((group: any) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {!leaderboardData || leaderboardData.length === 0 ? (
                  <div className="text-center py-10">
                    <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Leaderboard Data</h3>
                    <p className="text-gray-500">
                      There's no activity data available for the selected timeframe and group.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboardData.map((entry: UserStat, index: number) => {
                      const isCurrentUser = userProfile && entry.user && entry.user.id === userProfile.id;
                      
                      return (
                        <div
                          key={entry.id}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg ${
                            isCurrentUser 
                              ? "bg-indigo-50" 
                              : index === 0 
                                ? "bg-gray-50" 
                                : ""
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`flex-shrink-0 h-10 w-10 rounded-full ${
                              index === 0 
                                ? "bg-primary text-white" 
                                : "bg-gray-200 text-gray-700"
                              } flex items-center justify-center text-sm font-medium`}
                            >
                              {index + 1}
                            </div>
                            <div className="ml-4 flex items-center">
                              <Avatar className="h-10 w-10">
                                {entry.user?.avatar ? (
                                  <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                                ) : (
                                  <AvatarFallback>{entry.user?.name?.charAt(0) || "?"}</AvatarFallback>
                                )}
                              </Avatar>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {isCurrentUser ? "You" : entry.user?.name || "Unknown User"}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs text-gray-500">{entry.groupName || "Multiple groups"}</p>
                                  {isCurrentUser && (
                                    <Badge variant="outline" className="bg-indigo-100 text-indigo-800 text-xs">
                                      You
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="grid grid-cols-3 gap-4 text-center hidden md:grid">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{entry.testScores}</p>
                                <p className="text-xs text-gray-500">Test Score</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{entry.flashcardContributions}</p>
                                <p className="text-xs text-gray-500">Flashcards</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{entry.attendance}</p>
                                <p className="text-xs text-gray-500">Attendance</p>
                              </div>
                            </div>
                            <div className="text-lg font-semibold text-gray-900">
                              {entry.totalPoints} pts
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>How Points Are Calculated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Test Performance</h3>
                    <p className="text-sm text-gray-500">
                      Points are awarded based on your test scores. Higher scores earn more points.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Flashcard Contributions</h3>
                    <p className="text-sm text-gray-500">
                      Creating and sharing flashcards earns points. More quality cards = more points.
                    </p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-2">Study Consistency</h3>
                    <p className="text-sm text-gray-500">
                      Regular attendance and participation in study sessions boosts your points.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
