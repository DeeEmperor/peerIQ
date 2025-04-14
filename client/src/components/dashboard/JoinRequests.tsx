import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { JoinRequest } from "@/types";
import { useToast } from "@/hooks/use-toast";

export default function JoinRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading, error } = useQuery({
    queryKey: ['/api/join-requests/pending'],
  });

  const updateRequestMutation = useMutation({
    mutationFn: async ({ requestId, status }: { requestId: number, status: 'accepted' | 'rejected' }) => {
      const response = await apiRequest('PATCH', `/api/join-requests/${requestId}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/join-requests/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/groups'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update join request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleUpdateRequest = (requestId: number, status: 'accepted' | 'rejected') => {
    updateRequestMutation.mutate({ requestId, status });
    
    toast({
      title: status === 'accepted' ? "Request Accepted" : "Request Declined",
      description: status === 'accepted' 
        ? "User has been added to the group" 
        : "Request has been declined",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Join Requests
            </h3>
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-3">
                    <Skeleton className="h-5 w-28 mb-1" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Join Requests
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading join requests. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Join Requests
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No pending join requests.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Join Requests
          </h3>
          <Badge variant="outline" className="bg-red-100 text-red-800">
            {requests.length} pending
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-gray-200">
        {requests.map((request: JoinRequest & { user?: any, group?: any }) => (
          <div key={request.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center">
                <Avatar className="h-10 w-10">
                  {request.user?.avatar ? (
                    <AvatarImage src={request.user.avatar} alt={request.user.name} />
                  ) : (
                    <AvatarFallback>{request.user?.name?.charAt(0) || "U"}</AvatarFallback>
                  )}
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{request.user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">
                    Wants to join {request.group?.name || "your group"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm"
                  variant="secondary"
                  className="text-primary-dark bg-primary-light hover:bg-primary-dark hover:text-white"
                  onClick={() => handleUpdateRequest(request.id, 'accepted')}
                  disabled={updateRequestMutation.isPending}
                >
                  Accept
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className="text-gray-700 bg-white hover:bg-gray-50"
                  onClick={() => handleUpdateRequest(request.id, 'rejected')}
                  disabled={updateRequestMutation.isPending}
                >
                  Decline
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
