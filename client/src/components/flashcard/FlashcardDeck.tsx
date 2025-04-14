import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Shuffle, RotateCcw, Edit } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { FlashcardDeck as FlashcardDeckType, Flashcard } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface FlashcardDeckProps {
  deckId: number;
}

export default function FlashcardDeck({ deckId }: FlashcardDeckProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);
  
  const { data: deck, isLoading: deckLoading } = useQuery({
    queryKey: [`/api/flashcard-decks/${deckId}`],
  });
  
  const { data: flashcards, isLoading: cardsLoading } = useQuery({
    queryKey: [`/api/flashcard-decks/${deckId}/flashcards`],
    onSuccess: (data) => {
      if (data?.length && shuffled) {
        shuffleCards(data);
      }
    }
  });

  const updateCardMutation = useMutation({
    mutationFn: async (updatedCard: Partial<Flashcard>) => {
      const response = await apiRequest('PATCH', `/api/flashcards/${updatedCard.id}`, updatedCard);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/flashcard-decks/${deckId}/flashcards`] });
      toast({
        title: "Card Updated",
        description: "Flashcard has been updated successfully.",
      });
    }
  });

  const isLoading = deckLoading || cardsLoading;
  
  const handleNextCard = () => {
    if (!flashcards?.length) return;
    
    setIsFlipped(false);
    setCurrentIndex((prev) => {
      const cards = shuffled ? shuffledCards : flashcards;
      return prev < cards.length - 1 ? prev + 1 : 0;
    });
  };
  
  const handlePrevCard = () => {
    if (!flashcards?.length) return;
    
    setIsFlipped(false);
    setCurrentIndex((prev) => {
      const cards = shuffled ? shuffledCards : flashcards;
      return prev > 0 ? prev - 1 : cards.length - 1;
    });
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };
  
  const startStudyMode = () => {
    setIsStudyMode(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  
  const endStudyMode = () => {
    setIsStudyMode(false);
  };
  
  const shuffleCards = (cards = flashcards) => {
    if (!cards?.length) return;
    
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setShuffledCards(shuffled);
    setShuffled(true);
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  
  const resetOrder = () => {
    setShuffled(false);
    setCurrentIndex(0);
    setIsFlipped(false);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="flex justify-center p-8">
          <div className="w-full aspect-[4/3] max-w-md">
            <Skeleton className="h-full w-full rounded-xl" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    );
  }
  
  if (!deck || !flashcards) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Flashcard Deck Not Found</CardTitle>
          <CardDescription>The requested flashcard deck could not be found.</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
        </CardFooter>
      </Card>
    );
  }
  
  if (flashcards.length === 0) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{deck.name}</CardTitle>
          <CardDescription>{deck.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center p-8">
          <p className="text-gray-500 mb-4">This flashcard deck is empty. Add some cards to get started!</p>
          <Button>Add Flashcard</Button>
        </CardContent>
      </Card>
    );
  }
  
  const displayedCards = shuffled ? shuffledCards : flashcards;
  const currentCard = displayedCards?.[currentIndex];
  
  const StudyModeContent = () => (
    <>
      <div 
        className="w-full aspect-[4/3] max-w-md bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer flex items-center justify-center p-6 transition-all duration-300"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)', 
          transformStyle: 'preserve-3d' 
        }}
        onClick={flipCard}
      >
        <div 
          className={`absolute inset-0 backface-hidden flex items-center justify-center p-6 rounded-xl ${
            isFlipped ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Question:</h3>
            <p className="text-lg text-gray-800">{currentCard?.question}</p>
            {currentCard?.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {currentCard.tags.map((tag, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div 
          className={`absolute inset-0 backface-hidden flex items-center justify-center p-6 rounded-xl ${
            isFlipped ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-3">Answer:</h3>
            <p className="text-lg text-gray-800">{currentCard?.answer}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center text-sm text-gray-500">
        Card {currentIndex + 1} of {displayedCards.length}
      </div>
    </>
  );
  
  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{deck.name}</CardTitle>
              <CardDescription>{deck.description}</CardDescription>
            </div>
            <Badge variant="outline">
              {displayedCards?.length} cards
            </Badge>
          </div>
        </CardHeader>
        
        {!isStudyMode ? (
          <CardContent className="text-center p-8">
            <div className="flex flex-col items-center justify-center space-y-6">
              <p className="text-lg font-medium text-gray-700">Ready to study this deck?</p>
              <Button size="lg" onClick={startStudyMode}>
                Start Studying
              </Button>
            </div>
          </CardContent>
        ) : (
          <CardContent className="flex flex-col items-center justify-center p-8">
            <StudyModeContent />
          </CardContent>
        )}
        
        {isStudyMode && (
          <CardFooter className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handlePrevCard}
                title="Previous Card"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleNextCard}
                title="Next Card"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={shuffled ? resetOrder : () => shuffleCards()}
                title={shuffled ? "Reset Order" : "Shuffle Cards"}
              >
                {shuffled ? 
                  <RotateCcw className="h-4 w-4" /> : 
                  <Shuffle className="h-4 w-4" />
                }
              </Button>
              <Button variant="outline" onClick={endStudyMode}>
                Exit
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
