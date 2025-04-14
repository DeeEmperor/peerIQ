import { Button } from "@/components/ui/button";
import { Link, useParams } from "wouter";

export default function GroupDetail() {
  const params = useParams();
  const groupId = params.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Study Group Details</h1>
      <p className="mb-4">This page will show details for study group ID: {groupId}</p>
      <Button asChild>
        <Link href="/groups">Back to Study Groups</Link>
      </Button>
    </div>
  );
}