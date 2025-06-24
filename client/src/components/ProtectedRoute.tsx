import { ReactNode } from 'react';
import { Redirect, Route, RouteProps } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

interface ProtectedRouteProps extends RouteProps {
  component: React.ComponentType<any>;
  // Add any other props you might pass to Route if needed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, ...rest }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // You can render a more sophisticated loading spinner or page here
    return (
      <div className="flex items-center justify-center min-h-screen gradient-bg">
        <div className="space-y-4 p-8 glass-card rounded-2xl shadow-xl w-full max-w-md text-center">
          <Skeleton className="h-12 w-1/2 mx-auto bg-slate-700" />
          <Skeleton className="h-8 w-3/4 mx-auto bg-slate-700" />
          <Skeleton className="h-32 w-full mx-auto bg-slate-700 mt-4" />
           <p className="text-slate-300 mt-4">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <Route {...rest} component={(props) =>
      user ? <Component {...props} /> : <Redirect to="/auth" />
    } />
  );
};

export default ProtectedRoute;
