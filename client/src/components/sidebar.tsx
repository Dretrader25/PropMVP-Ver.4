import { Home, Search, TrendingUp, Users, FileText, Settings, LogOut, X, BarChart3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location, setLocation] = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const menuItems = [
    { icon: Search, label: "Property Search", path: "/", active: location === "/" },
    { icon: BarChart3, label: "Analytics Dashboard", path: "/analytics", active: location === "/analytics" },
    { icon: TrendingUp, label: "Market Intelligence", path: "/market-intelligence", active: location === "/market-intelligence" },
    { icon: Users, label: "Lead Management", path: "/lead-management", active: location === "/lead-management" },
    { icon: FileText, label: "Export Reports", path: "/reports", active: false },
  ];

  const accountItems = [
    { icon: Settings, label: "Settings" },
    { icon: LogOut, label: "Logout" },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Modern Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 sidebar-bg transform transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-18 px-3 border-b border-slate-700/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl flex items-center justify-center float-animation">
              <Home className="text-white h-5 w-5" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-xl font-bold text-gradient">
                  PropAnalyzed
                </span>
                <div className="text-xs text-slate-400 mt-0.5">Professional</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
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
        
        <nav className="mt-8 px-2">
          <div className="space-y-3">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  if (item.path) {
                    setLocation(item.path);
                    onClose();
                  }
                }}
                className={cn(
                  "flex items-center w-full text-left rounded-2xl transition-all duration-300 group relative",
                  isCollapsed ? "px-3 py-3 justify-center" : "px-5 py-4",
                  item.active 
                    ? "text-slate-200 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 border border-blue-500/30 shadow-lg" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isCollapsed ? "mr-0" : "mr-3",
                  item.active 
                    ? "bg-blue-500/20 text-blue-400" 
                    : "bg-slate-700/30 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-300"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                {!isCollapsed && (
                  <>
                    <span className="font-semibold">{item.label}</span>
                    {item.active && (
                      <div className="ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
                    )}
                  </>
                )}
                {isCollapsed && item.active && (
                  <div className="absolute right-1 top-1 w-2 h-2 bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
          
          {!isCollapsed && (
            <>
              <div className="mt-10 pt-8 border-t border-slate-700/30">
                <div className="px-5 py-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Account Settings</p>
                </div>
                <div className="space-y-2">
                  {accountItems.map((item) => (
                    <button
                      key={item.label}
                      className="flex items-center w-full px-5 py-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-2xl transition-all duration-300 group"
                    >
                      <div className="p-2 rounded-xl mr-3 bg-slate-700/30 text-slate-400 group-hover:bg-slate-700/50 group-hover:text-slate-300 transition-all duration-300">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 p-4 glass-card rounded-2xl">
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
            </>
          )}
          
          {isCollapsed && (
            <div className="mt-8 flex flex-col items-center space-y-4">
              {accountItems.map((item) => (
                <button
                  key={item.label}
                  className="p-3 text-slate-400 hover:text-slate-200 hover:bg-slate-700/40 rounded-2xl transition-all duration-300"
                  title={item.label}
                >
                  <item.icon className="h-4 w-4" />
                </button>
              ))}
              <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xs">Pro</span>
              </div>
            </div>
          )}
        </nav>
      </div>
    </>
  );
}
