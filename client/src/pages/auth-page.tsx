import { useState } from "react";
import { Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Users,
  BookOpen,
  ActivitySquare,
  Sparkles,
} from "lucide-react";

// Define the form validation schemas
const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const registerSchema = z
  .object({
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Confirm password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  const { user, loginMutation, registerMutation } = useAuth();

  // Set up the login form
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Set up the register form
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login form submission
  const onLoginSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  // Handle register form submission
  const onRegisterSubmit = (data: RegisterFormData) => {
    // Remove the confirmPassword field before sending to the API
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  // If the user is already logged in, redirect to the home page
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Column - Hero Section (shows on large screens) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-700 via-purple-600 to-violet-500 text-white p-12 flex-col justify-center items-center">
        <div className="max-w-xl">
          <div className="mb-8 text-center">
            <div className="inline-block p-3 bg-white/10 rounded-2xl backdrop-blur-sm mb-6">
              <Sparkles className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold mb-4">peerIQ</h1>
            <p className="text-xl opacity-90 mb-6">
              Elevate your learning experience with collaborative study tools
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-start mb-4">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    Collaborative Study Groups
                  </h3>
                  <p className="opacity-90">
                    Create or join study groups to collaborate with peers in
                    real-time
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-start mb-4">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Smart Flashcards</h3>
                  <p className="opacity-90">
                    Create and share flashcards with built-in spaced repetition
                    algorithms
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
              <div className="flex items-start mb-4">
                <div className="bg-white/20 p-2 rounded-lg mr-4">
                  <ActivitySquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Performance Tracking</h3>
                  <p className="opacity-90">
                    Track your study progress and see how you compare with your
                    peers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-6 md:p-12 relative">
        {/* Mobile header - only visible on small screens */}
        <div className="md:hidden mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-violet-500 text-transparent bg-clip-text">
            peerIQ
          </h1>
          <p className="text-gray-600">Your collaborative learning platform</p>
        </div>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-gray-600 mt-2">
              {activeTab === "login"
                ? "Sign in to your account to continue"
                : "Join peerIQ to start collaborating"}
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-none">
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                  <CardContent className="space-y-4 px-0">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        placeholder="johndoe"
                        {...loginForm.register("username")}
                        className="border-gray-300 focus:border-primary"
                      />
                      {loginForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        {...loginForm.register("password")}
                        className="border-gray-300 focus:border-primary"
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    {loginMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {loginMutation.error.message || "Invalid credentials"}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end px-0">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Logging in...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setActiveTab("register")}
                    className="text-primary font-medium hover:underline focus:outline-none"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-0 shadow-none">
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                  <CardContent className="space-y-4 px-0">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="johndoe"
                        {...registerForm.register("username")}
                        className="border-gray-300 focus:border-primary"
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.username.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="John Doe"
                        {...registerForm.register("name")}
                        className="border-gray-300 focus:border-primary"
                      />
                      {registerForm.formState.errors.name && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="john.doe@example.com"
                        {...registerForm.register("email")}
                        className="border-gray-300 focus:border-primary"
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="••••••••"
                        {...registerForm.register("password")}
                        className="border-gray-300 focus:border-primary"
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-red-500">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">
                        Confirm Password
                      </Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        placeholder="••••••••"
                        {...registerForm.register("confirmPassword")}
                        className="border-gray-300 focus:border-primary"
                      />
                      {registerForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500">
                          {
                            registerForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>
                    {registerMutation.error && (
                      <Alert variant="destructive">
                        <AlertDescription>
                          {registerMutation.error.message ||
                            "Registration failed"}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-end px-0">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create account"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => setActiveTab("login")}
                    className="text-primary font-medium hover:underline focus:outline-none"
                  >
                    Sign in instead
                  </button>
                </p>
              </div>
            </TabsContent>
          </Tabs>

          {/* App preview section - mobile only */}
          <div className="mt-12 md:hidden">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Why join peerIQ?
            </h3>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg flex items-center">
                <Users className="h-5 w-5 text-primary mr-3" />
                <span>Create & join study groups</span>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg flex items-center">
                <BookOpen className="h-5 w-5 text-primary mr-3" />
                <span>Build collaborative flashcards</span>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg flex items-center">
                <ActivitySquare className="h-5 w-5 text-primary mr-3" />
                <span>Track your study progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
