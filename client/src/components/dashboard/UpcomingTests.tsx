import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Test } from "@/types";

export default function UpcomingTests() {
  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['/api/tests/upcoming'],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Upcoming Tests
          </h3>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="mt-2">
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          ))}
          <div className="px-4 py-4 sm:px-6">
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Upcoming Tests
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-red-500">Error loading upcoming tests. Please try again later.</p>
        </CardContent>
      </Card>
    );
  }

  if (!tests || tests.length === 0) {
    return (
      <Card>
        <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Upcoming Tests
          </h3>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No upcoming tests scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  const getDaysUntil = (testDate: string) => {
    const now = new Date();
    const test = new Date(testDate);
    const diffTime = test.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getBadgeColor = (daysUntil: number) => {
    if (daysUntil <= 3) return "bg-red-100 text-red-800";
    if (daysUntil <= 7) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  const getTestTypeLabel = (testType: string, questionCount: number) => {
    const typeLabels: Record<string, string> = {
      'multiple-choice': 'Multiple Choice',
      'short-answer': 'Short Answer',
      'essay': 'Essay'
    };

    return `${typeLabels[testType] || testType}, ${questionCount} Question${questionCount !== 1 ? 's' : ''}`;
  };

  return (
    <Card>
      <CardHeader className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Upcoming Tests
        </h3>
      </CardHeader>
      <CardContent className="divide-y divide-gray-200">
        {tests.map((test: Test) => {
          const daysUntil = getDaysUntil(test.testDate);
          return (
            <div key={test.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-md font-medium text-gray-900">{test.name}</h4>
                  <p className="mt-1 text-sm text-gray-500">{test.description}</p>
                </div>
                <Badge variant="outline" className={getBadgeColor(daysUntil)}>
                  {daysUntil === 0 
                    ? 'Today' 
                    : daysUntil === 1 
                    ? 'Tomorrow' 
                    : `In ${daysUntil} days`}
                </Badge>
              </div>
              <div className="mt-2">
                <div className="text-sm text-gray-500 flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  {getTestTypeLabel(test.testType, test.questionCount)}
                </div>
              </div>
            </div>
          );
        })}
        <div className="px-4 py-4 sm:px-6">
          <Link href="/tests" className="text-sm font-medium text-primary hover:text-primary-dark">
            View all tests
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
