import { Switch, Route, Router as WouterRouter, useLocation, Redirect } from "wouter";
// QueryClientProvider and Toaster are now in main.tsx
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import MarketIntelligence from "@/pages/market-intelligence";
import LeadManagement from "@/pages/lead-management";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/not-found";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import { supabase } from "./lib/supabaseClient"; // For initial session check, if needed here
import { useEffect } from "react";


// Custom hook for path manipulation if needed, or just use useLocation
const base = ""; // If your app is not at the root of the domain, adjust this

const usePath = () => {
  const [location] = useLocation();
  return location.startsWith(base) ? location.slice(base.length) || "/" : "/";
};


function AppRouter() {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();


  useEffect(() => {
    // Listen for session changes to redirect if user signs out from a protected page
    // or signs in from the auth page
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && location === "/auth") {
        navigate("/");
      }
      // SIGNED_OUT is handled by ProtectedRoute by redirecting to /auth
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [location, navigate]);


  // If user is logged in and on /auth, redirect to home
  // This specific redirect might be better handled by AuthPage itself after successful login/signup,
  // or by the onAuthStateChange listener.
  if (!isLoading && user && location === "/auth") {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/analytics" component={AnalyticsDashboard} />
      <ProtectedRoute path="/market-intelligence" component={MarketIntelligence} />
      <ProtectedRoute path="/lead-management" component={LeadManagement} />
      {/* If user is logged in and tries a non-existent path, show NotFound */}
      {/* If not logged in, ProtectedRoute will redirect to /auth first for any protected path */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // AuthProvider, QueryClientProvider, Toaster are now in main.tsx
  return (
    <TooltipProvider>
      {/* WouterRouter is needed if AppRouter is not the direct child of providers in main.tsx,
          but since AuthProvider is in main.tsx, AppRouter can use useLocation directly.
          However, explicitly wrapping with WouterRouter can sometimes clarify context.
          Let's assume it's fine without explicit WouterRouter here if AuthProvider is already
          providing the location context implicitly or if useLocation works directly.
          For safety, let's wrap with a basic Router if AppRouter isn't the root.
          Given main.tsx structure, App is a child of AuthProvider, so this should be okay.
      */}
      <AppRouter />
    </TooltipProvider>
  );
}

export default App;
