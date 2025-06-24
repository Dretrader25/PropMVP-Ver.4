import { Home, Search, TrendingUp, Users, FileText, Settings, LogOut, X, BarChart3, ChevronLeft, ChevronRight, UserCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    setLocation("/auth"); // Redirect to auth page after logout
    onClose(); // Close sidebar if open
  };
  
  const menuItems = user ? [ // Only show menu items if user is logged in
    { icon: Search, label: "Property Search", path: "/", active: location === "/" },
    { icon: BarChart3, label: "Analytics Dashboard", path: "/analytics", active: location === "/analytics" },
    { icon: TrendingUp, label: "Market Intelligence", path: "/market-intelligence", active: location === "/market-intelligence" },
    { icon: Users, label: "Lead Management", path: "/lead-management", active: location === "/lead-management" },
    // { icon: FileText, label: "Export Reports", path: "/reports", active: false }, // Example if reports page exists
  ] : [];

  const accountItems = user ? [
    // { icon: Settings, label: "Settings", action: () => { /* TODO: Navigate to settings */ onClose();} },
    { icon: LogOut, label: "Logout", action: handleLogout },
  ] : [];

  // If user is not logged in, perhaps show nothing or a simplified sidebar
  // For this implementation, if no user, the main content area will show AuthPage,
  // so the sidebar might not be relevant or could be hidden entirely by App.tsx logic.
  // However, if it *is* shown, it should reflect the auth state.

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 sidebar-bg transform transition-all duration-300 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header with Logo and User/Plan Info */}
        <div className="flex items-center justify-between h-18 px-3 border-b border-slate-700/30 shrink-0">
          <div className="flex items-center space-x-2 overflow-hidden">
            <div
              className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center float-animation shrink-0 cursor-pointer"
              onClick={() => setLocation(user ? "/" : "/auth")}
            >
              <Home className="text-white h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="text-lg font-bold text-gradient truncate block">
                  PropAnalyzed
                </span>
                {user && (
                  <div className="text-xs text-slate-400 mt-0.5 truncate">
                    {user.email}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-400 hover:text-white transition-colors rounded-xl"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex text-slate-400 hover:text-white transition-colors rounded-xl"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Navigation Area */}
        <nav className="flex-grow mt-6 px-2 overflow-y-auto space-y-3">
          {user && menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                if (item.path) {
                  setLocation(item.path);
                  onClose(); // Close sidebar on mobile after navigation
                }
              }}
              className={cn(
                "flex items-center w-full text-left rounded-2xl transition-all duration-300 group relative",
                isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3", // Adjusted padding
                item.active
                  ? "text-slate-200 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-300",
                isCollapsed ? "mr-0" : "mr-2", // Adjusted margin
                item.active
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-slate-700/30 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-300"
              )}>
                <item.icon className="h-5 w-5" />
              </div>
              {!isCollapsed && (
                <>
                  <span className="font-medium text-sm truncate">{item.label}</span>
                  {item.active && (
                    <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                  )}
                </>
              )}
              {isCollapsed && item.active && (
                <div className="absolute right-1 top-1 w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Footer / Account Section */}
        <div className="mt-auto p-2 shrink-0">
          {user && !isCollapsed && (
            <div className="mb-2 pt-2 border-t border-slate-700/30">
              {accountItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center w-full px-3 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-2xl transition-all duration-300 group"
                >
                  <div className="p-2 rounded-xl mr-2 bg-slate-700/30 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-300 transition-all duration-300">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          {user && isCollapsed && (
             <div className="flex flex-col items-center space-y-2 py-2 border-t border-slate-700/30">
              {accountItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-2xl transition-all duration-300"
                  title={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          )}
          
          {!isCollapsed && user && (
            <div className="p-3 glass-card rounded-2xl">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-sm">Pro</span>
                  </div>
                  <h4 className="text-slate-200 font-semibold text-sm mb-1">Upgrade to Pro</h4>
                  <p className="text-slate-400 text-xs mb-3">Unlock skip tracing & advanced analytics</p>
                  <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition-all duration-300">
                    Upgrade Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {isCollapsed && user && ( // Pro upgrade button for collapsed state
            <div className="p-3 flex justify-center">
               <Button className="w-10 h-10 p-0 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-xl text-xs transition-all duration-300" title="Upgrade to Pro">
                  Pro
                </Button>
            </div>
          )}

        </div>
      </div>

    </>
  );
}
