import { Link, useLocation, Redirect } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { 
  Search, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Menu,
  Home,
  LogOut, // For logout button
  UserCircle, // For user profile or login
  LogIn // For login button
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // For user avatar
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface NavigationBarProps {
  onMenuClick?: () => void;
}

export default function NavigationBar({ onMenuClick }: NavigationBarProps) {
  const [location, navigate] = useLocation();
  const { user, signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth"); // Redirect to auth page after logout
  };

  const navigationItems = [
    {
      icon: Search,
      label: "Property Search",
      path: "/",
      active: location === "/" && user // Only active if user is logged in
    },
    {
      icon: BarChart3,
      label: "Analytics",
      path: "/analytics",
      active: location === "/analytics" && user
    },
    {
      icon: TrendingUp,
      label: "Market Intelligence",
      path: "/market-intelligence",
      active: location === "/market-intelligence" && user
    },
    {
      icon: Users,
      label: "Lead Management",
      path: "/lead-management",
      active: location === "/lead-management" && user
    }
  ];

  // Filter out nav items if user is not logged in, or adjust based on desired UX for logged-out users
  const visibleNavigationItems = user ? navigationItems : [];


  return (
    <nav className="sticky top-0 z-30 w-full border-b border-slate-700/30 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="flex items-center">
            {user && onMenuClick && ( // Only show menu button if user is logged in and onMenuClick is provided
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-400 hover:text-white mr-3"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            <Link href={user ? "/" : "/auth"} className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Home className="text-white h-4 w-4" />
              </div>
              <span className="text-xl font-bold text-gradient hidden sm:block">
                PropAnalyzed
              </span>
            </Link>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-1">
              {visibleNavigationItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "px-4 py-2 rounded-xl transition-all duration-300 flex items-center space-x-2",
                      item.active
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-9 w-9 border-2 border-slate-600 hover:border-blue-500 transition-colors">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || "User"} />
                      <AvatarFallback className="bg-slate-700 text-slate-300">
                        {user.email ? user.email.substring(0, 2).toUpperCase() : <UserCircle size={20}/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-slate-200" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">Signed in as</p>
                      <p className="text-xs leading-none text-slate-400 truncate">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-700" />
                  {/* Add other items like "Profile", "Settings" if needed */}
                  {/* <DropdownMenuItem className="hover:bg-slate-700/50 focus:bg-slate-700/50">Settings</DropdownMenuItem> */}
                  <DropdownMenuItem onClick={handleLogout} className="hover:bg-slate-700/50 focus:bg-slate-700/50 cursor-pointer text-red-400 hover:text-red-300">
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700/50">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Button>
              </Link>
            )}
            {user && ( /* Show Pro badge only if logged in, can be part of user metadata later */
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-sm text-slate-400">
                   Professional Plan
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-white text-xs font-bold">
                  Pro
                </div>
              </div>
            )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu (Visible on small screens) */}
        {user && ( // Only show mobile nav items if user is logged in
          <div className="md:hidden border-t border-slate-700/30 py-3">
            <div className="flex items-center justify-between space-x-1">
              {visibleNavigationItems.map((item) => (
                <Link key={item.path} href={item.path} className="flex-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full px-2 py-2 rounded-xl transition-all duration-300 flex flex-col items-center space-y-1 text-xs",
                      item.active
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/30"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium truncate">{item.label.split(' ')[0]}</span>
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}