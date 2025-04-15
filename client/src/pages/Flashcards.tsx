import { useState } from "react";
import { Link } from "wouter";
import {
  Plus,
  Search,
  ChevronRight,
  BookOpen,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  Edit,
  Trash,
  Share,
  CheckCircle2,
  XCircle,
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
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Placeholder data - would come from API in real app
const flashcardDecks = [
  {
    id: 1,
    title: "Biology 101 - Cell Structure",
    description: "Flashcards about cell structures and functions",
    cardCount: 24,
    lastStudied: "Yesterday",
    masteryLevel: 78,
    course: "Biology 101",
    group: "Biology Study Group",
    owner: "You",
  },
  {
    id: 2,
    title: "Physics - Mechanics",
    description: "Concepts and formulas for mechanics",
    cardCount: 32,
    lastStudied: "3 days ago",
    masteryLevel: 65,
    course: "Physics 101",
    group: "Advanced Physics",
    owner: "You",
  },
  {
    id: 3,
    title: "Organic Chemistry - Functional Groups",
    description: "Organic chemistry functional groups and reactions",
    cardCount: 18,
    lastStudied: "1 week ago",
    masteryLevel: 45,
    course: "Organic Chemistry",
    group: "Organic Chemistry",
    owner: "Alex Johnson",
  },
  {
    id: 4,
    title: "Spanish Vocabulary - Beginner",
    description: "Common Spanish words and phrases",
    cardCount: 50,
    lastStudied: "2 weeks ago",
    masteryLevel: 30,
    course: "Spanish 101",
    group: null,
    owner: "You",
  },
];

// Sample flashcards for a deck
const sampleFlashcards = [
  {
    id: 1,
    question: "What is the powerhouse of the cell?",
    answer:
      "The mitochondria is the powerhouse of the cell, responsible for cellular respiration and producing energy in the form of ATP.",
    mastered: true,
  },
  {
    id: 2,
    question: "What is the function of the cell membrane?",
    answer:
      "The cell membrane regulates what enters and exits the cell, provides structure, and protects the cell's internal components.",
    mastered: false,
  },
  {
    id: 3,
    question: "What are lysosomes?",
    answer:
      "Lysosomes are membrane-bound organelles containing digestive enzymes that break down waste materials and cellular debris.",
    mastered: true,
  },
  {
    id: 4,
    question: "What is the endoplasmic reticulum?",
    answer:
      "The endoplasmic reticulum is a network of membranes throughout the cell that assists with protein and lipid synthesis.",
    mastered: false,
  },
  {
    id: 5,
    question: "What is the function of the Golgi apparatus?",
    answer:
      "The Golgi apparatus modifies, sorts, and packages proteins and lipids for storage in the cell or release outside the cell.",
    mastered: false,
  },
];

export default function Flashcards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("my-decks");
  const [selectedDeck, setSelectedDeck] = useState<number | null>(null);
  const [studyMode, setStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Filter decks based on search query
  const filteredDecks = flashcardDecks.filter(
    (deck) =>
      deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deck.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle study mode
  const startStudyMode = (deckId: number) => {
    setSelectedDeck(deckId);
    setStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const exitStudyMode = () => {
    setStudyMode(false);
    setShowAnswer(false);
  };

  const nextCard = () => {
    if (currentCardIndex < sampleFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // End of deck
      exitStudyMode();
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  // Render functions
  const renderDeckList = () => (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Flashcards</h2>
          <p className="text-gray-600">
            Create and study flashcards to improve your knowledge retention
          </p>
        </div>

        <div className="mt-4 md:mt-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Deck
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Flashcard Deck</DialogTitle>
                <DialogDescription>
                  Create a new deck of flashcards to study and share with your
                  groups.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Deck Title
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g., Biology 101 - Cell Structure"
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Describe what this flashcard deck covers"
                    className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="course" className="text-sm font-medium">
                    Course
                  </label>
                  <select
                    id="course"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select a course</option>
                    <option value="biology-101">Biology 101</option>
                    <option value="physics-101">Physics 101</option>
                    <option value="organic-chemistry">Organic Chemistry</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="group" className="text-sm font-medium">
                    Share with Group (Optional)
                  </label>
                  <select
                    id="group"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Don't share with a group</option>
                    <option value="biology-study-group">
                      Biology Study Group
                    </option>
                    <option value="advanced-physics">Advanced Physics</option>
                    <option value="organic-chemistry">Organic Chemistry</option>
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Deck</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Search flashcard decks..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid w-full md:w-1/3 grid-cols-2">
          <TabsTrigger value="my-decks">My Decks</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>

        {/* My Decks Tab */}
        <TabsContent value="my-decks">
          {filteredDecks.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No flashcard decks found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery
                  ? "No decks match your search."
                  : "You haven't created any flashcard decks yet."}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Create Your First Deck</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Flashcard Deck</DialogTitle>
                    <DialogDescription>
                      Create a new deck of flashcards to study.
                    </DialogDescription>
                  </DialogHeader>
                  {/* Form fields would go here */}
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDecks.map((deck) => (
                <Card
                  key={deck.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold">
                          {deck.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {deck.description}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Deck</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Share className="mr-2 h-4 w-4" />
                            <span>Share Deck</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete Deck</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-800 hover:bg-purple-50"
                      >
                        {deck.course}
                      </Badge>
                      {deck.group && (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-800 hover:bg-blue-50"
                        >
                          {deck.group}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="pb-3">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{deck.cardCount} cards</span>
                      </div>
                      <div>Last studied: {deck.lastStudied}</div>
                    </div>

                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-violet-400 h-2.5 rounded-full"
                        style={{ width: `${deck.masteryLevel}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      Mastery: {deck.masteryLevel}%
                    </div>
                  </CardContent>

                  <CardFooter className="pt-1">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => startStudyMode(deck.id)}
                    >
                      Study Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Shared Tab */}
        <TabsContent value="shared">
          <div className="text-center py-10">
            <Share className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No shared decks yet
            </h3>
            <p className="text-gray-600 mb-4">
              When someone shares a flashcard deck with you, it will appear
              here.
            </p>
            <Button variant="outline" onClick={() => setActiveTab("my-decks")}>
              View My Decks
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );

  const renderStudyMode = () => {
    const currentCard = sampleFlashcards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / sampleFlashcards.length) * 100;

    return (
      <div className="pb-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={exitStudyMode}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Decks
          </Button>
          <h2 className="text-xl font-semibold ml-4">
            Studying: {flashcardDecks.find((d) => d.id === selectedDeck)?.title}
          </h2>
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
            Card {currentCardIndex + 1} of {sampleFlashcards.length}
          </p>
        </div>

        {/* Flashcard */}
        <div
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8 cursor-pointer transition-all duration-200 hover:shadow-xl mx-auto max-w-3xl"
          style={{ minHeight: "300px" }}
          onClick={toggleAnswer}
        >
          <div className="text-center">
            <div className="flex justify-center items-center absolute top-4 right-4">
              {currentCard.mastered ? (
                <Badge variant="outline" className="bg-green-50 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Mastered
                </Badge>
              ) : null}
            </div>

            {!showAnswer ? (
              <div>
                <h3 className="text-2xl font-medium mb-8">Question</h3>
                <p className="text-xl">{currentCard.question}</p>
                <p className="text-gray-500 mt-8 text-sm">
                  Click to reveal answer
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-medium mb-8">Answer</h3>
                <p className="text-xl">{currentCard.answer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </Button>

          {showAnswer && (
            <>
              <Button variant="outline" className="text-red-600 border-red-200">
                <XCircle className="h-5 w-5 mr-2" />
                Needs Review
              </Button>
              <Button
                variant="outline"
                className="text-green-600 border-green-200"
              >
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Got It
              </Button>
            </>
          )}

          <Button onClick={nextCard}>
            {currentCardIndex === sampleFlashcards.length - 1 ? (
              "Finish"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-violet-500 text-transparent bg-clip-text">
              peerIQ
            </h1>
          </Link>

          <Button asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {studyMode ? renderStudyMode() : renderDeckList()}
      </main>
    </div>
  );
}
