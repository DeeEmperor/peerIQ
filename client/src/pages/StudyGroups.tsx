import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users, Calendar, Plus, Search } from "lucide-react";
import CreateGroupModal from "@/components/studygroup/CreateGroupModal";
import { apiRequest } from "@/lib/queryClient";
import { GroupWithProgress, StudyGroup } from "@/types";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";

export default function StudyGroups() {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("my-groups");

  // Fetch user's groups
  const { data: myGroups, isLoading: myGroupsLoading } = useQuery({
    queryKey: ['/api/groups'],
  });

  // Fetch public groups
  const { data: publicGroups, isLoading: publicGroupsLoading } = useQuery({
    queryKey: ['/api/groups/public'],
    queryFn: async () => {
      try {
        const res = await apiRequest('GET', '/api/groups/public');
        return res.json();
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  });

  // Filter groups based on search
  const filteredMyGroups = myGroups
    ? myGroups.filter((group: StudyGroup) => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredPublicGroups = publicGroups
    ? publicGroups.filter((group: StudyGroup) => 
        group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleJoinGroup = async (groupId: number) => {
    try {
      await apiRequest('POST', `/api/groups/${groupId}/join`);
      // Invalidate queries to refresh data
      // This would normally be handled with useMutation from tanstack query
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  // Function to determine badge color based on role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Group Lead":
        return "bg-green-100 text-green-800";
      case "Member":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to determine progress color based on readiness
  const getProgressColor = (readiness: number) => {
    if (readiness >= 70) return "bg-primary";
    if (readiness >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar - only on desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Mobile header - omitted for brevity, same as Dashboard */}

        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          {/* Header */}
          <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">Study Groups</h1>
              <Button onClick={() => setCreateGroupOpen(true)}>
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Create Group
              </Button>
            </div>
          </div>

          {/* Groups Content */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search study groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="my-groups" onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="my-groups">My Groups</TabsTrigger>
                <TabsTrigger value="discover">Discover Groups</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-groups">
                {myGroupsLoading ? (
                  <div className="text-center py-10">
                    <p>Loading your study groups...</p>
                  </div>
                ) : filteredMyGroups.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-10">
                      <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Study Groups Yet</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery 
                          ? "No matching groups found. Try a different search."
                          : "You haven't joined any study groups yet."}
                      </p>
                      <Button onClick={() => setCreateGroupOpen(true)}>
                        Create Your First Group
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredMyGroups.map((group: GroupWithProgress) => (
                      <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <Badge variant="outline" className={getRoleBadgeColor(group.role)}>
                              {group.role}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{group.memberCount} members</span>
                            {group.meetingTime && (
                              <>
                                <span className="mx-2">•</span>
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                <span>Meets: {group.meetingTime}</span>
                              </>
                            )}
                          </div>
                          
                          {group.nextTest && (
                            <div className="mt-3">
                              <div className="relative pt-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-semibold text-gray-600">
                                    Test in {group.nextTest.daysUntil} {group.nextTest.daysUntil === 1 ? 'day' : 'days'}
                                  </span>
                                  <span className={`font-semibold ${
                                    group.nextTest.readiness >= 70 
                                      ? 'text-primary-dark' 
                                      : group.nextTest.readiness >= 40 
                                        ? 'text-amber-600' 
                                        : 'text-red-600'
                                  }`}>
                                    {group.nextTest.readiness}% Ready
                                  </span>
                                </div>
                                <Progress 
                                  value={group.nextTest.readiness}
                                  className="h-2 mt-1 bg-gray-200"
                                  indicatorClassName={getProgressColor(group.nextTest.readiness)}
                                />
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-4 text-right">
                            <Button variant="link" className="p-0 h-auto" asChild>
                              <Link href={`/groups/${group.id}`}>
                                Enter Group
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="discover">
                {publicGroupsLoading ? (
                  <div className="text-center py-10">
                    <p>Discovering study groups...</p>
                  </div>
                ) : filteredPublicGroups?.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-10">
                      <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Public Groups Found</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery 
                          ? "No matching groups found. Try a different search."
                          : "There are no public study groups available at the moment."}
                      </p>
                      <Button onClick={() => setCreateGroupOpen(true)}>
                        Create New Group
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPublicGroups?.map((group: any) => (
                      <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{group.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            <span>{group.memberCount || 0} members</span>
                            
                            <span className="mx-2">•</span>
                            
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-1">
                                {group.lead?.avatar ? (
                                  <AvatarImage src={group.lead.avatar} />
                                ) : (
                                  <AvatarFallback>{group.lead?.name?.charAt(0) || "L"}</AvatarFallback>
                                )}
                              </Avatar>
                              <span>Lead: {group.lead?.name || "Unknown"}</span>
                            </div>
                          </div>
                          
                          <div className="mt-4 text-right">
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleJoinGroup(group.id)}
                            >
                              Join Group
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
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
