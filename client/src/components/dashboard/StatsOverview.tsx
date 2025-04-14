import { Card, CardContent } from "@/components/ui/card";
import { StatOverview } from "@/types";
import { Clock, FileCheck, BookOpen, Users } from "lucide-react";

interface StatsOverviewProps {
  stats: StatOverview;
}

export default function StatsOverview({ stats }: StatsOverviewProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Study Time */}
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Weekly Study Time
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.weeklyTime}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <a href="#" className="font-medium text-primary hover:text-primary-dark">
              View details
            </a>
          </div>
        </div>
      </Card>

      {/* Tests Completed */}
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <FileCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Tests Completed
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.testsCompleted}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <a href="/tests" className="font-medium text-primary hover:text-primary-dark">
              View all tests
            </a>
          </div>
        </div>
      </Card>

      {/* Flashcards Created */}
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-amber-100 rounded-md p-3">
              <BookOpen className="h-6 w-6 text-amber-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Flashcards Created
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.flashcardsCreated}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <a href="/flashcards" className="font-medium text-primary hover:text-primary-dark">
              View all decks
            </a>
          </div>
        </div>
      </Card>

      {/* Active Groups */}
      <Card>
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
              <Users className="h-6 w-6 text-secondary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Active Groups
                </dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">
                    {stats.activeGroups}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
        <div className="bg-gray-50 px-4 py-3 sm:px-6">
          <div className="text-sm">
            <a href="/groups" className="font-medium text-primary hover:text-primary-dark">
              Manage groups
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
