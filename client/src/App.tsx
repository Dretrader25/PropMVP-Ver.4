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
import NotFound from "@/pages/not-found";

function Router() {
  try {
    const { isAuthenticated, isLoading } = useAuth();

    // Show landing page while loading or if not authenticated
    if (isLoading || !isAuthenticated) {
      return <Landing />;
    }

    return (
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/analytics" component={AnalyticsDashboard} />
        <Route path="/market-intelligence" component={MarketIntelligence} />
        <Route path="/lead-management" component={LeadManagement} />
        <Route component={NotFound} />
      </Switch>
    );
  } catch (error) {
    // Fallback in case of authentication errors
    console.error('Authentication error:', error);
    return <Landing />;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                PropAnalyzed
              </h1>
              <p className="text-white text-xl mb-8">
                Real Estate Wholesaling Platform
              </p>
              <button 
                onClick={() => window.location.href = "/api/login"}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold"
              >
                Login to Continue
              </button>
            </div>
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
