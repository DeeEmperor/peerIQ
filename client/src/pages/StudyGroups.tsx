import { Link } from "wouter";
import { Plus, Users, Search, ArrowRight, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

// Placeholder data - would come from API in real app
const myGroups = [
  {
    id: 1,
    name: "Biology 101",
    description: "Study group for Biology 101 class",
    members: 12,
    joined: true,
    nextSession: "Tomorrow at 3:00 PM",
    courseCount: 3,
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=687&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Advanced Physics",
    description: "Theoretical physics study group",
    members: 8,
    joined: true,
    nextSession: "Friday at 5:00 PM",
    courseCount: 2,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Organic Chemistry",
    description: "Study group for organic chemistry",
    members: 15,
    joined: true,
    nextSession: "Monday at 4:00 PM",
    courseCount: 4,
    image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?q=80&w=870&auto=format&fit=crop",
  },
];

const discoveryGroups = [
  {
    id: 4,
    name: "Computer Science",
    description: "Study group for CS majors",
    members: 25,
    joined: false,
    createdAt: "2 weeks ago",
    image: "https://images.unsplash.com/photo-1617854818583-09e7f077a156?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Calculus III",
    description: "Advanced calculus study group",
    members: 18,
    joined: false,
    createdAt: "3 days ago",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=870&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "French Literature",
    description: "Group for French literature students",
    members: 10,
    joined: false,
    createdAt: "1 month ago",
    image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=873&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Psychology 101",
    description: "Intro to psychology study group",
    members: 22,
    joined: false,
    createdAt: "5 days ago",
    image: "https://images.unsplash.com/photo-1618044733300-9472054094ee?q=80&w=1471&auto=format&fit=crop",
  },
];

export default function StudyGroups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-groups");
  
  // Filter groups based on search query
  const filteredMyGroups = myGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredDiscoveryGroups = discoveryGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Study Groups</h2>
            <p className="text-gray-600">
              Create or join study groups to collaborate with peers
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Study Group</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new study group. 
                    Other students will be able to discover and join your group.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Group Name
                    </label>
                    <Input
                      id="name"
                      placeholder="e.g., Biology 101 Study Group"
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="description"
                      placeholder="Describe what your group is about"
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="privacy" className="text-sm font-medium">
                      Privacy Setting
                    </label>
                    <select
                      id="privacy"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="public">Public - Anyone can join</option>
                      <option value="private">Private - By invitation only</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Create Group</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Search & Filter Section */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Search study groups..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full md:w-1/3 grid-cols-2">
            <TabsTrigger value="my-groups">My Groups</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
          
          {/* My Groups Tab */}
          <TabsContent value="my-groups">
            {filteredMyGroups.length === 0 ? (
              <div className="text-center py-10">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No groups found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? "No groups match your search." : "You haven't joined any study groups yet."}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveTab("discover")}
                >
                  Discover Groups
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMyGroups.map((group) => (
                  <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold text-xl">{group.name}</h3>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-sm">{group.members} members</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 line-clamp-2 mb-4">{group.description}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{group.courseCount} courses</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Next session: {group.nextSession}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 bg-gray-50 border-t flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/groups/${group.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            Options
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                          <DropdownMenuItem>Invite Members</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Leave Group</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Discover Tab */}
          <TabsContent value="discover">
            {filteredDiscoveryGroups.length === 0 ? (
              <div className="text-center py-10">
                <Search className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No groups found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? "No groups match your search." : "There are no groups available to join."}
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Create Your Own Group</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Study Group</DialogTitle>
                      <DialogDescription>
                        Fill in the details to create a new study group.
                      </DialogDescription>
                    </DialogHeader>
                    {/* Form fields would go here, similar to the one above */}
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiscoveryGroups.map((group) => (
                  <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative h-48">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                        <div className="p-4 text-white">
                          <h3 className="font-semibold text-xl">{group.name}</h3>
                          <div className="flex items-center mt-1">
                            <Users className="h-4 w-4 mr-1" />
                            <span className="text-sm">{group.members} members</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <p className="text-gray-600 line-clamp-2 mb-4">{group.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2 text-purple-500" />
                        <span>Created {group.createdAt}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="px-4 py-3 bg-gray-50 border-t flex justify-between">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/groups/${group.id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button size="sm">
                        Request to Join
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}