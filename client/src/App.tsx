import { useState } from "react";

// Components for different pages
function WelcomeScreen({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
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
        <button 
          onClick={() => onNavigate("login")}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Login
        </button>
        <button 
          onClick={() => onNavigate("register")}
          className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary hover:text-white hover:bg-opacity-90 transition-colors"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

function LoginScreen({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login for now - we'll implement Firebase later
    console.log("Logging in with:", email, password);
    // Navigate to dashboard on successful login
    onNavigate("dashboard");
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-8 border">
      <div className="flex justify-center mb-6">
        <div className="h-10 w-10 text-primary">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>
      <h1 className="text-xl font-bold text-center mb-6">Log in to StudySync</h1>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Log In
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => onNavigate("register")} 
          className="text-primary hover:underline text-sm"
        >
          Don't have an account? Sign up
        </button>
      </div>
      <div className="mt-2 text-center">
        <button 
          onClick={() => onNavigate("welcome")} 
          className="text-gray-500 hover:underline text-sm"
        >
          Back to welcome
        </button>
      </div>
    </div>
  );
}

function RegisterScreen({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock registration for now - we'll implement Firebase later
    console.log("Registering with:", { name, username, email, password });
    // Navigate to dashboard on successful registration
    onNavigate("dashboard");
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-8 border">
      <div className="flex justify-center mb-6">
        <div className="h-10 w-10 text-primary">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path d="M9.25 11.5L4.75 14L12 18.25L19.25 14L14.6722 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </div>
      </div>
      <h1 className="text-xl font-bold text-center mb-6">Create your StudySync account</h1>
      
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
        >
          Sign Up
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button 
          onClick={() => onNavigate("login")} 
          className="text-primary hover:underline text-sm"
        >
          Already have an account? Log in
        </button>
      </div>
      <div className="mt-2 text-center">
        <button 
          onClick={() => onNavigate("welcome")} 
          className="text-gray-500 hover:underline text-sm"
        >
          Back to welcome
        </button>
      </div>
    </div>
  );
}

function DashboardScreen({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-8 border">
      <h1 className="text-2xl font-bold mb-4">Welcome to StudySync!</h1>
      <p className="mb-4">Your collaborative learning dashboard</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h2 className="font-bold mb-2">My Study Groups</h2>
          <p className="text-sm text-gray-600">Join or create study groups</p>
        </div>
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h2 className="font-bold mb-2">Flashcards</h2>
          <p className="text-sm text-gray-600">Create and practice with flashcards</p>
        </div>
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h2 className="font-bold mb-2">Tests</h2>
          <p className="text-sm text-gray-600">Take practice tests</p>
        </div>
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
          <h2 className="font-bold mb-2">Leaderboard</h2>
          <p className="text-sm text-gray-600">See your ranking</p>
        </div>
      </div>
      
      <button 
        onClick={() => onNavigate("welcome")} 
        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {currentPage === "welcome" && <WelcomeScreen onNavigate={handleNavigate} />}
        {currentPage === "login" && <LoginScreen onNavigate={handleNavigate} />}
        {currentPage === "register" && <RegisterScreen onNavigate={handleNavigate} />}
        {currentPage === "dashboard" && <DashboardScreen onNavigate={handleNavigate} />}
      </div>
    </div>
  );
}

export default App;
