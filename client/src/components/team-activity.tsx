import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ThumbsUp, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function TeamActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities"],
    retry: false,
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "goal_created":
        return "🎯";
      case "milestone_completed":
        return "✅";
      case "progress_updated":
        return "📈";
      case "daily_checkin":
        return "📅";
      default:
        return "💫";
    }
  };

  const getActivityMessage = (activity: any) => {
    const userName = activity.user?.firstName || "Someone";
    
    switch (activity.type) {
      case "goal_created":
        return (
          <>
            <span className="font-medium">{userName}</span> created new goal{" "}
            <span className="font-medium">"{activity.data?.goalTitle}"</span>
          </>
        );
      case "milestone_completed":
        return (
          <>
            <span className="font-medium">{userName}</span> completed milestone{" "}
            <span className="font-medium">"{activity.data?.milestoneTitle}"</span>
          </>
        );
      case "progress_updated":
        return (
          <>
            <span className="font-medium">{userName}</span> updated progress on{" "}
            <span className="font-medium">"{activity.data?.goalTitle}"</span>
          </>
        );
      case "daily_checkin":
        return (
          <>
            <span className="font-medium">{userName}</span> completed daily check-in with{" "}
            <span className="font-medium capitalize">{activity.data?.mood}</span> mood
          </>
        );
      default:
        return (
          <>
            <span className="font-medium">{userName}</span> had some activity
          </>
        );
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
            <Users className="text-slate-400 h-5 w-5" />
            <span>Team Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : activities && activities.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {activities.slice(0, 5).map((activity: any) => (
                <div key={activity.id} className="p-4 activity-item">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-900">
                        {getActivityMessage(activity)}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                      
                      {activity.type === "progress_updated" && activity.data && (
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="bg-slate-200 rounded-full h-1.5 w-16">
                            <div
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${activity.data.newProgress || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500">
                            {activity.data.newProgress || 0}%
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500">
              <Users className="h-8 w-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm">No team activity yet</p>
            </div>
          )}
          
          {activities && activities.length > 5 && (
            <div className="p-4 border-t border-slate-200">
              <Button
                variant="ghost"
                className="w-full text-center text-slate-600 hover:text-slate-900 text-sm font-medium"
              >
                View All Activity
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Implement invite functionality
              console.log("Invite team member");
            }}
          >
            <div className="flex items-center space-x-3">
              <Users className="text-primary h-4 w-4" />
              <span className="text-sm font-medium">Invite Team Member</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Implement create team goal
              console.log("Create team goal");
            }}
          >
            <div className="flex items-center space-x-3">
              <Users className="text-secondary h-4 w-4" />
              <span className="text-sm font-medium">Create Team Goal</span>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => {
              // TODO: Implement export functionality
              console.log("Export progress report");
            }}
          >
            <div className="flex items-center space-x-3">
              <Eye className="text-accent h-4 w-4" />
              <span className="text-sm font-medium">Export Progress Report</span>
            </div>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
