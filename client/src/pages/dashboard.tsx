import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import DailyCheckin from "@/components/daily-checkin";
import GoalCard from "@/components/goal-card";
import TeamActivity from "@/components/team-activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Target, CheckCircle, Users, TrendingUp } from "lucide-react";
import { useState } from "react";
import GoalForm from "@/components/goal-form";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [showGoalForm, setShowGoalForm] = useState(false);

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

  const { data: goals, isLoading: goalsLoading, refetch: refetchGoals } = useQuery({
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

  const firstName = user?.firstName || "there";
  const recentGoals = goals?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Good morning, {firstName}! 👋
            </h2>
            <p className="text-slate-600 mt-1">Let's see how your goals are progressing today</p>
          </div>
          <Button
            onClick={() => setShowGoalForm(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Active Goals</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {statsLoading ? "..." : stats?.activeGoals || 0}
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
                  <p className="text-slate-600 text-sm font-medium">Completed This Week</p>
                  <p className="text-3xl font-bold text-secondary mt-1">
                    {statsLoading ? "..." : stats?.completedWeek || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-secondary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Team Goals</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    {statsLoading ? "..." : stats?.teamGoals || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="text-purple-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 text-sm font-medium">Average Progress</p>
                  <p className="text-3xl font-bold text-accent mt-1">
                    {statsLoading ? "..." : `${stats?.avgProgress || 0}%`}
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-accent text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Check-in */}
        <DailyCheckin />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Goals */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-semibold text-slate-900">
                    Current Goals
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
                      <option value="">All Categories</option>
                      <option value="personal">Personal</option>
                      <option value="work">Work</option>
                      <option value="health">Health</option>
                      <option value="learning">Learning</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {goalsLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : recentGoals.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {recentGoals.map((goal: any) => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={refetchGoals} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    <Target className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium mb-2">No goals yet</p>
                    <p className="text-sm mb-4">Create your first goal to get started!</p>
                    <Button onClick={() => setShowGoalForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Goal
                    </Button>
                  </div>
                )}
                
                {recentGoals.length > 0 && (
                  <div className="p-6 border-t border-slate-200">
                    <Button
                      variant="ghost"
                      className="w-full text-slate-600 hover:text-slate-900"
                      onClick={() => window.location.href = '/goals'}
                    >
                      View All Goals ({(goals?.length || 0) - recentGoals.length} more)
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TeamActivity />
          </div>
        </div>
      </main>

      {showGoalForm && (
        <GoalForm
          onClose={() => setShowGoalForm(false)}
          onSubmit={() => {
            setShowGoalForm(false);
            refetchGoals();
          }}
        />
      )}
    </div>
  );
}
