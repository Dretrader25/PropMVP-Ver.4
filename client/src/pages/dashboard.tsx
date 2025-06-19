import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import PropertySearchForm from "@/components/property-search-form";
import PropertyDashboard from "@/components/property-dashboard";
import { PropertyWithDetails } from "@shared/schema";
import { Search, Menu, X, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useLocation();

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
              <h1 className="text-xl font-bold text-gradient">PropAnalyzed Analytics</h1>
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

            {/* Analytics Dashboard CTA */}
            {!selectedProperty && !isLoading && (
              <div className="glass-card rounded-3xl p-8 border border-blue-500/20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                <div className="flex flex-col lg:flex-row items-center justify-between">
                  <div className="flex-1 mb-6 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl float-animation">
                        <BarChart3 className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gradient">Wholesaler Command Center</h3>
                        <p className="text-slate-400">Advanced analytics and market intelligence</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-slate-300 text-sm">Deal pipeline tracking</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-300 text-sm">Market trend analysis</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-slate-300 text-sm">Lead performance metrics</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <Button
                      onClick={() => setLocation("/analytics")}
                      className="btn-primary-gradient text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      <Zap className="mr-3 h-5 w-5" />
                      Launch Analytics Dashboard
                    </Button>
                    <p className="text-xs text-slate-400 text-center">Real-time insights for wholesalers</p>
                  </div>
                </div>
              </div>
            )}
            
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
