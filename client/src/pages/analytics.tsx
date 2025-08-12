import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Target, Calendar, Download } from "lucide-react";

export default function Analytics() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    retry: false,
  });

  const { data: goals, isLoading: goalsLoading } = useQuery({
    queryKey: ["/api/goals"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const weeklyData = [
    { day: "Monday", completed: 2, updated: 1 },
    { day: "Tuesday", completed: 1, updated: 3 },
    { day: "Wednesday", completed: 3, updated: 2 },
    { day: "Thursday", completed: 0, updated: 1 },
    { day: "Friday", completed: 1, updated: 2 },
    { day: "Saturday", completed: 2, updated: 0 },
    { day: "Sunday", completed: 1, updated: 1 },
  ];

  const categoryStats = goals?.reduce((acc: any, goal: any) => {
    const category = goal.category;
    if (!acc[category]) {
      acc[category] = { count: 0, totalProgress: 0, completed: 0 };
    }
    acc[category].count++;
    acc[category].totalProgress += goal.progress || 0;
    if (goal.isCompleted) acc[category].completed++;
    return acc;
  }, {}) || {};

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Analytics</h2>
            <p className="text-slate-600 mt-1">Track your progress and performance insights</p>
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Total Goals</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {goalsLoading ? "..." : goals?.length || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="text-primary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Completion Rate</p>
                  <p className="text-3xl font-bold text-secondary mt-1">
                    {goalsLoading ? "..." : `${Math.round(((goals?.filter((g: any) => g.isCompleted).length || 0) / (goals?.length || 1)) * 100)}%`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-secondary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Weekly Streak</p>
                  <p className="text-3xl font-bold text-accent mt-1">
                    {weeklyData.filter(d => d.completed > 0 || d.updated > 0).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-accent text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Avg Progress</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {statsLoading ? "..." : `${stats?.avgProgress || 0}%`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="text-purple-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">This Week's Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day) => (
                  <div key={day.day} className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{day.day}</span>
                    <div className="flex items-center space-x-4">
                      {day.completed > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-secondary rounded-full"></div>
                          <span className="text-sm font-medium">{day.completed} completed</span>
                        </div>
                      )}
                      {day.updated > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium">{day.updated} updated</span>
                        </div>
                      )}
                      {day.completed === 0 && day.updated === 0 && (
                        <span className="text-sm text-slate-400">No activity</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-2xl font-bold text-slate-900">
                    {Math.round((weeklyData.filter(d => d.completed > 0 || d.updated > 0).length / weeklyData.length) * 100)}%
                  </p>
                  <p className="text-sm text-slate-600">Weekly activity rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Goals by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, stats]: [string, any]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900 capitalize">
                        {category}
                      </span>
                      <span className="text-sm text-slate-600">
                        {stats.completed}/{stats.count} completed
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${stats.count > 0 ? (stats.totalProgress / stats.count) : 0}%`
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Avg: {Math.round(stats.totalProgress / stats.count || 0)}%</span>
                      <span>{stats.count} goals</span>
                    </div>
                  </div>
                ))}
                
                {Object.keys(categoryStats).length === 0 && (
                  <div className="text-center text-slate-500 py-8">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium mb-2">No data yet</p>
                    <p className="text-sm">Create some goals to see analytics!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
