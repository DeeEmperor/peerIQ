import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function StudyGroups() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Study Groups</h1>
      <p className="mb-4">This page will show your study groups and allow you to create or join new ones.</p>
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}