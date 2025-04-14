import { Link } from "wouter";
import { GroupWithProgress } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { UsersRound, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface StudyGroupsListProps {
  showAll?: boolean;
}

export default function StudyGroupsList({ showAll = false }: StudyGroupsListProps) {
  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['/api/groups'],
  });

  const displayGroups = showAll ? groups : groups?.slice(0, 3);

  // Function to determine badge color based on role
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Group Lead":
        return "bg-green-100 text-green-800";
      case "Member":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to determine progress color based on readiness
  const getProgressColor = (readiness: number) => {
    if (readiness >= 70) return "bg-primary";
    if (readiness >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              My Study Groups
            </h3>
            <div className="flex">
              <Link href="/groups" className="text-sm text-primary hover:text-primary-dark font-medium">
                View all
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-md p-4 mb-4 hover:shadow-md transition duration-150">
              <div className="flex justify-between">
                <div>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <div className="mt-1 flex space-x-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <Skeleton className="h-6 w-20 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
              <div className="mt-3">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-2 w-full mt-1" />
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
      <Card className="mb-6">
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            My Study Groups
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading study groups. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            My Study Groups
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 mb-4">You're not a member of any study groups yet.</p>
          <Button className="mx-auto" asChild>
            <Link href="/groups">Find Study Groups</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            My Study Groups
          </h3>
          {!showAll && (
            <div className="flex">
              <Link href="/groups" className="text-sm text-primary hover:text-primary-dark font-medium">
                View all
              </Link>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {displayGroups?.map((group: GroupWithProgress) => (
          <div key={group.id} className="bg-white border border-gray-200 rounded-md p-4 mb-4 hover:shadow-md transition duration-150">
            <div className="flex justify-between">
              <div>
                <h4 className="text-md font-semibold text-gray-900">{group.name}</h4>
                <div className="mt-1 text-sm text-gray-500">
                  <span className="inline-flex items-center mr-3">
                    <UsersRound className="h-4 w-4 mr-1 text-gray-400" />
                    {group.memberCount} members
                  </span>
                  {group.meetingTime && (
                    <span className="inline-flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      Meets: {group.meetingTime}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Badge variant="outline" className={getRoleBadgeColor(group.role)}>
                  {group.role}
                </Badge>
                <div className="mt-2">
                  <Button variant="link" className="text-sm font-medium text-primary hover:text-primary-dark p-0 h-auto" asChild>
                    <Link href={`/groups/${group.id}`}>
                      Enter
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            {group.nextTest && (
              <div className="mt-3">
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block text-gray-600">
                        Test in {group.nextTest.daysUntil} {group.nextTest.daysUntil === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span 
                        className={`text-xs font-semibold inline-block ${
                          group.nextTest.readiness >= 70 
                            ? 'text-primary-dark' 
                            : group.nextTest.readiness >= 40 
                              ? 'text-amber-600' 
                              : 'text-red-600'
                        }`}
                      >
                        {group.nextTest.readiness}% Prepared
                      </span>
                    </div>
                  </div>
                  <Progress 
                    value={group.nextTest.readiness}
                    className="h-2 mt-1 bg-gray-200"
                    indicatorClassName={getProgressColor(group.nextTest.readiness)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
