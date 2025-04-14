import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  Users,
  BookOpen,
  FileText,
  MessageSquare,
  Calendar,
  Plus,
  MoreVertical,
  Share,
  Bell,
  Settings,
  LogOut,
  Send,
  ChevronRight,
  Check,
  X,
  UserPlus,
  Clock,
  User,
  Crown,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Placeholder data - would come from API in real app
const groupData = {
  id: 1,
  name: "Biology 101 Study Group",
  description: "A collaborative study group for Biology 101 students. We focus on understanding the core concepts of cell biology, genetics, and plant biology through active discussion and knowledge sharing.",
  image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=687&auto=format&fit=crop",
  members: [
    {
      id: 1,
      name: "John Doe",
      avatar: null,
      role: "owner",
      joinedAt: "3 months ago",
      isOnline: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=26",
      role: "admin",
      joinedAt: "2 months ago",
      isOnline: true,
    },
    {
      id: 3,
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
      role: "member",
      joinedAt: "1 month ago",
      isOnline: false,
    },
    {
      id: 4,
      name: "Sam Wilson",
      avatar: "https://i.pravatar.cc/150?img=8",
      role: "member",
      joinedAt: "2 weeks ago",
      isOnline: true,
    },
    {
      id: 5,
      name: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?img=39",
      role: "member",
      joinedAt: "1 week ago",
      isOnline: false,
    },
  ],
  joinRequests: [
    {
      id: 1,
      name: "Michael Brown",
      avatar: "https://i.pravatar.cc/150?img=10",
      message: "I'm taking Biology 101 this semester and would love to join your study group!",
      requestedAt: "2 days ago",
    },
    {
      id: 2,
      name: "Sarah Lee",
      avatar: "https://i.pravatar.cc/150?img=47",
      message: "Looking for a study group to prepare for the midterm exam.",
      requestedAt: "1 day ago",
    },
  ],
  courses: [
    {
      id: 1,
      name: "Introduction to Cell Biology",
      description: "Basics of cell structure and function",
      flashcardDecks: 2,
      tests: 1,
    },
    {
      id: 2,
      name: "Genetics and Heredity",
      description: "Principles of genetic inheritance and DNA structure",
      flashcardDecks: 1,
      tests: 0,
    },
    {
      id: 3,
      name: "Plant Biology",
      description: "Study of plant structure, growth, and reproduction",
      flashcardDecks: 0,
      tests: 0,
    },
  ],
  upcomingSessions: [
    {
      id: 1,
      title: "Midterm Exam Prep",
      date: "Tomorrow at 3:00 PM",
      attendees: 8,
      location: "Online (Zoom)",
    },
    {
      id: 2,
      title: "Cell Membrane Deep Dive",
      date: "Friday at 5:00 PM",
      attendees: 5,
      location: "Library Study Room 3",
    },
  ],
  recentActivity: [
    {
      id: 1,
      user: "Jane Smith",
      avatar: "https://i.pravatar.cc/150?img=26",
      action: "added a new flashcard deck",
      item: "Cell Organelles",
      time: "2 hours ago",
    },
    {
      id: 2,
      user: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
      action: "scheduled a study session",
      item: "Midterm Exam Prep",
      time: "Yesterday",
    },
    {
      id: 3,
      user: "John Doe",
      avatar: null,
      action: "created a practice test",
      item: "Cell Biology Quiz",
      time: "2 days ago",
    },
  ],
  chatMessages: [
    {
      id: 1,
      sender: {
        id: 2,
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=26",
      },
      message: "Has anyone started reviewing chapter 5 yet?",
      timestamp: "10:15 AM",
    },
    {
      id: 2,
      sender: {
        id: 3,
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?img=5",
      },
      message: "I've gone through the first part about cellular respiration. The diagrams on page 128 are really helpful!",
      timestamp: "10:18 AM",
    },
    {
      id: 3,
      sender: {
        id: 1,
        name: "John Doe",
        avatar: null,
      },
      message: "I created some flashcards for the key terms in that chapter. I'll share them with the group later today.",
      timestamp: "10:22 AM",
    },
    {
      id: 4,
      sender: {
        id: 4,
        name: "Sam Wilson",
        avatar: "https://i.pravatar.cc/150?img=8",
      },
      message: "That would be great! I'm still struggling with the electron transport chain concept.",
      timestamp: "10:25 AM",
    },
    {
      id: 5,
      sender: {
        id: 2,
        name: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?img=26",
      },
      message: "I found a great YouTube video explaining that. I'll post the link in our resources section.",
      timestamp: "10:30 AM",
    },
  ],
};

export default function GroupDetail() {
  const params = useParams();
  const groupId = params.id;
  
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState("");
  
  // Get user initials for avatar fallback
  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Role display components
  const RoleBadge = ({ role }: { role: string }) => {
    if (role === "owner") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 ml-2">
                <Crown className="h-3 w-3 mr-1" />
                Owner
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Group owner with full admin privileges</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    } else if (role === "admin") {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 ml-2">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Admin with moderation privileges</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    return null;
  };
  
  // Handle message sending
  const handleSendMessage = () => {
    if (message.trim()) {
      // Here we would send the message to the server
      // Then clear the input
      setMessage("");
    }
  };
  
  // Handle approving join request
  const handleApproveJoinRequest = (requestId: number) => {
    // Here we would send the approval to the server
    console.log(`Approved request ${requestId}`);
  };
  
  // Handle rejecting join request
  const handleRejectJoinRequest = (requestId: number) => {
    // Here we would send the rejection to the server
    console.log(`Rejected request ${requestId}`);
  };
  
  // Render Overview tab
  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main column - group info and activity */}
      <div className="lg:col-span-2 space-y-6">
        {/* Group info card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>About This Group</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{groupData.description}</p>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">{groupData.members.length}</div>
                <div className="text-sm text-gray-500">Members</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">{groupData.courses.length}</div>
                <div className="text-sm text-gray-500">Courses</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">
                  {groupData.courses.reduce((total, course) => total + course.flashcardDecks, 0)}
                </div>
                <div className="text-sm text-gray-500">Flashcard Decks</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent activity card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {groupData.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={activity.avatar || ""} alt={activity.user} />
                    <AvatarFallback>{getInitials(activity.user)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}
                      {activity.item && <span className="font-medium"> "{activity.item}"</span>}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Courses section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Courses</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Course</DialogTitle>
                  <DialogDescription>
                    Create a new course to organize study materials
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="courseName" className="text-sm font-medium">
                      Course Name
                    </label>
                    <Input
                      id="courseName"
                      placeholder="e.g., Introduction to Calculus"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="courseDescription" className="text-sm font-medium">
                      Description
                    </label>
                    <textarea
                      id="courseDescription"
                      placeholder="Describe what this course covers"
                      className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Course</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {groupData.courses.map((course) => (
              <Card key={course.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{course.name}</CardTitle>
                  <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-purple-500 mr-1" />
                        <span>{course.flashcardDecks} Decks</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 text-purple-500 mr-1" />
                        <span>{course.tests} Tests</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button variant="outline" size="sm" className="w-full">View Course</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Side column - upcoming and members */}
      <div className="space-y-6">
        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="flex flex-1 flex-col items-center justify-center py-4 h-auto">
            <Calendar className="h-6 w-6 mb-2" />
            <span>Schedule Session</span>
          </Button>
          <Button variant="outline" className="flex flex-1 flex-col items-center justify-center py-4 h-auto">
            <UserPlus className="h-6 w-6 mb-2" />
            <span>Invite Members</span>
          </Button>
        </div>
        
        {/* Upcoming sessions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {groupData.upcomingSessions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {groupData.upcomingSessions.map((session) => (
                  <div key={session.id} className="p-4">
                    <div className="font-medium">{session.title}</div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Users className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{session.attendees} attendees</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{session.location}</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-2 w-full">
                      Join Session
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p>No upcoming sessions</p>
                <Button variant="outline" size="sm" className="mt-2">
                  Schedule a Session
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Members card */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle>Members ({groupData.members.length})</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/groups/${groupId}/members`}>
                View All <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {groupData.members.slice(0, 5).map((member) => (
                <div key={member.id} className="flex items-center gap-4 p-4">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={member.avatar || ""} alt={member.name} />
                      <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                    </Avatar>
                    {member.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <p className="text-sm font-medium">{member.name}</p>
                      <RoleBadge role={member.role} />
                    </div>
                    <p className="text-xs text-gray-500">Joined {member.joinedAt}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Message</DropdownMenuItem>
                      {member.role !== "owner" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Remove from Group</DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Join requests - for admins/owners only */}
        {(groupData.members.find(m => m.id === 1)?.role === "owner" || 
          groupData.members.find(m => m.id === 1)?.role === "admin") && 
          groupData.joinRequests.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Join Requests ({groupData.joinRequests.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {groupData.joinRequests.map((request) => (
                  <div key={request.id} className="p-4">
                    <div className="flex items-center gap-4 mb-2">
                      <Avatar>
                        <AvatarImage src={request.avatar || ""} alt={request.name} />
                        <AvatarFallback>{getInitials(request.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{request.name}</p>
                        <p className="text-xs text-gray-500">Requested {request.requestedAt}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{request.message}</p>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        className="w-full" 
                        onClick={() => handleApproveJoinRequest(request.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => handleRejectJoinRequest(request.id)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
  
  // Render Chat tab
  const renderChat = () => (
    <div className="bg-white rounded-lg shadow overflow-hidden h-[calc(100vh-240px)] flex flex-col">
      {/* Chat header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium">Group Chat</h3>
            <Badge variant="outline" className="text-green-600">
              {groupData.members.filter(m => m.isOnline).length} online
            </Badge>
          </div>
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4 mr-1" />
            Mute
          </Button>
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupData.chatMessages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src={msg.sender.avatar || ""} alt={msg.sender.name} />
              <AvatarFallback>{getInitials(msg.sender.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{msg.sender.name}</span>
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
              </div>
              <p className="text-gray-800 mt-1">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Chat input */}
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
  
  // Render Members tab
  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Group Members ({groupData.members.length})</h3>
        <Button variant="outline" size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200">
          <div className="bg-gray-50 py-3 px-6">
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</div>
              <div className="col-span-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</div>
              <div className="col-span-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</div>
              <div className="col-span-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</div>
            </div>
          </div>
          <div className="bg-white divide-y divide-gray-200">
            {groupData.members.map((member) => (
              <div key={member.id} className="py-4 px-6">
                <div className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-5">
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar || ""} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-500">
                          {member.isOnline ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    {member.role === "owner" ? (
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        <Crown className="h-3 w-3 mr-1" />
                        Owner
                      </Badge>
                    ) : member.role === "admin" ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">Member</span>
                    )}
                  </div>
                  <div className="col-span-3 text-sm text-gray-500">{member.joinedAt}</div>
                  <div className="col-span-2 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Message</DropdownMenuItem>
                        {member.role !== "owner" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              {member.role === "admin" ? "Remove Admin Rights" : "Make Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Remove from Group</DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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
            <Link href="/groups">
              Back to Groups
            </Link>
          </Button>
        </div>
      </header>
      
      {/* Hero section */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-500 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">{groupData.name}</h2>
              <p className="mt-2 text-white/80">
                {groupData.members.length} members • {groupData.courses.length} courses
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
                    <MoreVertical className="h-4 w-4 mr-2" />
                    Options
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 mr-2" />
                    <span>Share Group</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="h-4 w-4 mr-2" />
                    <span>Notification Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Group Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Leave Group</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex -space-x-2 overflow-hidden">
                {groupData.members.slice(0, 4).map((member) => (
                  <Avatar key={member.id} className="inline-block h-8 w-8 rounded-full ring-2 ring-white">
                    <AvatarImage src={member.avatar || ""} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                ))}
                {groupData.members.length > 4 && (
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-700 ring-2 ring-white text-xs">
                    +{groupData.members.length - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="mt-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="bg-white/20 text-white">
                <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="chat" className="data-[state=active]:bg-white/20">
                  Chat
                </TabsTrigger>
                <TabsTrigger value="members" className="data-[state=active]:bg-white/20">
                  Members
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <TabsContent value="overview" forceMount={activeTab === "overview"}>
          {renderOverview()}
        </TabsContent>
        <TabsContent value="chat" forceMount={activeTab === "chat"}>
          {renderChat()}
        </TabsContent>
        <TabsContent value="members" forceMount={activeTab === "members"}>
          {renderMembers()}
        </TabsContent>
      </main>
    </div>
  );
}