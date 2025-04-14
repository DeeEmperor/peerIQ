import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { FlashcardDeck } from "@/types";

interface RecentFlashcardsProps {
  limit?: number;
}

export default function RecentFlashcards({ limit = 4 }: RecentFlashcardsProps) {
  // This endpoint would need to be implemented on the backend
  const { data: decks, isLoading, error } = useQuery({
    queryKey: ['/api/flashcard-decks/recent'],
  });

  const displayDecks = decks ? decks.slice(0, limit) : [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Flashcards
            </h3>
            <div className="flex">
              <Link href="/flashcards" className="text-sm text-primary hover:text-primary-dark font-medium">
                Create new deck
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative group">
                <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-5 w-36 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Flashcards
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading flashcard decks. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!decks || decks.length === 0) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Flashcards
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't created any flashcard decks yet.</p>
          <Button className="mx-auto" asChild>
            <Link href="/flashcards">Create Flashcard Deck</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Function to determine badge color based on card count
  const getCardCountBadgeColor = (count: number) => {
    if (count >= 30) return "bg-green-100 text-green-800";
    if (count >= 15) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
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
    <Card>
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Flashcards
          </h3>
          <div className="flex">
            <Link href="/flashcards" className="text-sm text-primary hover:text-primary-dark font-medium">
              Create new deck
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayDecks.map((deck: FlashcardDeck) => (
            <div key={deck.id} className="relative group">
              <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 shadow-sm hover:shadow-md transition duration-150">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-md font-semibold text-gray-900">{deck.name}</h4>
                    <p className="mt-1 text-sm text-gray-500">{deck.description}</p>
                  </div>
                  <Badge variant="outline" className={getCardCountBadgeColor(deck.cardCount || 0)}>
                    {deck.cardCount || 0} cards
                  </Badge>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {formatTimeAgo(deck.updatedAt)}
                  </div>
                  <Button variant="link" className="text-sm font-medium text-primary hover:text-primary-dark p-0 h-auto" asChild>
                    <Link href={`/flashcards/decks/${deck.id}`}>
                      Study
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="absolute top-0 right-0 mt-2 mr-2 hidden group-hover:block">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
