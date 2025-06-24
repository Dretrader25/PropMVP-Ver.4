import { useState, useEffect } from 'react';
import SignUpForm from '@/components/SignUpForm';
import LoginForm from '@/components/LoginForm';
import { Button } from '@/components/ui/button';
import NavigationBar from '@/components/navigation-bar'; // Optional: if you want nav bar on auth page
// import Sidebar from '@/components/sidebar'; // Optional

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  // const [sidebarOpen, setSidebarOpen] = useState(false); // Optional

  useEffect(() => {
    // Ensure dark theme is applied if it's global
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4">
      {/* Optional NavigationBar if you want it on the auth screen */}
      {/* <NavigationBar onMenuClick={() => setSidebarOpen(true)} /> */}
      {/* <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} /> */}

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            {/* You can add a logo here if you have one */}
            {/* <img src="/path-to-your-logo.svg" alt="PropAnalyzed" className="mx-auto h-12 w-auto" /> */}
             <h1 className="text-5xl font-bold text-gradient mt-4">PropAnalyzed</h1>
             <p className="text-slate-300 mt-2 text-lg">Your Real Estate Analysis Powerhouse</p>
        </div>

        {isLoginView ? <LoginForm /> : <SignUpForm />}

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => setIsLoginView(!isLoginView)}
            className="text-slate-300 hover:text-white transition-colors"
          >
            {isLoginView ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Button>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center w-full text-slate-500 text-sm">
        © {new Date().getFullYear()} PropAnalyzed. All rights reserved.
      </footer>
    </div>
  );
}
