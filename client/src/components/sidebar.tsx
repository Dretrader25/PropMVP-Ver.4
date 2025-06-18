import { Home, Search, TrendingUp, Users, FileText, Settings, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const menuItems = [
    { icon: Search, label: "Property Search", active: true },
    { icon: TrendingUp, label: "Market Analytics", active: false },
    { icon: Users, label: "Lead Management", active: false },
    { icon: FileText, label: "Export Reports", active: false },
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
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 sidebar-bg border-r border-slate-700/50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-emerald-500 rounded-lg flex items-center justify-center">
              <Home className="text-white h-4 w-4" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              PropTrace
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200",
                  item.active 
                    ? "text-slate-300 bg-primary/10 border border-primary/20" 
                    : "text-slate-400 hover:text-slate-300 hover:bg-slate-700/50"
                )}
              >
                <item.icon className={cn(
                  "mr-3 h-4 w-4",
                  item.active ? "text-primary" : ""
                )} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-700/50">
            <div className="px-4 py-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account</p>
            </div>
            <div className="space-y-2">
              {accountItems.map((item) => (
                <button
                  key={item.label}
                  className="flex items-center w-full px-4 py-3 text-slate-400 hover:text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all duration-200"
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}
