import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { BookOpen, Search, Plus, Clock } from "lucide-react";
import { Link, useLocation } from "wouter";
import { FlashcardDeck } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Flashcards() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createDeckOpen, setCreateDeckOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("my-decks");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  // Fetch user's decks
  const { data: myDecks, isLoading: myDecksLoading } = useQuery({
    queryKey: ['/api/flashcard-decks/user'],
  });

  // Fetch courses for dropdown
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  // Create form schema
  const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z.string().optional(),
    courseId: z.string().min(1, "Please select a course"),
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      courseId: "",
    },
  });

  // Filter decks based on search
  const filteredDecks = myDecks
    ? myDecks.filter((deck: FlashcardDeck) => 
        deck.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  // Create deck mutation
  const createDeckMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest('POST', `/api/courses/${values.courseId}/flashcard-decks`, {
        name: values.name,
        description: values.description || undefined,
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/flashcard-decks/user'] });
      queryClient.invalidateQueries({ queryKey: ['/api/flashcard-decks/recent'] });
      toast({
        title: "Success",
        description: "Flashcard deck created successfully!",
      });
      form.reset();
      setCreateDeckOpen(false);
      // Navigate to the new deck
      navigate(`/flashcards/decks/${data.id}`);
    },
    onError: (error) => {
      console.error("Error creating deck:", error);
      toast({
        title: "Error",
        description: "Failed to create flashcard deck. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createDeckMutation.mutate(values);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const updated = new Date(date);
    const diffInDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Updated today";
    if (diffInDays === 1) return "Updated yesterday";
    if (diffInDays < 7) return `Updated ${diffInDays} days ago`;
    if (diffInDays < 30) return `Updated ${Math.floor(diffInDays / 7)} weeks ago`;
    return `Updated ${Math.floor(diffInDays / 30)} months ago`;
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
              <h1 className="text-2xl font-semibold text-gray-900 mb-2 sm:mb-0">Flashcards</h1>
              <Button onClick={() => setCreateDeckOpen(true)}>
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                Create Deck
              </Button>
            </div>
          </div>

          {/* Flashcards Content */}
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search flashcard decks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Tabs defaultValue="my-decks" onValueChange={setCurrentTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="my-decks">My Decks</TabsTrigger>
                <TabsTrigger value="study-history">Study History</TabsTrigger>
              </TabsList>
              
              <TabsContent value="my-decks">
                {myDecksLoading ? (
                  <div className="text-center py-10">
                    <p>Loading your flashcard decks...</p>
                  </div>
                ) : filteredDecks.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-10">
                      <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Flashcard Decks Yet</h3>
                      <p className="text-gray-500 mb-4">
                        {searchQuery 
                          ? "No matching decks found. Try a different search."
                          : "You haven't created any flashcard decks yet."}
                      </p>
                      <Button onClick={() => setCreateDeckOpen(true)}>
                        Create Your First Deck
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDecks.map((deck: FlashcardDeck) => (
                      <Card key={deck.id} className="relative group overflow-hidden hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{deck.name}</CardTitle>
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {deck.cardCount || 0} cards
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{deck.description}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-4">
                            <Clock className="h-4 w-4 mr-1" />
                            {formatTimeAgo(deck.updatedAt)}
                          </div>
                          
                          <div className="mt-2 flex justify-end">
                            <Button asChild>
                              <Link href={`/flashcards/decks/${deck.id}`}>
                                Study
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="study-history">
                <Card>
                  <CardContent className="text-center py-10">
                    <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Study History Coming Soon</h3>
                    <p className="text-gray-500 mb-4">
                      This feature is still under development. Check back later!
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
      
      {/* Create Deck Modal */}
      <Dialog open={createDeckOpen} onOpenChange={setCreateDeckOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Flashcard Deck</DialogTitle>
            <DialogDescription>
              Create a new deck of flashcards for your studies
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deck Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Biology Terms" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Chapter 5 key concepts" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses?.map((course: any) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCreateDeckOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createDeckMutation.isPending || coursesLoading}
                >
                  {createDeckMutation.isPending ? "Creating..." : "Create Deck"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
