import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import FitnessTracker from "@/components/fitness-tracker";
import MemoryGallery from "@/components/memory-gallery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Camera, TrendingUp } from "lucide-react";

export default function Fitness() {
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

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900">Fitness & Wellness</h2>
          <p className="text-slate-600 mt-1">Track your daily activity, steps, and capture progress moments</p>
        </div>

        <Tabs defaultValue="fitness" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="fitness" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Activity Tracking</span>
            </TabsTrigger>
            <TabsTrigger value="memories" className="flex items-center space-x-2">
              <Camera className="h-4 w-4" />
              <span>Progress Photos</span>
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Insights</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fitness" className="space-y-6">
            <FitnessTracker />
          </TabsContent>

          <TabsContent value="memories" className="space-y-6">
            <MemoryGallery />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coming Soon: Advanced Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  We're working on advanced analytics including:
                </p>
                <ul className="list-disc list-inside mt-4 space-y-2 text-slate-600">
                  <li>Weekly and monthly trends analysis</li>
                  <li>Goal correlation with fitness metrics</li>
                  <li>Progress photo timeline visualization</li>
                  <li>Personalized recommendations</li>
                  <li>Achievement badges and milestones</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}