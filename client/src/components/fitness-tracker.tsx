import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Activity, 
  Heart, 
  MapPin, 
  Clock, 
  Weight, 
  Target,
  TrendingUp,
  Plus,
  Edit3
} from "lucide-react";

interface FitnessData {
  id?: string;
  steps: number;
  distance: number;
  calories: number;
  activeMinutes: number;
  heartRate?: number;
  weight?: number;
  notes?: string;
}

export default function FitnessTracker() {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FitnessData>({
    steps: 0,
    distance: 0,
    calories: 0,
    activeMinutes: 0,
    heartRate: undefined,
    weight: undefined,
    notes: "",
  });

  // Get today's fitness data
  const { data: todayFitness, isLoading } = useQuery({
    queryKey: ["/api/fitness/today"],
    retry: false,
  });

  // Get weekly fitness data for trends
  const { data: weeklyFitness } = useQuery({
    queryKey: ["/api/fitness/weekly"],
    retry: false,
  });

  // Auto-populate form with today's data
  useEffect(() => {
    if (todayFitness) {
      setFormData({
        steps: todayFitness.steps || 0,
        distance: todayFitness.distance || 0,
        calories: todayFitness.calories || 0,
        activeMinutes: todayFitness.activeMinutes || 0,
        heartRate: todayFitness.heartRate || undefined,
        weight: todayFitness.weight ? todayFitness.weight / 1000 : undefined, // Convert grams to kg
        notes: todayFitness.notes || "",
      });
    }
  }, [todayFitness]);

  const updateFitnessMutation = useMutation({
    mutationFn: async (data: FitnessData) => {
      const payload = {
        ...data,
        weight: data.weight ? Math.round(data.weight * 1000) : undefined, // Convert kg to grams
      };

      if (todayFitness?.id) {
        return await apiRequest("PUT", `/api/fitness/${todayFitness.id}`, payload);
      } else {
        return await apiRequest("POST", "/api/fitness", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fitness"] });
      setIsEditing(false);
      toast({
        title: "Fitness data updated",
        description: "Your daily fitness tracking has been saved",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to save fitness data. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFitnessMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof FitnessData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Calculate weekly averages and trends
  const weeklyStats = weeklyFitness?.reduce((acc: any, day: any) => {
    acc.totalSteps += day.steps || 0;
    acc.totalDistance += day.distance || 0;
    acc.totalCalories += day.calories || 0;
    acc.totalActiveMinutes += day.activeMinutes || 0;
    acc.days += 1;
    return acc;
  }, {
    totalSteps: 0,
    totalDistance: 0,
    totalCalories: 0,
    totalActiveMinutes: 0,
    days: 0,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-3 bg-slate-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Daily Fitness Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Today's Fitness</span>
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : <Edit3 className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-blue-600">
                  {(todayFitness?.steps || 0).toLocaleString()}
                </p>
                <p className="text-sm text-slate-600">Steps</p>
              </div>
              
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <MapPin className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-green-600">
                  {((todayFitness?.distance || 0) / 1000).toFixed(1)}
                </p>
                <p className="text-sm text-slate-600">km</p>
              </div>
              
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <Target className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-orange-600">
                  {todayFitness?.calories || 0}
                </p>
                <p className="text-sm text-slate-600">Calories</p>
              </div>
              
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <Clock className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-2xl font-bold text-purple-600">
                  {todayFitness?.activeMinutes || 0}
                </p>
                <p className="text-sm text-slate-600">Active min</p>
              </div>
              
              {todayFitness?.heartRate && (
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-red-600">
                    {todayFitness.heartRate}
                  </p>
                  <p className="text-sm text-slate-600">BPM</p>
                </div>
              )}
              
              {todayFitness?.weight && (
                <div className="text-center p-3 bg-slate-50 rounded-lg">
                  <Weight className="h-6 w-6 text-slate-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-slate-600">
                    {(todayFitness.weight / 1000).toFixed(1)}
                  </p>
                  <p className="text-sm text-slate-600">kg</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="steps">Steps</Label>
                  <Input
                    id="steps"
                    type="number"
                    value={formData.steps}
                    onChange={(e) => handleInputChange("steps", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.1"
                    value={formData.distance / 1000}
                    onChange={(e) => handleInputChange("distance", (parseFloat(e.target.value) || 0) * 1000)}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    value={formData.calories}
                    onChange={(e) => handleInputChange("calories", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="activeMinutes">Active Minutes</Label>
                  <Input
                    id="activeMinutes"
                    type="number"
                    value={formData.activeMinutes}
                    onChange={(e) => handleInputChange("activeMinutes", parseInt(e.target.value) || 0)}
                    min="0"
                  />
                </div>
                
                <div>
                  <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={formData.heartRate || ""}
                    onChange={(e) => handleInputChange("heartRate", parseInt(e.target.value) || undefined)}
                    min="0"
                    max="300"
                  />
                </div>
                
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight || ""}
                    onChange={(e) => handleInputChange("weight", parseFloat(e.target.value) || undefined)}
                    min="0"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes || ""}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="How did you feel today? Any observations..."
                  rows={3}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={updateFitnessMutation.isPending}
                className="w-full"
              >
                {updateFitnessMutation.isPending ? "Saving..." : "Save Fitness Data"}
              </Button>
            </form>
          )}
          
          {todayFitness?.notes && !isEditing && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600">"{todayFitness.notes}"</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      {weeklyStats && weeklyStats.days > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <span>7-Day Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {Math.round(weeklyStats.totalSteps / weeklyStats.days).toLocaleString()}
                </p>
                <p className="text-sm text-slate-600">Avg Steps/day</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">
                  {(weeklyStats.totalDistance / weeklyStats.days / 1000).toFixed(1)}
                </p>
                <p className="text-sm text-slate-600">Avg km/day</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">
                  {Math.round(weeklyStats.totalCalories / weeklyStats.days)}
                </p>
                <p className="text-sm text-slate-600">Avg Calories/day</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(weeklyStats.totalActiveMinutes / weeklyStats.days)}
                </p>
                <p className="text-sm text-slate-600">Avg Active min/day</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}