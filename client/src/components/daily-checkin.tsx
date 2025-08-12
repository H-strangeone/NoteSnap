import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CalendarCheck, Smile, ThumbsUp } from "lucide-react";

export default function DailyCheckin() {
  const { toast } = useToast();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const { data: todayCheckin, refetch } = useQuery({
    queryKey: ["/api/checkin/today"],
    retry: false,
  });

  const createCheckinMutation = useMutation({
    mutationFn: async (checkinData: { mood: string; notes?: string }) => {
      await apiRequest("POST", "/api/checkin", checkinData);
    },
    onSuccess: () => {
      toast({
        title: "Check-in Complete!",
        description: "Your daily progress has been recorded.",
      });
      refetch();
      setSelectedMood("");
      setNotes("");
      setShowNotes(false);
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
        description: "Failed to save check-in. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setShowNotes(true);
  };

  const handleSubmit = () => {
    if (!selectedMood) return;
    
    createCheckinMutation.mutate({
      mood: selectedMood,
      notes: notes.trim() || undefined,
    });
  };

  if (todayCheckin) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-100">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="text-white h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">Check-in Complete! ✅</h3>
            <p className="text-slate-600">
              You checked in today with a <span className="font-medium capitalize">{todayCheckin.mood}</span> mood.
              {todayCheckin.notes && " Great job staying on track!"}
            </p>
            {todayCheckin.notes && (
              <p className="text-sm text-slate-500 mt-2 italic">"{todayCheckin.notes}"</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-100">
      <div className="flex items-start space-x-4">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <CalendarCheck className="text-white h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-2">Daily Check-in</h3>
          <p className="text-slate-600 mb-4">How did you progress on your goals today?</p>
          
          {!showNotes ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleMoodSelect("great")}
                className="bg-white hover:bg-green-50 border-2 border-green-200 text-slate-900 p-4 h-auto justify-start"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <Smile className="text-green-500 h-6 w-6" />
                  <div className="text-left">
                    <p className="font-medium">Great Progress!</p>
                    <p className="text-sm text-slate-600">Exceeded expectations</p>
                  </div>
                </div>
              </Button>
              
              <Button
                onClick={() => handleMoodSelect("good")}
                className="bg-white hover:bg-blue-50 border-2 border-blue-200 text-slate-900 p-4 h-auto justify-start"
                variant="outline"
              >
                <div className="flex items-center space-x-3">
                  <ThumbsUp className="text-blue-500 h-6 w-6" />
                  <div className="text-left">
                    <p className="font-medium">On Track</p>
                    <p className="text-sm text-slate-600">Making steady progress</p>
                  </div>
                </div>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border">
                <p className="text-sm text-slate-600 mb-2">Selected mood:</p>
                <p className="font-medium capitalize text-slate-900">{selectedMood}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Any additional notes? (optional)
                </label>
                <Textarea
                  placeholder="Share your thoughts about today's progress..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNotes(false);
                    setSelectedMood("");
                    setNotes("");
                  }}
                  disabled={createCheckinMutation.isPending}
                >
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={createCheckinMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {createCheckinMutation.isPending ? "Saving..." : "Complete Check-in"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
