import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import MarketIntelligence from "@/pages/market-intelligence";
import LeadManagement from "@/pages/lead-management";
import ProfilePage from "@/pages/profile";
import SavedSearchesPage from "@/pages/saved-searches";
import NotificationsPage from "@/pages/notifications";
import AdminDashboard from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner briefly, then show landing page for unauthenticated users
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <Route path="/" component={Landing} />
      ) : (
        <>
          <Route path="/" component={Dashboard} />
          <Route path="/analytics" component={AnalyticsDashboard} />
          <Route path="/market-intelligence" component={MarketIntelligence} />
          <Route path="/lead-management" component={LeadManagement} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/saved-searches" component={SavedSearchesPage} />
          <Route path="/notifications" component={NotificationsPage} />
          <Route path="/admin" component={AdminDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
