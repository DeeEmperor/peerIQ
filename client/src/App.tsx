import { useState } from "react";
import { Route, Switch, Link } from "wouter";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function WelcomeScreen() {
  const [, setLocation] = useState("/");
  
  const handleGetStarted = () => {
    setLocation("/login");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-lg p-8 border">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 text-primary">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center mb-2">StudySync</h1>
          <p className="text-center text-gray-600 mb-6">
            Collaborative learning platform
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <a className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
                Login
              </a>
            </Link>
            <Link href="/register">
              <a className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white hover:bg-opacity-90 transition-colors">
                Sign Up
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/" component={WelcomeScreen} />
    </Switch>
  );
}

export default App;
