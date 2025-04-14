import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CreateFlashcard from "@/components/flashcard/CreateFlashcard";
import TestSettings from "@/components/test/TestSettings";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users,
  Plus,
  BookOpen,
  Calendar,
  Clock,
  MessageSquare,
  AlertTriangle,
  FileCheck,
  BarChart3,
  Settings,
  Loader2,
} from "lucide-react";
// Browser already has WebSocket built-in, no need to import

export default function GroupDetail() {
  const [, params] = useLocation();
  const groupId = params ? parseInt(params.split("/")[2]) : 0;
  const { userProfile } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [addCourseOpen, setAddCourseOpen] = useState(false);
  const [createFlashcardOpen, setCreateFlashcardOpen] = useState(false);
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Fetch group details
  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: [`/api/groups/${groupId}`],
  });

  // Fetch group members
  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: [`/api/groups/${groupId}/members`],
  });

  // Fetch courses for this group
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: [`/api/groups/${groupId}/courses`],
  });

  // Fetch join requests if user is group lead
  const { data: joinRequests, isLoading: requestsLoading } = useQuery({
    queryKey: [`/api/groups/${groupId}/join-requests`],
    enabled: group?.leadId === userProfile?.id,
  });

  // Fetch flashcard decks by course
  const { data: flashcardDecks, isLoading: decksLoading } = useQuery({
    queryKey: [`/api/groups/${groupId}/flashcard-decks`],
  });

  // Fetch upcoming tests
  const { data: upcomingTests, isLoading: testsLoading } = useQuery({
    queryKey: [`/api/groups/${groupId}/tests/upcoming`],
  });

  // Set up websocket connection for real-time collaboration
  useEffect(() => {
    if (!groupId) return;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const newSocket = new WebSocket(wsUrl);
    
    newSocket.onopen = () => {
      console.log("WebSocket connection established");
      // Join the group's room
      newSocket.send(JSON.stringify({
        type: "join",
        groupId,
        userId: userProfile?.id
      }));
    };
    
    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Handle different types of messages
        if (data.type === "flashcard_update") {
          queryClient.invalidateQueries({ queryKey: [`/api/flashcard-decks/${data.deckId}/flashcards`] });
        } else if (data.type === "test_created") {
          queryClient.invalidateQueries({ queryKey: [`/api/groups/${groupId}/tests/upcoming`] });
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
    
    newSocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    setSocket(newSocket);
    
    return () => {
      if (newSocket.readyState === 1) { // 1 = OPEN state in WebSocket
        newSocket.close();
      }
    };
  }, [groupId, userProfile?.id, queryClient]);

  // Form schema for adding a course
  const courseFormSchema = z.object({
    name: z.string().min(2, "Course name must be at least 2 characters"),
    description: z.string().optional(),
  });

  // Initialize form
  const courseForm = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // Add course mutation
  const addCourseMutation = useMutation({
    mutationFn: async (values: z.infer<typeof courseFormSchema>) => {
      const response = await apiRequest("POST", `/api/groups/${groupId}/courses`, values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/groups/${groupId}/courses`] });
      setAddCourseOpen(false);
      courseForm.reset();
      toast({
        title: "Course Added",
        description: "The course has been added to the group successfully.",
      });
    },
    onError: (error) => {
      console.error("Error adding course:", error);
      toast({
        title: "Error",
        description: "Failed to add course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle join request mutation
  const updateJoinRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: number, status: 'accepted' | 'rejected' }) => {
      const response = await apiRequest('PATCH', `/api/join-requests/${requestId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/groups/${groupId}/join-requests`] });
      queryClient.invalidateQueries({ queryKey: [`/api/groups/${groupId}/members`] });
      toast({
        title: "Request Updated",
        description: "The join request has been processed.",
      });
    },
    onError: (error) => {
      console.error("Error updating join request:", error);
      toast({
        title: "Error",
        description: "Failed to process join request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const onCourseSubmit = (values: z.infer<typeof courseFormSchema>) => {
    addCourseMutation.mutate(values);
  };

  const handleUpdateRequest = (requestId: number, status: 'accepted' | 'rejected') => {
    updateJoinRequestMutation.mutate({ requestId, status });
  };

  // Check if user is the group lead
  const isGroupLead = group && userProfile ? group.leadId === userProfile.id : false;

  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (groupLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex mb-4 gap-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold text-gray-900">Group Not Found</h1>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              The study group you're looking for doesn't exist or you don't have access to it.
            </p>
            <Button className="mt-6" asChild>
              <a href="/groups">Back to Groups</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          {/* Group Header */}
          <div className="bg-white border-b border-gray-200">
            <div className="px-4 py-6 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">{group.name}</h1>
                    <Badge variant="outline" className="ml-2 bg-blue-100 text-blue-800">
                      {group.isPublic ? "Public" : "Private"}
                    </Badge>
                    {isGroupLead && (
                      <Badge variant="outline" className="ml-2 bg-green-100 text-green-800">
                        Group Lead
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{group.description}</p>
                </div>
                <div className="flex space-x-3">
                  {isGroupLead && (
                    <Button 
                      onClick={() => setAddCourseOpen(true)}
                      variant="outline"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Course
                    </Button>
                  )}
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    {(members?.length || 0)} Members
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Group Tabs */}
          <div className="px-4 py-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="flashcards">Flashcards</TabsTrigger>
                <TabsTrigger value="tests">Tests</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                {isGroupLead && (
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                )}
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Courses */}
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                          <CardTitle>Courses</CardTitle>
                          <CardDescription>Course rooms in this study group</CardDescription>
                        </div>
                        {isGroupLead && (
                          <Button variant="outline" size="sm" onClick={() => setAddCourseOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Course
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent>
                        {coursesLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : !courses || courses.length === 0 ? (
                          <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Courses Yet</h3>
                            <p className="text-gray-500 mb-4">
                              {isGroupLead 
                                ? "Add your first course to get started with study materials." 
                                : "The group lead has not added any courses yet."}
                            </p>
                            {isGroupLead && (
                              <Button onClick={() => setAddCourseOpen(true)}>
                                Add First Course
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2">
                            {courses.map((course: any) => (
                              <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                  <h3 className="text-lg font-medium text-gray-900 mb-1">{course.name}</h3>
                                  {course.description && (
                                    <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                      <BookOpen className="h-4 w-4 mr-1 text-gray-400" />
                                      <span>{course.deckCount || 0} flashcard decks</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                      <FileCheck className="h-4 w-4 mr-1 text-gray-400" />
                                      <span>{course.testCount || 0} tests</span>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex justify-end">
                                    <Button 
                                      variant="link" 
                                      className="p-0 h-auto"
                                      onClick={() => {
                                        setSelectedCourse(course.id);
                                        setActiveTab("flashcards");
                                      }}
                                    >
                                      View Course
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Activity Feed */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* This would be populated from an API endpoint that returns activity history */}
                          <div className="flex items-start space-x-4 py-2">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">John Doe added a new flashcard</p>
                              <p className="text-xs text-gray-500">Today at 2:30 PM</p>
                              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                                Added to <span className="font-medium">Neural Networks</span> deck
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4 py-2">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>SM</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Sarah Miller scheduled a new test</p>
                              <p className="text-xs text-gray-500">Yesterday at 11:15 AM</p>
                              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
                                <span className="font-medium">Midterm Review</span> - Scheduled for next week
                              </div>
                            </div>
                          </div>
                          <div className="flex items-start space-x-4 py-2">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>AL</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <p className="text-sm font-medium">Alex Lee joined the group</p>
                              <p className="text-xs text-gray-500">3 days ago</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Upcoming Tests */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Tests</CardTitle>
                      </CardHeader>
                      <CardContent className="divide-y divide-gray-200">
                        {testsLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : !upcomingTests || upcomingTests.length === 0 ? (
                          <div className="text-center py-6">
                            <Calendar className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">No upcoming tests scheduled</p>
                          </div>
                        ) : (
                          upcomingTests.map((test: any) => (
                            <div key={test.id} className="py-3 first:pt-0 last:pb-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-900">{test.name}</h4>
                                  <p className="text-xs text-gray-500">{test.description}</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {formatDate(test.testDate)}
                                </Badge>
                              </div>
                              <div className="mt-1 flex items-center text-xs text-gray-500">
                                <FileCheck className="h-3 w-3 mr-1" />
                                <span>{test.questionCount} questions</span>
                                <span className="mx-1">•</span>
                                <span>{
                                  test.testType === 'multiple-choice' ? 'Multiple Choice' : 
                                  test.testType === 'short-answer' ? 'Short Answer' : 'Essay'
                                }</span>
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => setActiveTab("tests")}
                        >
                          View All Tests
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Group Leaderboard */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Leaderboard</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* This would be populated from the leaderboard endpoint */}
                          {[1, 2, 3].map((position) => (
                            <div key={position} className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full ${
                                  position === 1 
                                    ? "bg-primary text-white" 
                                    : "bg-gray-200 text-gray-700"
                                  } flex items-center justify-center text-sm font-medium`}
                                >
                                  {position}
                                </div>
                                <div className="ml-3 flex items-center">
                                  <Avatar className="h-8 w-8">
                                    <AvatarFallback>{position === 1 ? "SM" : position === 2 ? "JD" : "AL"}</AvatarFallback>
                                  </Avatar>
                                  <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">
                                      {position === 1 ? "Sarah Miller" : position === 2 ? "John Doe" : "Alex Lee"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="text-sm font-medium text-gray-900">
                                {position === 1 ? "95" : position === 2 ? "87" : "78"} pts
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => window.location.href = "/leaderboard"}
                        >
                          View Full Leaderboard
                        </Button>
                      </CardFooter>
                    </Card>

                    {/* Join Requests - Only for Group Lead */}
                    {isGroupLead && (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <CardTitle>Join Requests</CardTitle>
                            {joinRequests && joinRequests.length > 0 && (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                {joinRequests.length} pending
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="divide-y divide-gray-200">
                          {requestsLoading ? (
                            <div className="flex justify-center py-4">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                          ) : !joinRequests || joinRequests.length === 0 ? (
                            <div className="text-center py-6">
                              <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                              <p className="text-sm text-gray-500">No pending join requests</p>
                            </div>
                          ) : (
                            joinRequests.map((request: any) => (
                              <div key={request.id} className="py-3 first:pt-0 last:pb-0">
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center">
                                    <Avatar className="h-8 w-8">
                                      {request.user?.avatar ? (
                                        <AvatarImage src={request.user.avatar} alt={request.user.name} />
                                      ) : (
                                        <AvatarFallback>{request.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                      )}
                                    </Avatar>
                                    <div className="ml-3">
                                      <p className="text-sm font-medium text-gray-900">{request.user?.name || "User"}</p>
                                      <p className="text-xs text-gray-500">Requested {formatDate(request.requestedAt)}</p>
                                    </div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="text-primary-dark bg-primary-light hover:bg-primary-dark hover:text-white"
                                      onClick={() => handleUpdateRequest(request.id, 'accepted')}
                                    >
                                      Accept
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="text-gray-700"
                                      onClick={() => handleUpdateRequest(request.id, 'rejected')}
                                    >
                                      Decline
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* Flashcards Tab */}
              <TabsContent value="flashcards">
                <div className="space-y-6">
                  {/* Course/Deck Selection */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <Select 
                        value={selectedCourse ? selectedCourse.toString() : ""} 
                        onValueChange={(value) => setSelectedCourse(parseInt(value))}
                      >
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses?.map((course: any) => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      {selectedCourse && (
                        <Select
                          value={selectedDeck ? selectedDeck.toString() : ""}
                          onValueChange={(value) => setSelectedDeck(parseInt(value))}
                        >
                          <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="Select Deck" />
                          </SelectTrigger>
                          <SelectContent>
                            {flashcardDecks
                              ?.filter((deck: any) => deck.courseId === selectedCourse)
                              .map((deck: any) => (
                                <SelectItem key={deck.id} value={deck.id.toString()}>
                                  {deck.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    
                    <div className="flex gap-2 w-full md:w-auto">
                      <Button 
                        variant="outline"
                        disabled={!selectedCourse}
                        onClick={() => {
                          if (selectedCourse) {
                            setSelectedDeck(null);
                            // Navigate to create deck form
                          }
                        }}
                        className="w-full md:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Deck
                      </Button>
                      <Button 
                        disabled={!selectedDeck}
                        onClick={() => {
                          if (selectedDeck) {
                            setCreateFlashcardOpen(true);
                          }
                        }}
                        className="w-full md:w-auto"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Flashcard
                      </Button>
                    </div>
                  </div>

                  {/* Flashcard Content */}
                  {!selectedCourse ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Choose a course from the dropdown above to view its flashcard decks
                        </p>
                      </CardContent>
                    </Card>
                  ) : !selectedDeck ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Flashcard Decks</CardTitle>
                        <CardDescription>
                          {courses?.find((c: any) => c.id === selectedCourse)?.name || "Course"} flashcard decks
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {decksLoading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : !flashcardDecks || flashcardDecks.filter((d: any) => d.courseId === selectedCourse).length === 0 ? (
                          <div className="text-center py-8">
                            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Flashcard Decks</h3>
                            <p className="text-gray-500 mb-4">
                              This course doesn't have any flashcard decks yet
                            </p>
                            <Button 
                              onClick={() => {
                                // Navigate to create deck form
                              }}
                            >
                              Create First Deck
                            </Button>
                          </div>
                        ) : (
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {flashcardDecks
                              .filter((deck: any) => deck.courseId === selectedCourse)
                              .map((deck: any) => (
                                <Card key={deck.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                  <CardContent className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">{deck.name}</h3>
                                    {deck.description && (
                                      <p className="text-sm text-gray-500 mb-4">{deck.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="outline" className="bg-green-100 text-green-800">
                                        {deck.cardCount || 0} cards
                                      </Badge>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="h-4 w-4 mr-1" />
                                        <span>Updated {formatDate(deck.updatedAt)}</span>
                                      </div>
                                    </div>
                                    <div className="mt-4 flex justify-end">
                                      <Button 
                                        onClick={() => setSelectedDeck(deck.id)}
                                      >
                                        Study Deck
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <CardTitle>
                              {flashcardDecks?.find((d: any) => d.id === selectedDeck)?.name || "Flashcard Deck"}
                            </CardTitle>
                            <CardDescription>
                              {flashcardDecks?.find((d: any) => d.id === selectedDeck)?.description || ""}
                            </CardDescription>
                          </div>
                          <Button 
                            onClick={() => setCreateFlashcardOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Flashcard
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Flashcard study interface would go here */}
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            Flashcard study interface is implemented in a separate component
                          </p>
                          <Button 
                            className="mt-4"
                            onClick={() => window.location.href = `/flashcards/decks/${selectedDeck}`}
                          >
                            Open Study Interface
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Tests Tab */}
              <TabsContent value="tests">
                <div className="space-y-6">
                  {/* Test Controls */}
                  {isGroupLead && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={() => {
                          if (courses?.length) {
                            setSelectedCourse(courses[0].id);
                            setCreateTestOpen(true);
                          } else {
                            toast({
                              title: "No Courses Available",
                              description: "Add a course first before creating a test.",
                              variant: "destructive",
                            });
                          }
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Test
                      </Button>
                    </div>
                  )}

                  {/* Upcoming Tests */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Upcoming Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {testsLoading ? (
                        <div className="flex justify-center py-8">
                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                      ) : !upcomingTests || upcomingTests.length === 0 ? (
                        <div className="text-center py-8">
                          <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Tests</h3>
                          <p className="text-gray-500 mb-4">
                            There are no tests scheduled at this time
                          </p>
                          {isGroupLead && (
                            <Button 
                              onClick={() => {
                                if (courses?.length) {
                                  setSelectedCourse(courses[0].id);
                                  setCreateTestOpen(true);
                                }
                              }}
                              disabled={!courses?.length}
                            >
                              Schedule a Test
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {upcomingTests.map((test: any) => (
                            <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                  <div>
                                    <h3 className="text-lg font-medium text-gray-900">{test.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{test.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <Badge variant="outline" className="bg-gray-100">
                                        {test.testType === 'multiple-choice' ? 'Multiple Choice' : 
                                        test.testType === 'short-answer' ? 'Short Answer' : 'Essay'}
                                      </Badge>
                                      <Badge variant="outline" className="bg-gray-100">
                                        {test.questionCount} questions
                                      </Badge>
                                      <div className="flex items-center text-sm text-gray-500">
                                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                        {formatDate(test.testDate)}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-4">
                                    <Button size="sm">
                                      Prepare
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Past Tests */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Past Tests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Past Tests</h3>
                        <p className="text-gray-500">
                          Your completed tests will appear here
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Members Tab */}
              <TabsContent value="members">
                <Card>
                  <CardHeader>
                    <CardTitle>Group Members</CardTitle>
                    <CardDescription>
                      {members?.length || 0} members in this study group
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {membersLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : !members || members.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Members</h3>
                        <p className="text-gray-500">
                          This group doesn't have any members yet
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {members.map((member: any) => (
                          <div key={member.userId} className="flex items-center p-4 border rounded-lg">
                            <Avatar className="h-10 w-10">
                              {member.user?.avatar ? (
                                <AvatarImage src={member.user.avatar} alt={member.user.name} />
                              ) : (
                                <AvatarFallback>{member.user?.name?.charAt(0) || "U"}</AvatarFallback>
                              )}
                            </Avatar>
                            <div className="ml-4">
                              <p className="text-sm font-medium">
                                {member.user?.name || "Unknown User"}
                                {member.user?.id === userProfile?.id && (
                                  <span className="ml-2 text-xs text-gray-500">(You)</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500">Joined {formatDate(member.joinedAt)}</p>
                            </div>
                            <div className="ml-auto">
                              <Badge variant="outline" className={member.role === 'lead' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                                {member.role === 'lead' ? 'Group Lead' : 'Member'}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab - Only for Group Lead */}
              {isGroupLead && (
                <TabsContent value="settings">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Group Settings</CardTitle>
                        <CardDescription>
                          Manage your study group settings
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <FormLabel>Group Name</FormLabel>
                            <Input defaultValue={group.name} />
                          </div>
                          <div className="space-y-2">
                            <FormLabel>Description</FormLabel>
                            <Textarea defaultValue={group.description} />
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormLabel>Public Group</FormLabel>
                            <Switch defaultChecked={group.isPublic} />
                            <p className="text-sm text-gray-500 ml-2">
                              {group.isPublic 
                                ? "Anyone can find and request to join this group" 
                                : "Only people with the link can request to join"}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FormLabel>Democratized Approval</FormLabel>
                            <Switch defaultChecked={group.democratizedApproval} />
                            <p className="text-sm text-gray-500 ml-2">
                              {group.democratizedApproval 
                                ? "All members can vote on join requests" 
                                : "Only you can approve join requests"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button>Save Changes</Button>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Danger Zone</CardTitle>
                        <CardDescription>
                          Actions that can't be undone
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                            <h3 className="text-md font-medium text-red-800">Delete Study Group</h3>
                            <p className="text-sm text-red-600 mt-1">
                              This will permanently delete this study group and all its content.
                            </p>
                            <Button variant="destructive" className="mt-4">
                              Delete Group
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </main>
        <MobileNav />
      </div>

      {/* Add Course Modal */}
      <Dialog open={addCourseOpen} onOpenChange={setAddCourseOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Course</DialogTitle>
            <DialogDescription>
              Add a new course to your study group
            </DialogDescription>
          </DialogHeader>
          
          <Form {...courseForm}>
            <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-4">
              <FormField
                control={courseForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Advanced Physics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={courseForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe the course content"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setAddCourseOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addCourseMutation.isPending}
                >
                  {addCourseMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Add Course
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Create Flashcard Modal */}
      {selectedDeck && (
        <CreateFlashcard
          isOpen={createFlashcardOpen}
          onClose={() => setCreateFlashcardOpen(false)}
          deckId={selectedDeck}
        />
      )}

      {/* Create Test Modal */}
      {selectedCourse && (
        <TestSettings
          isOpen={createTestOpen}
          onClose={() => setCreateTestOpen(false)}
          courseId={selectedCourse}
        />
      )}
    </div>
  );
}
