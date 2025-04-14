import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";

export default function Leaderboard() {
  const { userProfile } = useAuthContext();
  const [timeRange, setTimeRange] = useState("week");
  
  const { data: leaderboardData, isLoading, error } = useQuery({
    queryKey: ['/api/leaderboard', timeRange],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Top Contributors
            </h3>
            <div className="flex space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 py-3">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between px-2 py-2 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200" />
                  <div className="ml-3 flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="ml-3">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32 mt-1" />
                    </div>
                  </div>
                </div>
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </CardContent>
        <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
          <Skeleton className="h-4 w-40" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Top Contributors
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading leaderboard data. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Top Contributors
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No leaderboard data available yet. Keep studying!</p>
        </CardContent>
      </Card>
    );
  }

  const timeRangeToLabel = {
    week: "This Week",
    month: "This Month",
    all: "All Time"
  };

  return (
    <Card>
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Top Contributors
          </h3>
          <div className="flex space-x-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="text-sm text-gray-700 border-gray-300 h-9">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 py-3">
        <div className="space-y-3">
          {leaderboardData.map((entry: any, index: number) => {
            const isCurrentUser = userProfile && entry.user && entry.user.id === userProfile.id;
            
            return (
              <div 
                key={entry.id} 
                className={`flex items-center justify-between px-2 py-2 rounded-lg ${
                  isCurrentUser ? 'bg-indigo-50' : index === 0 ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full ${
                    index === 0 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-200 text-gray-700'
                  } flex items-center justify-center text-sm font-medium`}>
                    {index + 1}
                  </div>
                  <div className="ml-3 flex items-center">
                    <Avatar className="h-8 w-8">
                      {entry.user?.avatar ? (
                        <AvatarImage src={entry.user.avatar} alt={entry.user.name} />
                      ) : (
                        <AvatarFallback>{entry.user?.name?.charAt(0) || "?"}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {isCurrentUser ? 'You' : entry.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-xs text-gray-500">{entry.groupName || 'Multiple groups'}</p>
                    </div>
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {entry.totalPoints} pts
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
        <Link href="/leaderboard" className="text-sm font-medium text-primary hover:text-primary-dark">
          View full leaderboard
          <span aria-hidden="true"> &rarr;</span>
        </Link>
      </div>
    </Card>
  );
}
