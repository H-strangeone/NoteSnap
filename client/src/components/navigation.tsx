import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Target, 
  BarChart3, 
  Activity,
  LogOut, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth() as any;

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Goals', href: '/goals', icon: Target },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Fitness', href: '/fitness', icon: Activity },
  ];

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-primary" />
                  <span className="text-xl font-bold text-slate-900">GoalSync</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-primary text-primary"
                        : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User menu and mobile menu button */}
          <div className="flex items-center space-x-4">
            {/* User info */}
            <div className="hidden sm:flex sm:items-center sm:space-x-3">
              <div className="text-sm">
                <p className="font-medium text-slate-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-slate-500">{user?.email}</p>
              </div>
              {user?.profileImageUrl && (
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.profileImageUrl}
                  alt="Profile"
                />
              )}
            </div>

            {/* Logout button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden sm:flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors",
                    isActive
                      ? "bg-primary/5 border-primary text-primary"
                      : "border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          
          <div className="pt-4 pb-3 border-t border-slate-200">
            <div className="flex items-center px-4">
              {user?.profileImageUrl && (
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={user.profileImageUrl}
                  alt="Profile"
                />
              )}
              <div className="ml-3">
                <div className="text-base font-medium text-slate-800">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-sm text-slate-500">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start pl-4"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}