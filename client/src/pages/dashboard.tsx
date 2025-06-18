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
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="h-16 bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/50 flex items-center justify-between px-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-slate-400 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold text-slate-200">Property Search & Analysis</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input
                type="search"
                placeholder="Quick search..."
                className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400 w-64 pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <PropertySearchForm 
              onPropertySelect={handlePropertySelect}
              onLoadingChange={handleLoadingChange}
            />
            
            {isLoading && (
              <div className="card-bg border border-slate-700/50 rounded-2xl p-8 mb-8">
                <div className="flex items-center justify-center space-x-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-slate-200">Enriching Property Data...</p>
                    <p className="text-slate-400 text-sm mt-1">Fetching property details, comps, and market analysis</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="bg-slate-700/30 rounded-full h-2">
                    <div className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full pulse-slow" style={{width: "65%"}}></div>
                  </div>
                </div>
              </div>
            )}

            {selectedProperty && !isLoading && (
              <PropertyDashboard property={selectedProperty} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
