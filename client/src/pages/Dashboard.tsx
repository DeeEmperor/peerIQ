import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  FileText,
  TrendingUp,
  Menu,
  X,
  LogOut,
  Settings,
  Home,
} from "lucide-react";

export default function Dashboard() {
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
                StudySync
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/" className="flex items-center space-x-1">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/groups" className="flex items-center space-x-1">
                  <Users className="h-5 w-5" />
                  <span>Study Groups</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/flashcards" className="flex items-center space-x-1">
                  <BookOpen className="h-5 w-5" />
                  <span>Flashcards</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/tests" className="flex items-center space-x-1">
                  <FileText className="h-5 w-5" />
                  <span>Tests</span>
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/leaderboard" className="flex items-center space-x-1">
                  <TrendingUp className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Link>
              </Button>
              <div className="flex items-center ml-4 space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/settings">
                    <Settings className="h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/" className="flex items-center space-x-2">
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/groups" className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Study Groups</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/flashcards" className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Flashcards</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/tests" className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Tests</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/leaderboard" className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Leaderboard</span>
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/settings" className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600">
            Here's your study progress and upcoming events
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Study Groups</CardTitle>
              <CardDescription>Your active groups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <Link href="/groups" className="text-sm text-blue-600 hover:underline">
                View all groups
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Flashcards</CardTitle>
              <CardDescription>Cards created</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <Link href="/flashcards" className="text-sm text-blue-600 hover:underline">
                Create flashcards
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tests</CardTitle>
              <CardDescription>Upcoming tests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <Link href="/tests" className="text-sm text-blue-600 hover:underline">
                View tests
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Performance</CardTitle>
              <CardDescription>Average score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <Link href="/leaderboard" className="text-sm text-blue-600 hover:underline">
                View leaderboard
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Activity Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity yet.</p>
            <p className="mt-2">Join a study group to get started!</p>
            <Button className="mt-4" asChild>
              <Link href="/groups">Browse Study Groups</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}