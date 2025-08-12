import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Plus } from "lucide-react";

interface GoalFormProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function GoalForm({ onClose, onSubmit }: GoalFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "personal",
    targetDate: "",
    isTeamGoal: false,
  });
  const [milestones, setMilestones] = useState<string[]>(["", ""]);

  const createGoalMutation = useMutation({
    mutationFn: async (goalData: any) => {
      await apiRequest("POST", "/api/goals", goalData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Goal created successfully!",
      });
      onSubmit();
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
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Goal title is required.",
        variant: "destructive",
      });
      return;
    }

    const validMilestones = milestones.filter(m => m.trim());
    
    createGoalMutation.mutate({
      ...formData,
      milestones: validMilestones,
    });
  };

  const addMilestone = () => {
    setMilestones([...milestones, ""]);
  };

  const updateMilestone = (index: number, value: string) => {
    const updated = [...milestones];
    updated[index] = value;
    setMilestones(updated);
  };

  const removeMilestone = (index: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Create New Goal</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal Title *
              </label>
              <Input
                type="text"
                placeholder="Enter your goal title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                placeholder="Describe your goal in detail..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="health">Health</option>
                  <option value="learning">Learning</option>
                  <option value="creative">Creative</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Date
                </label>
                <Input
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Milestones
              </label>
              <div className="space-y-2">
                {milestones.map((milestone, index) => (
                  <div key={index} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder={`Milestone ${index + 1}...`}
                      value={milestone}
                      onChange={(e) => updateMilestone(index, e.target.value)}
                      className="flex-1"
                    />
                    {milestones.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMilestone(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addMilestone}
                  className="text-primary"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
              <Checkbox
                id="teamGoal"
                checked={formData.isTeamGoal}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isTeamGoal: checked as boolean })
                }
              />
              <label htmlFor="teamGoal" className="text-sm text-gray-700">
                <span className="font-medium">Make this a team goal</span>
                <span className="block text-gray-500">
                  Allow team members to collaborate and track progress together
                </span>
              </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={createGoalMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGoalMutation.isPending}
                className="bg-primary hover:bg-primary/90"
              >
                {createGoalMutation.isPending ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
