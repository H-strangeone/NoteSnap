import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import GoalCard from "@/components/goal-card";
import GoalForm from "@/components/goal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter, Target } from "lucide-react";

export default function Goals() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const { data: goals, isLoading: goalsLoading, refetch: refetchGoals } = useQuery({
    queryKey: ["/api/goals"],
    retry: false,
  });

  const { data: teamGoals, isLoading: teamGoalsLoading, refetch: refetchTeamGoals } = useQuery({
    queryKey: ["/api/team-goals"],
    retry: false,
  });

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredGoals = goals?.filter((goal: any) => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || goal.category === categoryFilter;
    const matchesStatus = !statusFilter || 
                         (statusFilter === "completed" && goal.isCompleted) ||
                         (statusFilter === "active" && !goal.isCompleted);
    
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  const categories = [...new Set(goals?.map((goal: any) => goal.category) || [])];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">My Goals</h2>
            <p className="text-slate-600 mt-1">Manage and track all your goals</p>
          </div>
          <Button
            onClick={() => setShowGoalForm(true)}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </Button>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search goals..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Goals */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Personal Goals ({filteredGoals.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {goalsLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : filteredGoals.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {filteredGoals.map((goal: any) => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={refetchGoals} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    <Target className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium mb-2">
                      {searchTerm || categoryFilter || statusFilter ? "No matching goals" : "No goals yet"}
                    </p>
                    <p className="text-sm mb-4">
                      {searchTerm || categoryFilter || statusFilter 
                        ? "Try adjusting your search or filters"
                        : "Create your first goal to get started!"
                      }
                    </p>
                    {!searchTerm && !categoryFilter && !statusFilter && (
                      <Button onClick={() => setShowGoalForm(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Goal
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Team Goals */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900 flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Team Goals ({teamGoals?.length || 0})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {teamGoalsLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : teamGoals && teamGoals.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {teamGoals.map((goal: any) => (
                      <GoalCard key={goal.id} goal={goal} onUpdate={refetchTeamGoals} isTeamGoal />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-500">
                    <Users className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-lg font-medium mb-2">No team goals yet</p>
                    <p className="text-sm mb-4">
                      Create a team goal or get invited to collaborate!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {showGoalForm && (
        <GoalForm
          onClose={() => setShowGoalForm(false)}
          onSubmit={() => {
            setShowGoalForm(false);
            refetchGoals();
            refetchTeamGoals();
          }}
        />
      )}
    </div>
  );
}
