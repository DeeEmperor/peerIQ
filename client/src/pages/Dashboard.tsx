import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import { 
  Users, 
  BookOpen, 
  FileText, 
  Award, 
  Settings, 
  Calendar, 
  Bell, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  
  // Handle user logout
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 text-transparent bg-clip-text mr-2">
              StudySync
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Link>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-purple-600 to-violet-500 rounded-2xl p-8 text-white shadow-lg">
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h2>
            <p className="text-white/80 mb-6">
              Pick up where you left off with your study groups and materials.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm" asChild>
                <Link href="/groups">View My Groups</Link>
              </Button>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm" asChild>
                <Link href="/flashcards">My Flashcards</Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Quick Access Section */}
        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/groups" className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="rounded-full bg-purple-100 p-3 inline-flex mb-3">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium">Study Groups</h4>
              </div>
            </Link>
            
            <Link href="/flashcards" className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="rounded-full bg-blue-100 p-3 inline-flex mb-3">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium">Flashcards</h4>
              </div>
            </Link>
            
            <Link href="/tests" className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="rounded-full bg-green-100 p-3 inline-flex mb-3">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium">Tests</h4>
              </div>
            </Link>
            
            <Link href="/leaderboard" className="block">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="rounded-full bg-amber-100 p-3 inline-flex mb-3">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <h4 className="font-medium">Leaderboard</h4>
              </div>
            </Link>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">Stats & Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Study Time</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12.5 Hours</div>
                <p className="text-xs text-muted-foreground">+2.3 hours from last week</p>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '65%' }} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Flashcards Reviewed</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">243</div>
                <p className="text-xs text-muted-foreground">+43 from last week</p>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Test Performance</CardTitle>
                <CardDescription>Last 3 tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.2%</div>
                <p className="text-xs text-muted-foreground">+3.4% improvement</p>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full">
                  <div className="h-2 bg-purple-500 rounded-full" style={{ width: '87%' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Upcoming Section */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h4 className="font-medium">Biology Study Group</h4>
                <p className="text-sm text-gray-500">Tomorrow at 3:00 PM</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Join
              </Button>
            </div>
            
            <div className="p-6 border-b border-gray-100 flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h4 className="font-medium">Chemistry Test</h4>
                <p className="text-sm text-gray-500">Friday at 10:00 AM</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Prepare
              </Button>
            </div>
            
            <div className="p-6 flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h4 className="font-medium">Physics Flashcard Review</h4>
                <p className="text-sm text-gray-500">Saturday at 2:00 PM</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                Review
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}