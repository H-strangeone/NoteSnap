import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, CheckCircle, Target } from "lucide-react";
import ProgressBar from "./progress-bar";
import { format, isValid } from "date-fns";

interface GoalCardProps {
  goal: any;
  onUpdate: () => void;
  isTeamGoal?: boolean;
}

export default function GoalCard({ goal, onUpdate, isTeamGoal = false }: GoalCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateGoalMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await apiRequest("PUT", `/api/goals/${id}`, updates);
    },
    onSuccess: () => {
      onUpdate();
      toast({
        title: "Success",
        description: "Goal updated successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMilestoneMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      await apiRequest("PUT", `/api/milestones/${id}`, updates);
    },
    onSuccess: () => {
      onUpdate();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Error",
        description: "Failed to update milestone. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleProgressUpdate = () => {
    setIsUpdating(true);
    const newProgress = Math.min((goal.progress || 0) + 10, 100);
    updateGoalMutation.mutate({ id: goal.id, updates: { progress: newProgress } });
    setIsUpdating(false);
  };

  const handleMilestoneToggle = (milestone: any) => {
    updateMilestoneMutation.mutate({
      id: milestone.id,
      updates: { isCompleted: !milestone.isCompleted },
    });
  };

  const categoryColors: Record<string, string> = {
    work: "bg-blue-100 text-blue-800",
    health: "bg-green-100 text-green-800",
    personal: "bg-purple-100 text-purple-800",
    learning: "bg-amber-100 text-amber-800",
    creative: "bg-pink-100 text-pink-800",
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category] || "bg-slate-100 text-slate-800";
  };

  const formatDate = (date: string | Date) => {
    if (!date) return "No due date";
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
    if (!isValid(parsedDate)) return "Invalid date";
    return format(parsedDate, "MMM d, yyyy");
  };

  const estimateTimeRemaining = () => {
    if (!goal.targetDate || goal.isCompleted) return null;
    
    const now = new Date();
    const target = new Date(goal.targetDate);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `${diffDays} days left`;
    if (diffDays <= 30) return `~${Math.ceil(diffDays / 7)} weeks left`;
    return `~${Math.ceil(diffDays / 30)} months left`;
  };

  return (
    <div className="p-6 hover:bg-slate-50 transition-colors goal-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-slate-900">{goal.title}</h4>
            <Badge className={`text-xs font-medium px-2.5 py-0.5 ${getCategoryColor(goal.category)}`}>
              {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)}
            </Badge>
            {isTeamGoal && (
              <Badge variant="outline" className="text-xs">
                Team
              </Badge>
            )}
          </div>
          
          {goal.description && (
            <p className="text-slate-600 text-sm mb-3">{goal.description}</p>
          )}

          {/* Progress Bar */}
          <div className="mb-3">
            <ProgressBar progress={goal.progress || 0} />
          </div>

          {/* Milestones */}
          {goal.milestones && goal.milestones.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-2">MILESTONES</p>
              <div className="flex flex-wrap gap-2">
                {goal.milestones.map((milestone: any) => (
                  <button
                    key={milestone.id}
                    onClick={() => handleMilestoneToggle(milestone)}
                    className={`text-xs px-2 py-1 rounded-full flex items-center space-x-1 transition-colors ${
                      milestone.isCompleted
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {milestone.isCompleted && <CheckCircle className="h-3 w-3" />}
                    <span>{milestone.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(goal.targetDate)}</span>
              </span>
              {estimateTimeRemaining() && (
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{estimateTimeRemaining()}</span>
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {goal.collaborators && goal.collaborators.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{goal.collaborators.length}</span>
                </div>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleProgressUpdate}
                disabled={isUpdating || updateGoalMutation.isPending || goal.isCompleted}
                className="text-primary hover:text-primary/90 border-primary/20"
              >
                {isUpdating || updateGoalMutation.isPending ? "..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
