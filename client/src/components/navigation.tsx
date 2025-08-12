import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Target, Bell } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navigation() {
  const { user } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/goals", label: "My Goals" },
    { path: "/analytics", label: "Analytics" },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Target className="text-white text-sm" />
              </div>
              <h1 className="text-xl font-bold text-slate-900">GoalSync</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`pb-4 border-b-2 transition-colors ${
                    location === item.path
                      ? "text-primary font-medium border-primary"
                      : "text-slate-600 hover:text-slate-900 border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 text-slate-600 hover:text-slate-900 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
            {/* Profile */}
            <div className="flex items-center space-x-3">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-slate-700">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-slate-900">
                {user?.firstName || user?.email || "User"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/api/logout'}
                className="text-slate-600 hover:text-slate-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
