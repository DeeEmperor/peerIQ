import { useState } from "react";
import { Link } from "wouter";
import {
  Award,
  TrendingUp,
  Calendar,
  CheckCircle,
  BookOpen,
  Users,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Medal,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Placeholder leaderboard data - would come from API in real app
const leaderboardData = {
  users: [
    {
      id: 1,
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
      rank: 1,
      points: 1250,
      studyHours: 45,
      flashcardsMastered: 320,
      testsCompleted: 12,
      testAvgScore: 92,
      groupContributions: 28,
      streak: 14,
      change: "up",
      badge: "gold",
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=26",
      rank: 2,
      points: 1120,
      studyHours: 37,
      flashcardsMastered: 285,
      testsCompleted: 10,
      testAvgScore: 88,
      groupContributions: 32,
      streak: 21,
      change: "up",
      badge: "silver",
    },
    {
      id: 3,
      name: "Sam Wilson",
      avatar: "https://i.pravatar.cc/150?img=8",
      rank: 3,
      points: 980,
      studyHours: 32,
      flashcardsMastered: 210,
      testsCompleted: 8,
      testAvgScore: 85,
      groupContributions: 18,
      streak: 7,
      change: "down",
      badge: "bronze",
    },
    {
      id: 4,
      name: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?img=39",
      rank: 4,
      points: 920,
      studyHours: 28,
      flashcardsMastered: 230,
      testsCompleted: 7,
      testAvgScore: 90,
      groupContributions: 15,
      streak: 5,
      change: "same",
      badge: null,
    },
    {
      id: 5,
      name: "John Doe",
      avatar: null,
      rank: 5,
      points: 850,
      studyHours: 25,
      flashcardsMastered: 190,
      testsCompleted: 6,
      testAvgScore: 82,
      groupContributions: 12,
      streak: 3,
      change: "up",
      badge: null,
    },
    {
      id: 6,
      name: "Michael Brown",
      avatar: "https://i.pravatar.cc/150?img=10",
      rank: 6,
      points: 780,
      studyHours: 22,
      flashcardsMastered: 160,
      testsCompleted: 5,
      testAvgScore: 78,
      groupContributions: 8,
      streak: 2,
      change: "down",
      badge: null,
    },
    {
      id: 7,
      name: "Sarah Lee",
      avatar: "https://i.pravatar.cc/150?img=47",
      rank: 7,
      points: 720,
      studyHours: 20,
      flashcardsMastered: 145,
      testsCompleted: 4,
      testAvgScore: 80,
      groupContributions: 6,
      streak: 4,
      change: "up",
      badge: null,
    },
    {
      id: 8,
      name: "David Chen",
      avatar: "https://i.pravatar.cc/150?img=15",
      rank: 8,
      points: 650,
      studyHours: 18,
      flashcardsMastered: 120,
      testsCompleted: 3,
      testAvgScore: 75,
      groupContributions: 5,
      streak: 1,
      change: "down",
      badge: null,
    },
  ],
  personalStats: {
    rank: 5,
    totalUsers: 42,
    percentile: 88,
    points: 850,
    pointsToNextRank: 70,
    recentAchievements: [
      {
        id: 1,
        title: "Perfect Score",
        description: "Got 100% on the Cell Biology Quiz",
        date: "2 days ago",
        icon: "award",
      },
      {
        id: 2,
        title: "Contribution King",
        description: "Added 50 flashcards to group decks",
        date: "1 week ago",
        icon: "trophy",
      },
      {
        id: 3,
        title: "Study Streak",
        description: "Studied for 7 days in a row",
        date: "2 weeks ago",
        icon: "flame",
      },
    ],
    weeklyActivity: [
      { day: "Mon", hours: 2.5 },
      { day: "Tue", hours: 1.8 },
      { day: "Wed", hours: 3.2 },
      { day: "Thu", hours: 2.0 },
      { day: "Fri", hours: 4.5 },
      { day: "Sat", hours: 1.0 },
      { day: "Sun", hours: 0.5 },
    ],
    improvementAreas: [
      {
        area: "Test Attendance",
        current: 6,
        target: 12,
        description: "Take more practice tests",
      },
      {
        area: "Study Consistency",
        current: 3,
        target: 7,
        description: "Increase your daily study streak",
      },
      {
        area: "Group Participation",
        current: 12,
        target: 20,
        description: "Contribute more to study groups",
      },
    ],
  },
  groups: [
    {
      id: 1,
      name: "Biology 101 Study Group",
      members: 12,
      topPerformer: {
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      averageScore: 85,
    },
    {
      id: 2,
      name: "Advanced Physics",
      members: 8,
      topPerformer: {
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=26",
      },
      averageScore: 88,
    },
    {
      id: 3,
      name: "Organic Chemistry",
      members: 15,
      topPerformer: {
        name: "Michael Brown",
        avatar: "https://i.pravatar.cc/150?img=10",
      },
      averageScore: 82,
    },
  ],
};

export default function Leaderboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [activeTab, setActiveTab] = useState("leaderboard");
  
  // Get user initials for avatar fallback
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Render the badge component based on user's badge
  const renderBadge = (badge: string | null) => {
    if (!badge) return null;
    
    if (badge === "gold") {
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200 absolute -top-2 -right-2 z-10">
          <Medal className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
          1st
        </Badge>
      );
    } else if (badge === "silver") {
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 absolute -top-2 -right-2 z-10">
          <Medal className="h-3 w-3 mr-1 fill-gray-400 text-gray-400" />
          2nd
        </Badge>
      );
    } else if (badge === "bronze") {
      return (
        <Badge className="bg-amber-50 text-amber-900 border-amber-100 absolute -top-2 -right-2 z-10">
          <Medal className="h-3 w-3 mr-1 fill-amber-700 text-amber-700" />
          3rd
        </Badge>
      );
    }
    
    return null;
  };
  
  // Change indicator for user rank
  const renderRankChange = (change: string) => {
    if (change === "up") {
      return <ChevronUp className="h-4 w-4 text-green-500" />;
    } else if (change === "down") {
      return <ChevronDown className="h-4 w-4 text-red-500" />;
    }
    return null;
  };
  
  // Render leaderboard tab
  const renderLeaderboard = () => (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Time Period</label>
          <Select
            value={selectedTimeframe}
            onValueChange={setSelectedTimeframe}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="semester">This Semester</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <label className="text-sm font-medium mb-1 block">Study Group</label>
          <Select
            value={selectedGroup}
            onValueChange={setSelectedGroup}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="1">Biology 101 Study Group</SelectItem>
              <SelectItem value="2">Advanced Physics</SelectItem>
              <SelectItem value="3">Organic Chemistry</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Top 3 cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {leaderboardData.users.slice(0, 3).map((user) => (
          <Card key={user.id} className="overflow-hidden">
            <div className={`h-2 ${
              user.rank === 1 ? 'bg-yellow-400' :
              user.rank === 2 ? 'bg-gray-400' :
              'bg-amber-700'
            }`} />
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <div className={`absolute inset-0 rounded-full -m-1 ${
                    user.rank === 1 ? 'bg-gradient-to-br from-yellow-300 to-amber-500' :
                    user.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                    'bg-gradient-to-br from-amber-600 to-amber-800'
                  }`} style={{ transform: 'scale(1.1)', opacity: 0.5 }} />
                  <Avatar className="h-20 w-20 border-4 border-white relative">
                    <AvatarImage src={user.avatar || ""} alt={user.name} />
                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-2 -right-2 h-8 w-8 rounded-full flex items-center justify-center text-white ${
                    user.rank === 1 ? 'bg-yellow-400' :
                    user.rank === 2 ? 'bg-gray-400' :
                    'bg-amber-700'
                  }`}>
                    {user.rank}
                  </div>
                </div>
                <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{user.points} points</span>
                </div>
                <div className="grid grid-cols-2 gap-2 w-full text-center">
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-sm text-gray-500">Study Hours</div>
                    <div className="font-semibold">{user.studyHours}h</div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <div className="text-sm text-gray-500">Test Score</div>
                    <div className="font-semibold">{user.testAvgScore}%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main leaderboard table */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Leaderboard Rankings</CardTitle>
          <CardDescription>
            {selectedTimeframe === "week" && "This week's top performers"}
            {selectedTimeframe === "month" && "This month's top performers"}
            {selectedTimeframe === "semester" && "This semester's top performers"}
            {selectedTimeframe === "all" && "All-time top performers"}
            {selectedGroup !== "all" && ` in ${leaderboardData.groups.find(g => g.id.toString() === selectedGroup)?.name}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-sm text-gray-500">
                  <th className="py-3 px-4 text-left">Rank</th>
                  <th className="py-3 px-4 text-left">Student</th>
                  <th className="py-3 px-4 text-right">Points</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Study Hours</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Flashcards</th>
                  <th className="py-3 px-4 text-right hidden md:table-cell">Test Score</th>
                  <th className="py-3 px-4 text-right hidden lg:table-cell">Contributions</th>
                  <th className="py-3 px-4 text-right hidden lg:table-cell">Streak</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span 
                          className={`flex items-center justify-center h-7 w-7 rounded-full mr-2 text-white font-medium ${
                            user.rank === 1 ? 'bg-yellow-400' :
                            user.rank === 2 ? 'bg-gray-400' :
                            user.rank === 3 ? 'bg-amber-700' :
                            'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {user.rank}
                        </span>
                        {renderRankChange(user.change)}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={user.avatar || ""} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                          </Avatar>
                          {renderBadge(user.badge)}
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold">{user.points}</td>
                    <td className="py-4 px-4 text-right hidden md:table-cell">{user.studyHours}h</td>
                    <td className="py-4 px-4 text-right hidden md:table-cell">{user.flashcardsMastered}</td>
                    <td className="py-4 px-4 text-right hidden md:table-cell">{user.testAvgScore}%</td>
                    <td className="py-4 px-4 text-right hidden lg:table-cell">{user.groupContributions}</td>
                    <td className="py-4 px-4 text-right hidden lg:table-cell">
                      <div className="flex items-center justify-end">
                        <Calendar className="h-4 w-4 mr-1 text-purple-500" />
                        <span>{user.streak} days</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Group statistics */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Study Group Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaderboardData.groups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{group.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">{group.members} members</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-gray-500 mr-1" />
                    <span className="text-sm text-gray-500">Avg: {group.averageScore}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={group.topPerformer.avatar || ""} alt={group.topPerformer.name} />
                    <AvatarFallback>{getInitials(group.topPerformer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{group.topPerformer.name}</div>
                    <div className="text-xs text-gray-500">Top Performer</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-3">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href={`/groups/${group.id}`}>
                    View Group
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
  
  // Render personal stats tab
  const renderPersonalStats = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column - progress and stats */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm text-gray-500">Rank {leaderboardData.personalStats.rank} of {leaderboardData.personalStats.totalUsers}</div>
                  <div className="text-sm font-medium">Top {leaderboardData.personalStats.percentile}%</div>
                </div>
                <Progress value={leaderboardData.personalStats.percentile} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Beginner</span>
                  <span>Intermediate</span>
                  <span>Expert</span>
                </div>
              </div>
              <div className="text-center">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-violet-500 p-[3px]">
                  <div className="rounded-full bg-white h-full w-full flex items-center justify-center">
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-br from-purple-600 to-violet-500 text-transparent bg-clip-text">{leaderboardData.personalStats.points}</div>
                      <div className="text-xs text-gray-500">POINTS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-center sm:justify-between">
              <div className="mb-4 sm:mb-0">
                <div className="text-center sm:text-left">
                  <span className="text-sm text-gray-500">Points to rank up</span>
                  <div className="text-2xl font-bold">{leaderboardData.personalStats.pointsToNextRank}</div>
                </div>
              </div>
              <div className="space-y-1 text-center sm:text-right">
                <div className="text-sm">How to earn more points:</div>
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex items-center">
                    <BookOpen className="h-3 w-3 mr-1" />
                    <span>10 points per flashcard mastered</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    <span>50 points per test completed</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>20 points per day of study streak</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Weekly activity */}
        <Card>
          <CardHeader>
            <CardTitle>Study Activity</CardTitle>
            <CardDescription>Your hours per day this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-end justify-between pt-6">
              {leaderboardData.personalStats.weeklyActivity.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div 
                    className="w-12 rounded-t-md bg-gradient-to-t from-purple-600 to-violet-500"
                    style={{ height: `${(day.hours / 5) * 120}px` }}
                  ></div>
                  <div className="text-xs mt-2 text-gray-500">{day.day}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div>Total this week: {leaderboardData.personalStats.weeklyActivity.reduce((sum, day) => sum + day.hours, 0).toFixed(1)}h</div>
              <div>Daily average: {(leaderboardData.personalStats.weeklyActivity.reduce((sum, day) => sum + day.hours, 0) / 7).toFixed(1)}h</div>
            </div>
          </CardContent>
        </Card>
        
        {/* Areas to improve */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Areas to Improve</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-[250px] text-sm">
                    These are suggestions for how you can improve your rank on the leaderboard.
                    Focus on these areas to earn more points and climb the rankings.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="space-y-4">
            {leaderboardData.personalStats.improvementAreas.map((area, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{area.area}</h4>
                    <Badge variant="outline" className="bg-purple-50 text-purple-800">
                      +{(area.target - area.current) * 20} pts potential
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 mb-3">{area.description}</div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {area.current}</span>
                      <span>Target: {area.target}</span>
                    </div>
                    <Progress value={(area.current / area.target) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Side column - achievements and badges */}
      <div className="space-y-6">
        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {leaderboardData.personalStats.recentAchievements.map((achievement, i) => (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{achievement.title}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                    <div className="text-xs text-gray-500 mt-1">{achievement.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t">
            <Button variant="outline" size="sm" className="w-full">
              View All Achievements
            </Button>
          </CardFooter>
        </Card>
        
        {/* Rank badges */}
        <Card>
          <CardHeader>
            <CardTitle>Rank Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-2">
                <div className="rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 p-[3px] mx-auto w-14 h-14">
                  <div className="rounded-full bg-white h-full w-full flex items-center justify-center">
                    <Medal className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>
                <div className="text-sm font-medium">Gold</div>
                <div className="text-xs text-gray-500">1,200+ pts</div>
              </div>
              <div className="space-y-2">
                <div className="rounded-full bg-gradient-to-br from-gray-300 to-gray-500 p-[3px] mx-auto w-14 h-14">
                  <div className="rounded-full bg-white h-full w-full flex items-center justify-center">
                    <Medal className="h-6 w-6 fill-gray-400 text-gray-400" />
                  </div>
                </div>
                <div className="text-sm font-medium">Silver</div>
                <div className="text-xs text-gray-500">1,000+ pts</div>
              </div>
              <div className="space-y-2">
                <div className="rounded-full bg-gradient-to-br from-amber-600 to-amber-800 p-[3px] mx-auto w-14 h-14">
                  <div className="rounded-full bg-white h-full w-full flex items-center justify-center">
                    <Medal className="h-6 w-6 fill-amber-700 text-amber-700" />
                  </div>
                </div>
                <div className="text-sm font-medium">Bronze</div>
                <div className="text-xs text-gray-500">800+ pts</div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full mt-4">
                  View More Badges
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>Study Streak Badges</DropdownMenuItem>
                <DropdownMenuItem>Contribution Badges</DropdownMenuItem>
                <DropdownMenuItem>Test Excellence Badges</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 text-transparent bg-clip-text">
              StudySync
            </h1>
          </Link>
          
          <Button asChild>
            <Link href="/">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Performance Analytics</h2>
            <p className="text-gray-600">
              Track your progress and compare with other students
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-1/3 grid-cols-2">
            <TabsTrigger value="leaderboard">
              <Award className="h-4 w-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger value="personal-stats">
              <BarChart3 className="h-4 w-4 mr-2" />
              Your Stats
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard">
            {renderLeaderboard()}
          </TabsContent>
          
          <TabsContent value="personal-stats">
            {renderPersonalStats()}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}