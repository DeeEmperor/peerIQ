import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Tests() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tests</h1>
      <p className="mb-4">This page will show your upcoming tests and allow you to generate new ones.</p>
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}