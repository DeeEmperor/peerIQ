import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { useAuthContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, User, Bell, Lock, Shield } from "lucide-react";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  avatar: z.string().optional(),
  availability: z.string().optional(),
  studyStyle: z.string().optional(),
});

const notificationFormSchema = z.object({
  testReminders: z.boolean().default(true),
  newContent: z.boolean().default(true),
  sessionReminders: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
});

export default function Settings() {
  const { userProfile, updateProfile } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  // Fetch notification settings
  const { data: notificationSettings, isLoading: notificationsLoading } = useQuery({
    queryKey: ['/api/notification-settings'],
  });

  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile?.name || "",
      username: userProfile?.username || "",
      avatar: userProfile?.avatar || "",
      availability: userProfile?.availability || "",
      studyStyle: userProfile?.studyStyle || "",
    },
  });

  // Update form values when userProfile loads
  useState(() => {
    if (userProfile) {
      profileForm.reset({
        name: userProfile.name,
        username: userProfile.username,
        avatar: userProfile.avatar || "",
        availability: userProfile.availability || "",
        studyStyle: userProfile.studyStyle || "",
      });
    }
  });

  // Notification settings form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      testReminders: true,
      newContent: true,
      sessionReminders: true,
      emailNotifications: true,
    },
  });

  // Update notification form values when settings load
  useState(() => {
    if (notificationSettings) {
      notificationForm.reset({
        testReminders: notificationSettings.testReminders,
        newContent: notificationSettings.newContent,
        sessionReminders: notificationSettings.sessionReminders,
        emailNotifications: notificationSettings.emailNotifications,
      });
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileFormSchema>) => {
      const response = await apiRequest("PATCH", "/api/user/profile", data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/profile'] });
      updateProfile(data);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Update notification settings mutation
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof notificationFormSchema>) => {
      const response = await apiRequest("PATCH", "/api/notification-settings", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notification-settings'] });
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been updated.",
      });
    },
    onError: (error) => {
      console.error("Error updating notification settings:", error);
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    updateProfileMutation.mutate(data);
  };

  const onNotificationsSubmit = (data: z.infer<typeof notificationFormSchema>) => {
    updateNotificationsMutation.mutate(data);
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          <div className="py-6 px-4 sm:px-6 lg:px-8 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          </div>
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center">
                  <Lock className="mr-2 h-4 w-4" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="privacy" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                          <div className="flex flex-col items-center">
                            <Avatar className="h-24 w-24">
                              {userProfile.avatar ? (
                                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                              ) : (
                                <AvatarFallback className="text-lg">{userProfile.name.charAt(0)}</AvatarFallback>
                              )}
                            </Avatar>
                            <p className="text-sm text-gray-500 mt-2">Profile Picture</p>
                          </div>
                          <div className="flex-1 space-y-4">
                            <FormField
                              control={profileForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="username"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Username</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Username" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={profileForm.control}
                              name="avatar"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Avatar URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Enter a URL for your profile picture
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={profileForm.control}
                            name="availability"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Availability</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="e.g. Weekdays after 6pm, weekends mornings" 
                                    className="resize-none"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Let others know when you're available to study
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="studyStyle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Study Style</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="e.g. Visual learner, prefer group discussions" 
                                    className="resize-none"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Describe your preferred ways of studying
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <CardFooter className="px-0 pb-0">
                          <Button 
                            type="submit" 
                            disabled={updateProfileMutation.isPending}
                          >
                            {updateProfileMutation.isPending && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Save Changes
                          </Button>
                        </CardFooter>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Customize how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notificationsLoading ? (
                      <div className="flex justify-center py-6">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <Form {...notificationForm}>
                        <form onSubmit={notificationForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                          <div className="space-y-4">
                            <FormField
                              control={notificationForm.control}
                              name="testReminders"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Test Reminders</FormLabel>
                                    <FormDescription>
                                      Receive notifications about upcoming tests
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={notificationForm.control}
                              name="newContent"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Content Updates</FormLabel>
                                    <FormDescription>
                                      Get notified when new flashcards or study materials are added
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={notificationForm.control}
                              name="sessionReminders"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Study Session Alerts</FormLabel>
                                    <FormDescription>
                                      Receive reminders about upcoming study sessions
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={notificationForm.control}
                              name="emailNotifications"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                                  <div className="space-y-0.5">
                                    <FormLabel className="text-base">Email Notifications</FormLabel>
                                    <FormDescription>
                                      Also send notifications to your email
                                    </FormDescription>
                                  </div>
                                  <FormControl>
                                    <Switch
                                      checked={field.value}
                                      onCheckedChange={field.onChange}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </div>

                          <CardFooter className="px-0 pb-0">
                            <Button 
                              type="submit" 
                              disabled={updateNotificationsMutation.isPending}
                            >
                              {updateNotificationsMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Save Preferences
                            </Button>
                          </CardFooter>
                        </form>
                      </Form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle>Password Settings</CardTitle>
                    <CardDescription>
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <FormLabel>Current Password</FormLabel>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>New Password</FormLabel>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                      <div className="space-y-2">
                        <FormLabel>Confirm New Password</FormLabel>
                        <Input type="password" placeholder="••••••••" />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control how your information is used and shared
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Profile Visibility</h4>
                          <p className="text-sm text-gray-500">Control who can see your profile information</p>
                        </div>
                        <Select defaultValue="group-members">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="everyone">Everyone</SelectItem>
                            <SelectItem value="group-members">Group Members Only</SelectItem>
                            <SelectItem value="private">Private</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Leaderboard Participation</h4>
                          <p className="text-sm text-gray-500">Show or hide your name on group leaderboards</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Study History</h4>
                          <p className="text-sm text-gray-500">Allow others to see your study history</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Privacy Settings</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
