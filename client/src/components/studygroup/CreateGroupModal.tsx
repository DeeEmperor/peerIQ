import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Validation schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  course: z.string().optional(),
  otherCourse: z.string().optional(),
  isPublic: z.boolean().default(true),
  democratizedApproval: z.boolean().default(false),
});

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [otherCourse, setOtherCourse] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      course: "",
      otherCourse: "",
      isPublic: true,
      democratizedApproval: false,
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // Prepare data for API
      const groupData = {
        name: values.name,
        description: values.description,
        isPublic: values.isPublic,
        democratizedApproval: values.democratizedApproval
      };

      const response = await apiRequest('POST', '/api/groups', groupData);
      const newGroup = await response.json();

      // If a course was specified, create it
      if (newGroup.id && (values.course || values.otherCourse)) {
        const courseName = values.course === "other" ? values.otherCourse : values.course;
        if (courseName) {
          const courseData = {
            name: courseName,
            description: `Course for ${values.name}`,
            groupId: newGroup.id,
          };
          await apiRequest('POST', `/api/groups/${newGroup.id}/courses`, courseData);
        }
      }

      return newGroup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
      toast({
        title: "Success",
        description: "Study group created successfully!",
      });
      form.reset();
      onClose();
    },
    onError: (error) => {
      console.error("Error creating group:", error);
      toast({
        title: "Error",
        description: "Failed to create study group. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createGroupMutation.mutate(values);
  };

  // Course options
  const courseOptions = [
    { value: "Physics 101", label: "Physics 101" },
    { value: "Calculus II", label: "Calculus II" },
    { value: "Organic Chemistry", label: "Organic Chemistry" },
    { value: "Computer Science", label: "Computer Science" },
    { value: "other", label: "Other (specify)" },
  ];

  const handleCourseChange = (value: string) => {
    setOtherCourse(value === "other");
    form.setValue("course", value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium">Create New Study Group</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new study group. You'll be the Group Lead.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Advanced Physics Study Group" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <Select 
                    onValueChange={handleCourseChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {otherCourse && (
              <FormField
                control={form.control}
                name="otherCourse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specify Course</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell potential members about this group..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={!field.value}
                      onCheckedChange={(checked) => field.onChange(!checked)}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make group private</FormLabel>
                    <FormDescription>
                      Private groups require approval before members can join
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="democratizedApproval"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.watch("isPublic")}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Enable democratized approval</FormLabel>
                    <FormDescription>
                      Allow all members to vote on join requests
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={createGroupMutation.isPending}
              >
                {createGroupMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Group
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
