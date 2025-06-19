import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import PropertySearchForm from "@/components/property-search-form";
import PropertyDashboard from "@/components/property-dashboard";
import { PropertyWithDetails } from "@shared/schema";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Apply dark theme on mount
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handlePropertySelect = (property: PropertyWithDetails) => {
    setSelectedProperty(property);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        {/* Modern top bar */}
        <header className="h-18 glass-card border-b border-slate-700/30 flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gradient">PropTrace Analytics</h1>
              <p className="text-xs text-slate-400 mt-0.5">Professional Property Intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Input
                type="search"
                placeholder="Quick search properties..."
                className="modern-input text-slate-200 placeholder-slate-400 w-72 pl-10 h-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center float-animation">
              <span className="text-white text-sm font-bold">JD</span>
            </div>
          </div>
        </header>

        {/* Enhanced content area */}
        <div className="p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="fade-in">
              <PropertySearchForm 
                onPropertySelect={handlePropertySelect}
                onLoadingChange={handleLoadingChange}
              />
            </div>
            
            {isLoading && (
              <div className="glass-card rounded-3xl p-10 mb-8 slide-up">
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-transparent border-t-blue-500 border-r-emerald-500"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-slate-700/20"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-100 mb-2">Enriching Property Data</h3>
                    <p className="text-slate-400 max-w-md">Analyzing property details, market comparables, and neighborhood insights</p>
                  </div>
                  <div className="w-full max-w-md">
                    <div className="bg-slate-700/20 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full pulse-slow animate-pulse" style={{width: "75%"}}></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>Property Details</span>
                      <span>Market Analysis</span>
                      <span>Comparables</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedProperty && !isLoading && (
              <div className="slide-up">
                <PropertyDashboard property={selectedProperty} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
