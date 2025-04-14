import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileCheck, Plus, Calendar, Clock } from "lucide-react";
import TestSettings from "@/components/test/TestSettings";
import { format } from "date-fns";
import { Test } from "@/types";

export default function Tests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [createTestOpen, setCreateTestOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("upcoming");

  // Fetch user's courses
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses/user'],
  });

  // Fetch upcoming tests
  const { data: upcomingTests, isLoading: upcomingLoading } = useQuery({
    queryKey: ['/api/tests/upcoming'],
  });

  // Fetch past tests
  const { data: pastTests, isLoading: pastLoading } = useQuery({
    queryKey: ['/api/tests/past'],
  });

  // Filter tests based on search
  const filterTests = (tests: Test[] | undefined) => {
    if (!tests) return [];
    
    return tests.filter(test => 
      (test.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       (test.description && test.description.toLowerCase().includes(searchQuery.toLowerCase()))) &&
      (!selectedCourse || test.courseId === selectedCourse)
    );
  };

  const filteredUpcoming = filterTests(upcomingTests);
  const filteredPast = filterTests(pastTests);

  // Function to format test date
  const formatTestDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "PPP");
  };

  // Function to determine time until test
  const getTimeUntilTest = (dateString: string) => {
    const now = new Date();
    const testDate = new Date(dateString);
    const diffTime = testDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
    return `In ${Math.floor(diffDays / 30)} months`;
  };

  // Function to get badge color based on time until test
  const getTimeBadgeColor = (dateString: string) => {
    const now = new Date();
    const testDate = new Date(dateString);
    const diffTime = testDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) return "bg-red-100 text-red-800";
    if (diffDays <= 7) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar - only on desktop */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Page Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          {/* Header */}
          <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">Tests</h1>
              <Button 
                onClick={() => {
                  if (courses?.length) {
                    setSelectedCourse(courses[0].id);
                    setCreateTestOpen(true);
                  } else {
                    // Show toast or message that no courses are available
                  }
                }}
                disabled={!courses?.length}
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Schedule Test
              </Button>
            </div>
          </div>

          {/* Tests Content */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="w-full md:w-64">
                <select 
                  className="w-full h-10 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  value={selectedCourse ? selectedCourse.toString() : ""}
                  onChange={(e) => setSelectedCourse(e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">All Courses</option>
                  {courses?.map((course: any) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Tabs defaultValue="upcoming" onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger>
                <TabsTrigger value="past">Past Tests</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                {upcomingLoading ? (
                  <div className="text-center py-10">
                    <p>Loading upcoming tests...</p>
                  </div>
                ) : filteredUpcoming.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-10">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Upcoming Tests</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || selectedCourse
                          ? "No matching tests found. Try a different search."
                          : "You don't have any upcoming tests scheduled."}
                      </p>
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
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredUpcoming.map((test: Test) => (
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
                                  {formatTestDate(test.testDate)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <Badge variant="outline" className={getTimeBadgeColor(test.testDate)}>
                                {getTimeUntilTest(test.testDate)}
                              </Badge>
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
              </TabsContent>

              <TabsContent value="past">
                {pastLoading ? (
                  <div className="text-center py-10">
                    <p>Loading past tests...</p>
                  </div>
                ) : filteredPast?.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-10">
                      <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Past Tests</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery || selectedCourse
                          ? "No matching tests found. Try a different search."
                          : "You don't have any past tests."}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {filteredPast?.map((test: Test) => (
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
                                  {formatTestDate(test.testDate)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                              <Badge variant="outline" className="bg-gray-100 text-gray-800">
                                Completed
                              </Badge>
                              <Button size="sm" variant="outline">
                                View Results
                              </Button>
                            </div>
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
      
      {/* Test Settings Modal */}
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
