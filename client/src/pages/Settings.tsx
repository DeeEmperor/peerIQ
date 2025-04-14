import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Settings() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <p className="mb-4">
        This page will allow you to update your profile information and preferences.
      </p>
      
      <div className="mb-6 p-4 border rounded-md">
        <h2 className="text-lg font-medium mb-2">Current Profile</h2>
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Username:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
      </div>
      
      <Button asChild>
        <Link href="/">Back to Dashboard</Link>
      </Button>
    </div>
  );
}