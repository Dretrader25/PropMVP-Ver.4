import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import NavigationBar from "@/components/navigation-bar";
import PropertySearchForm from "@/components/property-search-form";
import PropertyDashboard from "@/components/property-dashboard";
import PropertyHeatmap from "@/components/property-heatmap";
import WorkflowProgress from "@/components/workflow-progress";
import CollapsibleSection from "@/components/collapsible-section";
import { PropertyWithDetails } from "@shared/schema";
import { 
  Search, 
  Menu, 
  X, 
  BarChart3, 
  Zap, 
  Calculator,
  Target,
  Home,
  DollarSign,
  TrendingUp,
  Eye,
  FileText,
  Download,
  RefreshCw,
  MapPin,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [workflowVisible, setWorkflowVisible] = useState(false);
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // ARV and Deal Analysis state
  const [arvEstimate, setArvEstimate] = useState(0);
  const [repairCosts, setRepairCosts] = useState(0);
  const [wholesaleFee, setWholesaleFee] = useState(10000);
  const [calculatedMAO, setCalculatedMAO] = useState(0);

  // Calculate MAO when inputs change
  useEffect(() => {
    if (arvEstimate > 0) {
      const mao = (arvEstimate * 0.7) - repairCosts - wholesaleFee;
      setCalculatedMAO(Math.max(0, mao));
    }
  }, [arvEstimate, repairCosts, wholesaleFee]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

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
      {/* Navigation Bar */}
      <NavigationBar onMenuClick={() => setSidebarOpen(true)} />
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-16 relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto space-y-8 p-8">
          
          {/* Workflow Progress Assistant */}
          <div className="fade-in">
            <WorkflowProgress 
              currentStep="property"
              marketResearched={true}
              propertySearched={selectedProperty !== null}
              propertyAnalyzed={arvEstimate > 0 && repairCosts > 0}
              leadAdded={false}
              isVisible={workflowVisible}
              onToggle={setWorkflowVisible}
            />
          </div>
          
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gradient mb-4">Assess the Property & Deal</h1>
            <p className="text-slate-400 text-xl max-w-4xl mx-auto">
              Step 2 of Wholesaling: Evaluate ARV, estimate repair costs, and calculate your Maximum Allowable Offer (MAO) to ensure deal viability.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" className="glass-card">
                <Calculator className="h-4 w-4 mr-2" />
                ARV Calculator
              </Button>
              <Button variant="outline" className="glass-card">
                <Home className="h-4 w-4 mr-2" />
                Repair Estimator
              </Button>
              <Button variant="outline" className="glass-card">
                <Target className="h-4 w-4 mr-2" />
                MAO Calculator
              </Button>
              <Button variant="outline" className="glass-card">
                <Download className="h-4 w-4 mr-2" />
                Deal Analysis Report
              </Button>
            </div>
          </div>

          {/* Property Search */}
          <CollapsibleSection
            title="Property Search & Selection"
            description="Search and select a property to analyze for wholesaling potential"
            icon={Search}
            defaultExpanded={!selectedProperty}
          >
            <PropertySearchForm 
              onPropertySelect={handlePropertySelect} 
              onLoadingChange={handleLoadingChange}
            />
          </CollapsibleSection>

          {/* ARV Analysis & Comparables */}
          {selectedProperty && (
            <CollapsibleSection
              title="ARV Analysis & Comparable Sales"
              description="Determine After-Repair Value using recent comparable sales within 0.5-1 mile radius"
              icon={TrendingUp}
              defaultExpanded={true}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                
                {/* ARV Calculator */}
                <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-emerald-800/30 to-emerald-700/30 pb-6">
                    <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                      ARV Calculator
                      <div className="p-2 bg-emerald-500/20 rounded-xl">
                        <Calculator className="h-6 w-6 text-emerald-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="glass-card rounded-2xl p-4">
                        <label className="text-slate-200 font-medium mb-2 block">Current ARV Estimate</label>
                        <Input 
                          type="number"
                          placeholder="Enter ARV estimate"
                          value={arvEstimate || ''}
                          onChange={(e) => setArvEstimate(Number(e.target.value))}
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                        <p className="text-xs text-slate-400 mt-1">Based on comparable sales within 1 mile radius</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-400 mb-2">
                          ${arvEstimate.toLocaleString()}
                        </div>
                        <div className="text-slate-400">Estimated ARV</div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="glass-card rounded-xl p-3">
                          <div className="text-slate-400">Comps Analyzed</div>
                          <div className="text-slate-200 font-bold">8 Properties</div>
                        </div>
                        <div className="glass-card rounded-xl p-3">
                          <div className="text-slate-400">Avg Days on Market</div>
                          <div className="text-slate-200 font-bold">22 Days</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Comparable Sales */}
                <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-800/30 to-blue-700/30 pb-6">
                    <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                      Recent Comparables
                      <div className="p-2 bg-blue-500/20 rounded-xl">
                        <Home className="h-6 w-6 text-blue-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        { address: "1234 Oak St", price: 485000, sqft: 1850, distance: 0.3, days: 18 },
                        { address: "5678 Pine Ave", price: 495000, sqft: 1920, distance: 0.6, days: 25 },
                        { address: "9012 Elm Dr", price: 475000, sqft: 1780, distance: 0.8, days: 31 }
                      ].map((comp, index) => (
                        <div key={index} className="glass-card rounded-xl p-3">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-slate-200 font-medium">{comp.address}</div>
                              <div className="text-xs text-slate-400">{comp.distance} miles • {comp.days} days ago</div>
                            </div>
                            <div className="text-right">
                              <div className="text-emerald-400 font-bold">${comp.price.toLocaleString()}</div>
                              <div className="text-xs text-slate-400">{comp.sqft} sqft</div>
                            </div>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Price/sqft: ${Math.round(comp.price / comp.sqft)}</span>
                            <Badge variant="outline" className="text-xs">Similar condition</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Comparables
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleSection>
          )}

          {/* Repair Cost Estimation */}
          {selectedProperty && (
            <CollapsibleSection
              title="Repair Cost Estimation"
              description="Estimate repair costs using property condition assessment and contractor input"
              icon={Home}
              defaultExpanded={true}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* Repair Calculator */}
                <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-amber-800/30 to-amber-700/30 pb-6">
                    <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                      Repair Calculator
                      <div className="p-2 bg-amber-500/20 rounded-xl">
                        <Calculator className="h-5 w-5 text-amber-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="glass-card rounded-2xl p-4">
                        <label className="text-slate-200 font-medium mb-2 block">Total Repair Estimate</label>
                        <Input 
                          type="number"
                          placeholder="Enter repair costs"
                          value={repairCosts || ''}
                          onChange={(e) => setRepairCosts(Number(e.target.value))}
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-3xl font-bold text-amber-400 mb-2">
                          ${repairCosts.toLocaleString()}
                        </div>
                        <div className="text-slate-400">Estimated Repairs</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Repair Categories */}
                <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-red-800/30 to-red-700/30 pb-6">
                    <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                      Repair Categories
                      <div className="p-2 bg-red-500/20 rounded-xl">
                        <FileText className="h-5 w-5 text-red-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {[
                        { category: "Roof", cost: 8500, priority: "High" },
                        { category: "HVAC", cost: 4200, priority: "Medium" },
                        { category: "Kitchen", cost: 12000, priority: "High" },
                        { category: "Bathrooms", cost: 6500, priority: "Medium" },
                        { category: "Flooring", cost: 5800, priority: "Medium" },
                        { category: "Paint/Cosmetic", cost: 3000, priority: "Low" }
                      ].map((item, index) => (
                        <div key={index} className="flex justify-between items-center glass-card rounded-xl p-3">
                          <div>
                            <span className="text-slate-200">{item.category}</span>
                            <Badge 
                              variant="outline" 
                              className={`ml-2 text-xs ${
                                item.priority === 'High' ? 'border-red-400 text-red-400' :
                                item.priority === 'Medium' ? 'border-yellow-400 text-yellow-400' :
                                'border-green-400 text-green-400'
                              }`}
                            >
                              {item.priority}
                            </Badge>
                          </div>
                          <span className="text-amber-400 font-medium">${item.cost.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Contractor Input */}
                <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-purple-800/30 to-purple-700/30 pb-6">
                    <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                      Contractor Quotes
                      <div className="p-2 bg-purple-500/20 rounded-xl">
                        <DollarSign className="h-5 w-5 text-purple-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="glass-card rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-200 font-medium">ABC Contractors</span>
                          <span className="text-emerald-400">$38,500</span>
                        </div>
                        <div className="text-xs text-slate-400">Full renovation • 6-8 weeks</div>
                      </div>
                      <div className="glass-card rounded-xl p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-200 font-medium">Quality Home Builders</span>
                          <span className="text-amber-400">$42,200</span>
                        </div>
                        <div className="text-xs text-slate-400">Premium materials • 8-10 weeks</div>
                      </div>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Request New Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleSection>
          )}

          {/* MAO Calculator & Deal Analysis */}
          {selectedProperty && (
            <CollapsibleSection
              title="Maximum Allowable Offer (MAO) Calculator"
              description="Calculate your maximum offer using the 70% rule: MAO = (ARV × 0.7) - Repair Costs - Wholesale Fee"
              icon={Target}
              defaultExpanded={true}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* MAO Calculator */}
                <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-indigo-800/30 to-indigo-700/30 pb-6">
                    <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                      MAO Calculator
                      <div className="p-2 bg-indigo-500/20 rounded-xl">
                        <Target className="h-6 w-6 text-indigo-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      
                      {/* Wholesale Fee Input */}
                      <div className="glass-card rounded-2xl p-4">
                        <label className="text-slate-200 font-medium mb-2 block">Wholesale Fee</label>
                        <Input 
                          type="number"
                          placeholder="Enter wholesale fee"
                          value={wholesaleFee || ''}
                          onChange={(e) => setWholesaleFee(Number(e.target.value))}
                          className="bg-slate-800/50 border-slate-600 text-slate-100"
                        />
                      </div>

                      {/* Calculation Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">ARV × 70%</span>
                          <span className="text-slate-200">${(arvEstimate * 0.7).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">- Repair Costs</span>
                          <span className="text-red-400">-${repairCosts.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">- Wholesale Fee</span>
                          <span className="text-red-400">-${wholesaleFee.toLocaleString()}</span>
                        </div>
                        <div className="border-t border-slate-600 pt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-200 font-bold text-lg">Maximum Allowable Offer</span>
                            <span className="text-emerald-400 font-bold text-2xl">${calculatedMAO.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Deal Analysis Summary */}
                <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-800/30 to-green-700/30 pb-6">
                    <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                      Deal Analysis
                      <div className="p-2 bg-green-500/20 rounded-xl">
                        <BarChart3 className="h-6 w-6 text-green-400" />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      
                      {/* Deal Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-emerald-400">
                            {arvEstimate > 0 ? `${Math.round(((calculatedMAO + repairCosts + wholesaleFee) / arvEstimate) * 100)}%` : '0%'}
                          </div>
                          <div className="text-slate-400 text-sm">ARV Percentage</div>
                        </div>
                        <div className="glass-card rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-blue-400">
                            ${wholesaleFee.toLocaleString()}
                          </div>
                          <div className="text-slate-400 text-sm">Projected Profit</div>
                        </div>
                      </div>

                      {/* Deal Quality Assessment */}
                      <div className="glass-card rounded-xl p-4">
                        <h4 className="text-slate-200 font-semibold mb-3">Deal Quality</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Profit Margin</span>
                            <Badge className={`${wholesaleFee >= 10000 ? 'bg-green-500' : wholesaleFee >= 5000 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                              {wholesaleFee >= 10000 ? 'Excellent' : wholesaleFee >= 5000 ? 'Good' : 'Poor'}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Market Competitiveness</span>
                            <Badge className="bg-blue-500">Strong</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Risk Level</span>
                            <Badge className="bg-yellow-500">Medium</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button className="w-full bg-green-500 hover:bg-green-600">
                          <Target className="h-4 w-4 mr-2" />
                          Submit Offer: ${calculatedMAO.toLocaleString()}
                        </Button>
                        <Button variant="outline" className="w-full glass-card">
                          <Download className="h-4 w-4 mr-2" />
                          Export Deal Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CollapsibleSection>
          )}

          {/* Welcome Message when no property selected */}
          {!selectedProperty && !isLoading && (
            <div className="text-center text-slate-400 text-lg">
              <div className="glass-card rounded-3xl p-10">
                <h2 className="text-3xl font-bold text-gradient mb-4">Property Assessment Tools</h2>
                <p className="max-w-2xl mx-auto mb-6">
                  Search for a property above to begin your deal analysis. Our tools will help you calculate ARV, estimate repairs, and determine your Maximum Allowable Offer using industry-standard wholesaling formulas.
                </p>
                <div className="flex justify-center gap-4">
                  <div className="glass-card rounded-2xl p-4 text-center">
                    <Calculator className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                    <h3 className="text-slate-200 font-semibold">ARV Analysis</h3>
                    <p className="text-sm text-slate-400">Comparable sales research</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4 text-center">
                    <Home className="h-8 w-8 text-amber-400 mx-auto mb-2" />
                    <h3 className="text-slate-200 font-semibold">Repair Estimation</h3>
                    <p className="text-sm text-slate-400">Contractor quotes & categories</p>
                  </div>
                  <div className="glass-card rounded-2xl p-4 text-center">
                    <Target className="h-8 w-8 text-indigo-400 mx-auto mb-2" />
                    <h3 className="text-slate-200 font-semibold">MAO Calculator</h3>
                    <p className="text-sm text-slate-400">70% rule implementation</p>
                  </div>
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
  );
}
