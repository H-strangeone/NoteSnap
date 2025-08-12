import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, BarChart3, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Target className="text-white text-xl" />
              </div>
              <h1 className="text-4xl font-bold text-slate-900">GoalSync</h1>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Achieve Your Goals
              <span className="text-primary block">Together</span>
            </h2>
            
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Track progress, stay motivated, and collaborate with friends on your personal and professional goals. 
              Turn your aspirations into achievements with social accountability.
            </p>
            
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              onClick={() => window.location.href = '/api/login'}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Everything You Need to Succeed
          </h3>
          <p className="text-slate-600 text-lg">
            Powerful features designed to keep you motivated and on track
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="text-primary text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Smart Goal Tracking</h4>
              <p className="text-slate-600 text-sm">
                Set clear objectives with milestones and track your progress with visual indicators
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-secondary text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Team Collaboration</h4>
              <p className="text-slate-600 text-sm">
                Share goals with friends and teammates for mutual support and accountability
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-accent text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Progress Analytics</h4>
              <p className="text-slate-600 text-sm">
                Get insights into your performance with detailed analytics and time estimation
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-purple-600 text-xl" />
              </div>
              <h4 className="text-lg font-semibold text-slate-900 mb-2">Daily Check-ins</h4>
              <p className="text-slate-600 text-sm">
                Stay on track with daily progress updates and motivational reminders
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Goals into Reality?
            </h3>
            <p className="text-indigo-100 text-lg mb-8">
              Join thousands of users who are achieving more with GoalSync
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Your Journey
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
