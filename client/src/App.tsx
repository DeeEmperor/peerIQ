import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { queryClient } from "./lib/queryClient";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

const name = "David";
// Page components
import Dashboard from "@/pages/Dashboard";
import StudyGroups from "@/pages/StudyGroups";
import Flashcards from "@/pages/Flashcards";
import Tests from "@/pages/Tests";
import Leaderboard from "@/pages/Leaderboard";
import GroupDetail from "@/pages/GroupDetail";
import Settings from "@/pages/Settings";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Switch>
            {/* Auth routes */}
            <Route path="/auth" component={AuthPage} />

            {/* Protected routes */}
            <ProtectedRoute path="/" component={Dashboard} />
            <ProtectedRoute path="/groups" component={StudyGroups} />
            <ProtectedRoute path="/groups/:id" component={GroupDetail} />
            <ProtectedRoute path="/flashcards" component={Flashcards} />
            <ProtectedRoute path="/tests" component={Tests} />
            <ProtectedRoute path="/leaderboard" component={Leaderboard} />
            <ProtectedRoute path="/settings" component={Settings} />

            {/* 404 route */}
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
