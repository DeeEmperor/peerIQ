import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Leaderboard</h1>
      <p className="mb-4">This page will show the study group leaderboards and your performance statistics.</p>
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}