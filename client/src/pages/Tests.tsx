import { useState } from "react";
import { Link } from "wouter";
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  MoreVertical,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  HelpCircle
} from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Placeholder data - would come from API in real app
const upcomingTests = [
  {
    id: 1,
    title: "Biology Midterm",
    description: "Covers cell structures, genetics, and plant biology",
    course: "Biology 101",
    group: "Biology Study Group",
    dueDate: "Tomorrow at 3:00 PM",
    questions: 25,
    timeLimit: 60,
    status: "pending"
  },
  {
    id: 2,
    title: "Physics Concepts Quiz",
    description: "Test on basic mechanics concepts and formulas",
    course: "Physics 101",
    group: "Advanced Physics",
    dueDate: "Friday at 10:00 AM",
    questions: 15,
    timeLimit: 30,
    status: "pending"
  },
];

const pastTests = [
  {
    id: 3,
    title: "Cell Biology Quiz",
    description: "Quiz on cell organelles and functions",
    course: "Biology 101",
    group: "Biology Study Group",
    date: "Oct 12, 2023",
    questions: 15,
    score: 92,
    status: "completed"
  },
  {
    id: 4,
    title: "Organic Chemistry Test",
    description: "Test on functional groups and reactions",
    course: "Organic Chemistry",
    group: "Organic Chemistry",
    date: "Sep 28, 2023",
    questions: 20,
    score: 76,
    status: "completed"
  },
  {
    id: 5,
    title: "Physics Problem Set",
    description: "Problem set on kinematics and dynamics",
    course: "Physics 101",
    group: "Advanced Physics",
    date: "Sep 15, 2023",
    questions: 10,
    score: 85,
    status: "completed"
  },
];

// Sample test questions
const sampleTest = {
  id: 1,
  title: "Biology Midterm",
  description: "Covers cell structures, genetics, and plant biology",
  course: "Biology 101",
  group: "Biology Study Group",
  timeLimit: 60,
  questions: [
    {
      id: 1,
      type: "multiple_choice",
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Endoplasmic reticulum", "Golgi apparatus"],
      correctAnswer: "Mitochondria"
    },
    {
      id: 2,
      type: "multiple_choice",
      question: "Which organelle is responsible for protein synthesis?",
      options: ["Ribosome", "Lysosome", "Peroxisome", "Vacuole"],
      correctAnswer: "Ribosome"
    },
    {
      id: 3,
      type: "true_false",
      question: "Photosynthesis takes place in the mitochondria.",
      correctAnswer: false
    },
    {
      id: 4,
      type: "multiple_choice",
      question: "What is the primary function of the cell membrane?",
      options: ["Cell division", "Energy production", "Waste removal", "Controlling what enters and exits the cell"],
      correctAnswer: "Controlling what enters and exits the cell"
    },
    {
      id: 5,
      type: "true_false",
      question: "DNA replication occurs during the S phase of the cell cycle.",
      correctAnswer: true
    }
  ]
};

export default function Tests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [takeTestMode, setTakeTestMode] = useState(false);
  const [currentTestId, setCurrentTestId] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | boolean>>({});
  const [testCompleted, setTestCompleted] = useState(false);
  const [generatingTest, setGeneratingTest] = useState(false);
  
  // Filter tests based on search query
  const filteredUpcomingTests = upcomingTests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.course.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPastTests = pastTests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.course.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Test-taking functions
  const startTest = (testId: number) => {
    setCurrentTestId(testId);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setTakeTestMode(true);
    setTestCompleted(false);
  };
  
  const exitTest = () => {
    setTakeTestMode(false);
    setCurrentTestId(null);
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < sampleTest.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question - complete test
      setTestCompleted(true);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleAnswerSelection = (questionId: number, answer: string | boolean) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answer
    });
  };
  
  const calculateScore = () => {
    let correctCount = 0;
    sampleTest.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    
    return Math.round((correctCount / sampleTest.questions.length) * 100);
  };
  
  // Generate AI test
  const generateTest = () => {
    setGeneratingTest(true);
    
    // Simulate API call to generate a test
    setTimeout(() => {
      setGeneratingTest(false);
    }, 2000);
  };
  
  // Render functions
  const renderTestList = () => (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Tests</h2>
          <p className="text-gray-600">
            Take practice tests and track your progress
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Generate Test
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Test</DialogTitle>
                <DialogDescription>
                  Create a new test based on your flashcards or specific topics.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="testTitle" className="text-sm font-medium">
                    Test Title
                  </label>
                  <Input
                    id="testTitle"
                    placeholder="e.g., Biology Midterm Practice"
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="testDescription" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="testDescription"
                    placeholder="Describe what topics this test covers"
                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="source" className="text-sm font-medium">
                    Generate From
                  </label>
                  <select
                    id="source"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select source</option>
                    <option value="flashcards">My Flashcards</option>
                    <option value="custom">Custom Topics</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="flashcardDeck" className="text-sm font-medium">
                    Flashcard Deck
                  </label>
                  <select
                    id="flashcardDeck"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a deck</option>
                    <option value="biology-101">Biology 101 - Cell Structure</option>
                    <option value="physics-101">Physics - Mechanics</option>
                    <option value="organic-chemistry">Organic Chemistry - Functional Groups</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="questionCount" className="text-sm font-medium">
                      Number of Questions
                    </label>
                    <Input
                      id="questionCount"
                      type="number"
                      defaultValue="10"
                      min="5"
                      max="50"
                      className="w-full"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="timeLimit" className="text-sm font-medium">
                      Time Limit (minutes)
                    </label>
                    <Input
                      id="timeLimit"
                      type="number"
                      defaultValue="30"
                      min="5"
                      max="180"
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Question Types</label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="questionType1" defaultChecked />
                      <Label htmlFor="questionType1">Multiple Choice</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="questionType2" defaultChecked />
                      <Label htmlFor="questionType2">True/False</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="questionType3" />
                      <Label htmlFor="questionType3">Short Answer</Label>
                    </div>
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty Level
                  </label>
                  <select
                    id="difficulty"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button 
                  type="submit" 
                  onClick={generateTest}
                  disabled={generatingTest}
                >
                  {generatingTest ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    "Generate Test"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search tests..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-1/2 grid-cols-2">
          <TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger>
          <TabsTrigger value="past">Past Tests</TabsTrigger>
        </TabsList>
        
        {/* Upcoming Tests Tab */}
        <TabsContent value="upcoming">
          {filteredUpcomingTests.length === 0 ? (
            <div className="text-center py-10">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No upcoming tests
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? "No tests match your search." : "You don't have any upcoming tests at the moment."}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Generate a Practice Test</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate New Test</DialogTitle>
                    <DialogDescription>
                      Create a new practice test.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Form fields would go here, similar to above */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredUpcomingTests.map((test) => (
                <Card key={test.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold">{test.title}</CardTitle>
                        <CardDescription className="mt-1">{test.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-purple-50 text-purple-800 hover:bg-purple-50">
                        {test.course}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pb-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Due: {test.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>{test.questions} questions</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{test.timeLimit} minute time limit</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-3 border-t">
                    <Button 
                      className="w-full"
                      onClick={() => startTest(test.id)}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Take Test
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        {/* Past Tests Tab */}
        <TabsContent value="past">
          {filteredPastTests.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No past tests
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? "No tests match your search." : "You haven't taken any tests yet."}
              </p>
              <Button 
                variant="outline" 
                onClick={() => setActiveTab("upcoming")}
              >
                View Upcoming Tests
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="min-w-full divide-y divide-gray-200">
                <div className="bg-gray-50 divide-y divide-gray-200">
                  <div className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">Test</div>
                      <div className="col-span-2">Course</div>
                      <div className="col-span-2">Date</div>
                      <div className="col-span-2">Score</div>
                      <div className="col-span-2">Actions</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white divide-y divide-gray-200">
                  {filteredPastTests.map((test) => (
                    <div key={test.id} className="px-6 py-4 whitespace-nowrap">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <FileText className="h-5 w-5 text-purple-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{test.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{test.description}</div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 text-sm text-gray-900">{test.course}</div>
                        <div className="col-span-2 text-sm text-gray-500">{test.date}</div>
                        <div className="col-span-2">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                            ${test.score >= 80 ? 'bg-green-100 text-green-800' : 
                              test.score >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {test.score}%
                          </div>
                        </div>
                        <div className="col-span-2 flex space-x-2">
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Retake Test</DropdownMenuItem>
                              <DropdownMenuItem>Export Results</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
  
  const renderTestMode = () => {
    if (testCompleted) {
      return renderTestResults();
    }
    
    const currentQuestion = sampleTest.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / sampleTest.questions.length) * 100;
    
    return (
      <div className="pb-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" onClick={exitTest}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Exit Test
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {sampleTest.title}
            </h2>
            <p className="text-sm text-gray-500">{sampleTest.course}</p>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Time left: 58:24</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-violet-400 h-2 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-center mb-4">
          <p className="text-gray-500">
            Question {currentQuestionIndex + 1} of {sampleTest.questions.length}
          </p>
        </div>
        
        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
          <h3 className="text-lg font-medium mb-6">{currentQuestion.question}</h3>
          
          {currentQuestion.type === 'multiple_choice' && (
            <RadioGroup 
              value={selectedAnswers[currentQuestion.id] as string || ""}
              onValueChange={(value) => handleAnswerSelection(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          
          {currentQuestion.type === 'true_false' && (
            <RadioGroup 
              value={selectedAnswers[currentQuestion.id]?.toString() || ""}
              onValueChange={(value) => handleAnswerSelection(currentQuestion.id, value === "true")}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true" className="flex-grow cursor-pointer">
                  True
                </Label>
              </div>
              <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false" className="flex-grow cursor-pointer">
                  False
                </Label>
              </div>
            </RadioGroup>
          )}
        </div>
        
        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>
          
          <Button onClick={nextQuestion}>
            {currentQuestionIndex === sampleTest.questions.length - 1 ? (
              "Submit Test"
            ) : (
              <>
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    );
  };
  
  const renderTestResults = () => {
    const score = calculateScore();
    
    return (
      <div className="pb-8 max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={exitTest}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Tests
          </Button>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-2">Test Results</h2>
          <p className="text-gray-600 mb-6">{sampleTest.title}</p>
          
          <div className="w-32 h-32 rounded-full flex items-center justify-center bg-gray-50 border-8 border-purple-100 mx-auto mb-6">
            <span className="text-3xl font-bold text-purple-700">{score}%</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-semibold">{sampleTest.questions.length}</div>
              <div className="text-gray-500 text-sm">Total Questions</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-semibold text-green-600">
                {Object.values(selectedAnswers).filter((answer, index) => 
                  answer === sampleTest.questions[index].correctAnswer
                ).length}
              </div>
              <div className="text-gray-500 text-sm">Correct</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-xl font-semibold text-red-600">
                {sampleTest.questions.length - Object.values(selectedAnswers).filter((answer, index) => 
                  answer === sampleTest.questions[index].correctAnswer
                ).length}
              </div>
              <div className="text-gray-500 text-sm">Incorrect</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 justify-center">
            <Button variant="outline" size="sm" onClick={exitTest}>
              Return to Tests
            </Button>
            <Button variant="outline" size="sm">
              View Detailed Results
            </Button>
          </div>
        </div>
        
        <h3 className="text-xl font-medium mb-4">Question Review</h3>
        
        <div className="space-y-4">
          {sampleTest.questions.map((question, index) => {
            const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
            
            return (
              <div 
                key={question.id} 
                className={`bg-white rounded-lg border p-4 ${
                  isCorrect ? 'border-green-200' : 'border-red-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">Question {index + 1}</span>
                  {isCorrect ? (
                    <Badge variant="outline" className="bg-green-50 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Correct
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-red-50 text-red-800">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Incorrect
                    </Badge>
                  )}
                </div>
                
                <p className="mb-3">{question.question}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="mb-1 font-medium">Your answer:</div>
                  <div className={`p-2 rounded ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                    {question.type === 'multiple_choice' && (
                      <span>{selectedAnswers[question.id] as string || "Not answered"}</span>
                    )}
                    {question.type === 'true_false' && (
                      <span>{selectedAnswers[question.id] === true ? "True" : 
                             selectedAnswers[question.id] === false ? "False" : 
                             "Not answered"}</span>
                    )}
                  </div>
                  
                  {!isCorrect && (
                    <>
                      <div className="mb-1 font-medium">Correct answer:</div>
                      <div className="p-2 rounded bg-green-50">
                        {question.type === 'multiple_choice' && (
                          <span>{question.correctAnswer}</span>
                        )}
                        {question.type === 'true_false' && (
                          <span>{question.correctAnswer ? "True" : "False"}</span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
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
        {takeTestMode ? renderTestMode() : renderTestList()}
      </main>
    </div>
  );
}