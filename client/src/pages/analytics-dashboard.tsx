import { useState, useEffect, useCallback } from "react";
// useQuery is not directly used here for fetching property list, AIAnalysisComponent handles it.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Used for status indicators if any
// Progress is used within AIAnalysisComponent, not directly here unless for other dashboard items.
import { useLocation } from "wouter";
import Sidebar from "@/components/sidebar";
import NavigationBar from "@/components/navigation-bar";
import AIAnalysisComponent, { AnalyzedProperty } from "@/components/ai-analysis"; // Renamed import
import { PropertyWithDetails } from "@shared/schema"; // For initial state type
import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  Target,
  // Calendar, // Not used directly
  MapPin,
  BarChart3,
  // PieChart, // Not used directly
  Activity,
  // Clock, // Not used directly
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Eye,
  // Phone, // Not used directly
  // Mail, // Not used directly
  ArrowLeft,
  Menu,
  ImageIcon, // For image placeholder
  Building // For property type icon
} from "lucide-react";

// Define the structure for the full analysis response, matching AIAnalysisComponent
interface FullAnalysisData {
  aiAnalysis: any; // Replace 'any' with the actual AIAnalysisResult type if defined elsewhere
  property: AnalyzedProperty;
  dataSource: string;
  externalImageURL?: string;
}


// Keep mock data for other parts of the dashboard, but featuredProperty will be dynamic
const mockDashboardData = {
  overview: { /* ... existing overview data ... */
    totalLeads: 1247,
    activeProperties: 89,
    dealsPending: 23,
    monthlyRevenue: 284750,
    conversionRate: 18.5,
    avgDealSize: 47800
  },
  // Remove featuredProperty from here, it will come from state
  recentActivity: [ /* ... existing recentActivity data ... */
  { id: 1, type: "lead", address: "1234 Oak Street", status: "qualified", time: "2 hours ago", priority: "high" },
    { id: 2, type: "deal", address: "5678 Pine Avenue", status: "contract", time: "4 hours ago", priority: "medium" },
    { id: 3, type: "contact", address: "9012 Elm Drive", status: "contacted", time: "6 hours ago", priority: "low" },
    { id: 4, type: "analysis", address: "3456 Maple Lane", status: "analyzed", time: "8 hours ago", priority: "medium" }
  ],
  marketTrends: {
    priceAppreciation: 12.3, // ... existing marketTrends data ...
    daysOnMarket: 28,
    inventoryLevel: 2.8,
    demandIndex: 87
  },
  topMarkets: [ /* ... existing topMarkets data ... */
    { city: "Los Angeles", deals: 45, roi: 23.5, trend: "up" },
    { city: "San Diego", deals: 32, roi: 19.8, trend: "up" },
    { city: "Orange County", deals: 28, roi: 21.2, trend: "down" },
    { city: "Riverside", deals: 15, roi: 18.7, trend: "up" }
  ],
  pipeline: [ /* ... existing pipeline data ... */
    { stage: "Leads", count: 156, value: 7450000 },
    { stage: "Qualified", count: 89, value: 4250000 },
    { stage: "Analysis", count: 34, value: 1620000 },
    { stage: "Contract", count: 12, value: 574000 }
  ]
};

// Helper for formatting currency, could be moved to utils.ts if not already there
const formatCurrencyCompact = (amount: number | string | null | undefined): string => {
  if (amount === null || amount === undefined) return "N/A";
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "N/A";
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(numAmount);
};

const formatNumberCompact = (num: number | null | undefined): string => {
  if (num === null || num === undefined) return "N/A";
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
};


export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [, setLocation] = useLocation(); // setLocation is used

  // State to hold the dynamically fetched featured property data
  const [featuredProperty, setFeaturedProperty] = useState<AnalyzedProperty | null>(null);
  const [dataSource, setDataSource] = useState<string>("local"); // To show where data came from

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const handleAnalysisComplete = useCallback((data: FullAnalysisData) => {
    setFeaturedProperty(data.property);
    setDataSource(data.dataSource);
    // The AIAnalysisComponent will display the aiAnalysis part,
    // this component will display the property part in "Featured Property Analysis"
  }, []);


  // Use a placeholder if featuredProperty is null
  const displayProperty = featuredProperty || {
    address: "N/A", city: "", state: "", zipCode: "", // Basic structure for PropertyWithDetails
    beds: undefined, baths: undefined, sqft: undefined, yearBuilt: undefined,
    propertyType: "N/A", lotSize: "N/A", listPrice: undefined,
    externalImageURL: undefined, // Ensure this is part of the type or handle it
    // Add other fields from PropertyWithDetails with default/N/A values
    id: 0, // Dummy ID
    comparables: [], // Default empty array
    marketMetrics: null, // Default null
    // Mocked fields that were originally in mockDashboardData.featuredProperty
    // These would ideally come from the 'property' object in AnalysisApiResponse
    county: "N/A",
    ownerOccupancy: "N/A",
    lastSaleDate: "N/A",
    lastSalePrice: undefined,
    mortgageBalance: undefined,
    taxDelinquency: "N/A",
    foreclosureStatus: "N/A",
    codeViolations: 0,
    vacancyStatus: "N/A",
    estimatedMarketValue: undefined, // This might be part of AI analysis or separate
    arvEstimate: undefined,
    rentalEstimate: undefined,
    estimatedEquity: undefined,
    avgDaysOnMarket: undefined,
    pricePerSqFt: undefined,
    appreciationTrend: "N/A",
    floodZone: "N/A",
    recentComps: [], // These should be part of PropertyWithDetails.comparables
    activeListings: [] // This data might need a different source or be part of a larger object
  } as AnalyzedProperty;


  return (
    <div className="min-h-screen gradient-bg">
      <NavigationBar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-16 relative z-10">
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
            <Button
              variant="ghost"
              onClick={() => setLocation("/")}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Property Search
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="modern-input bg-slate-800/50 text-slate-200 rounded-xl px-4 py-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <Button className="btn-primary-gradient">
              <Activity className="mr-2 h-4 w-4" />
              Live Data
            </Button>
          </div>
        </header>

        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gradient mb-4">Wholesaler Command Center</h1>
              <p className="text-slate-400 text-xl max-w-3xl mx-auto">
                Advanced analytics, market intelligence, and real-time insights for professional wholesalers
              </p>
            </div>

            {/* Featured Property Analysis */}
            <Card className="gradient-border-card shadow-lg overflow-hidden neon-glow">
              <CardHeader className="bg-gradient-to-r from-emerald-800/30 to-emerald-700/30 pb-6">
                <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                  Analyzed Property Details
                  <Badge variant="outline" className="border-slate-500 text-slate-300">Data Source: {dataSource}</Badge>
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <Target className="h-6 w-6 text-emerald-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Property Image */}
                {displayProperty.externalImageURL ? (
                  <img
                    src={displayProperty.externalImageURL}
                    alt="Property"
                    className="w-full h-64 object-cover rounded-xl mb-6 shadow-lg neon-glow-image"
                  />
                ) : (
                  <div className="w-full h-64 bg-slate-700/30 rounded-xl mb-6 flex items-center justify-center shadow-lg">
                    <ImageIcon className="h-16 w-16 text-slate-500" />
                    <p className="ml-2 text-slate-500">No Image Available</p>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* Location & Property Basics */}
                  <div className="floating-card rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <MapPin className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Location & Property Basics</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Full Address</p>
                        <p className="text-slate-200 font-medium">{displayProperty.address}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">County</p>
                        <p className="text-slate-200">{displayProperty.county || "N/A"}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm">Beds/Baths</p>
                          <p className="text-slate-200">{displayProperty.beds ?? 'N/A'} / {displayProperty.baths ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Year Built</p>
                          <p className="text-slate-200">{displayProperty.yearBuilt ?? 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Square Footage</p>
                        <p className="text-slate-200">{displayProperty.sqft ? `${displayProperty.sqft.toLocaleString()} sq ft` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Lot Size</p>
                        <p className="text-slate-200">{displayProperty.lotSize || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Property Type</p>
                        <p className="text-slate-200">{displayProperty.propertyType || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Motivation & Distress Indicators */}
                  <div className="glass-card-enhanced rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Zap className="h-5 w-5 text-amber-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Motivation & Distress</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Owner Occupancy</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{displayProperty.ownerOccupancy || "N/A"}</p>
                          {/* Motivation badge could be dynamic based on data */}
                          <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">High Motivation</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Last Sale</p>
                        <p className="text-slate-200">{displayProperty.lastSaleDate || "N/A"} - {formatCurrencyCompact(displayProperty.lastSalePrice)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Mortgage Balance</p>
                        <p className="text-slate-200">{formatCurrencyCompact(displayProperty.mortgageBalance)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Tax Status</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{displayProperty.taxDelinquency || "N/A"}</p>
                           {/* Tax status badge could be dynamic */}
                          <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Good</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Foreclosure Status</p>
                        <p className="text-slate-200">{displayProperty.foreclosureStatus || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Code Violations</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{displayProperty.codeViolations ?? 0} violations</p>
                          {/* Alert badge could be dynamic */}
                          <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Alert</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Vacancy Status</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{displayProperty.vacancyStatus || "N/A"}</p>
                          <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">Opportunity</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Valuation & Deal Analysis */}
                  <div className="holographic-card rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <DollarSign className="h-5 w-5 text-emerald-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Valuation & Deal Analysis</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Estimated Market Value (AVM)</p>
                        <p className="text-2xl font-bold text-gradient">{formatCurrencyCompact(displayProperty.estimatedMarketValue)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">ARV (After Repair Value)</p>
                        <p className="text-xl font-semibold text-emerald-400">{formatCurrencyCompact(displayProperty.arvEstimate)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Rental Estimate</p>
                        <p className="text-slate-200">{formatCurrencyCompact(displayProperty.rentalEstimate)}/month</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Estimated Equity</p>
                        <p className="text-xl font-semibold text-blue-400">{formatCurrencyCompact(displayProperty.estimatedEquity)}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-600">
                        <p className="text-slate-400 text-sm">Deal Potential</p>
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full font-semibold">Strong Deal</span>
                          <span className="ml-2 text-emerald-400 text-sm">56% equity</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Data for Dispo */}
                  <div className="floating-card rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Market Data for Dispo</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-slate-400 text-sm">Avg Days on Market</p>
                        <p className="text-slate-200">{displayProperty.avgDaysOnMarket ?? 'N/A'} days</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Price per Sq Ft</p>
                        <p className="text-slate-200">{displayProperty.pricePerSqFt ? `$${displayProperty.pricePerSqFt}/sq ft` : 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Appreciation Trend</p>
                        <div className="flex items-center">
                          <p className="text-emerald-400 font-semibold">{displayProperty.appreciationTrend || "N/A"}</p>
                          <ArrowUpRight className="h-4 w-4 text-emerald-400 ml-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Flood Zone</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{displayProperty.floodZone || "N/A"}</p>
                          <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Safe</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comparable Sales & Active Listings */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                  {/* Recent Sold Comps */}
                  <div className="glass-card-enhanced rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Recent Sold Comps</h3>
                    </div>
                    <div className="space-y-3">
                      {(displayProperty.comparables && displayProperty.comparables.length > 0 ? displayProperty.comparables : displayProperty.recentComps || []).map((comp: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-700/20 rounded-xl">
                          <div>
                            <p className="text-slate-200 font-medium">{comp.address}</p>
                            <p className="text-slate-400 text-sm">{comp.distance || 'N/A mi'} • {comp.sqft ? comp.sqft.toLocaleString() : 'N/A'} sq ft</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-200 font-semibold">{formatCurrencyCompact(comp.salePrice || comp.price)}</p>
                            <p className="text-slate-400 text-sm">{comp.dom || 'N/A'} DOM</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Active Competition */}
                  <div className="holographic-card rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Eye className="h-5 w-5 text-amber-400 mr-2" />
                      <h3 className="text-lg font-semibold text-slate-200">Active Competition</h3>
                    </div>
                    <div className="space-y-3">
                      {(displayProperty.activeListings || []).map((listing: any, index: number) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-700/20 rounded-xl">
                          <div>
                            <p className="text-slate-200 font-medium">{listing.address}</p>
                            <p className="text-slate-400 text-sm">{listing.distance || 'N/A mi'} • {listing.sqft ? listing.sqft.toLocaleString() : 'N/A'} sq ft</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-200 font-semibold">{formatCurrencyCompact(listing.price)}</p>
                            <p className="text-slate-400 text-sm">{listing.dom || 'N/A'} DOM</p>
                          </div>
                        </div>
                      ))}
                      <div className="pt-2 border-t border-slate-600">
                        <p className="text-slate-400 text-sm">Market Position</p>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full">Below Market</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Property Analysis */}
            <AIAnalysisComponent onAnalysisComplete={handleAnalysisComplete} />

            {/* Key Metrics Grid - This part remains using mockDashboardData.overview for now */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {/* Example Card, repeat for others like activeProperties, dealsPending etc. */}
              <Card className="floating-card rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Leads</p>
                      <p className="text-3xl font-bold text-gradient mt-1">{formatNumberCompact(mockDashboardData.overview.totalLeads)}</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Users className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-sm font-medium">+12.5%</span>
                    <span className="text-slate-400 text-sm ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
               <Card className="glass-card-enhanced rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Active Properties</p>
                      <p className="text-3xl font-bold text-gradient mt-1">{mockDashboardData.overview.activeProperties}</p>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <Home className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-sm font-medium">+8.3%</span>
                    <span className="text-slate-400 text-sm ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
               <Card className="holographic-card rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Deals Pending</p>
                      <p className="text-3xl font-bold text-gradient mt-1">{mockDashboardData.overview.dealsPending}</p>
                    </div>
                    <div className="p-3 bg-amber-500/20 rounded-xl">
                      <Target className="h-6 w-6 text-amber-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowDownRight className="h-4 w-4 text-red-400 mr-1" />
                    <span className="text-red-400 text-sm font-medium">-3.2%</span>
                    <span className="text-slate-400 text-sm ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
               <Card className="floating-card rounded-2xl overflow-hidden neon-glow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Monthly Revenue</p>
                      <p className="text-3xl font-bold text-gradient mt-1">{formatCurrencyCompact(mockDashboardData.overview.monthlyRevenue)}</p>
                    </div>
                    <div className="p-3 bg-purple-500/20 rounded-xl">
                      <DollarSign className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-sm font-medium">+24.1%</span>
                    <span className="text-slate-400 text-sm ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card-enhanced rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Conversion Rate</p>
                      <p className="text-3xl font-bold text-gradient mt-1">{mockDashboardData.overview.conversionRate}%</p>
                    </div>
                    <div className="p-3 bg-emerald-500/20 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-sm font-medium">+5.7%</span>
                    <span className="text-slate-400 text-sm ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="holographic-card rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Avg Deal Size</p>
                      <p className="text-3xl font-bold text-gradient mt-1">{formatCurrencyCompact(mockDashboardData.overview.avgDealSize)}</p>
                    </div>
                    <div className="p-3 bg-blue-500/20 rounded-xl">
                      <Star className="h-6 w-6 text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-sm font-medium">+11.2%</span>
                    <span className="text-slate-400 text-sm ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
              {/* ... other overview cards ... */}
            </div>

            {/* Main Content Grid - These parts also remain using mockDashboardData for now */}
            {/* Deal Pipeline, Recent Activity, Market Intelligence, Top Markets */}
            {/* Example: Deal Pipeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 gradient-border-card shadow-2xl overflow-hidden neon-glow">
                <CardHeader className="bg-gradient-to-r from-blue-800/30 to-blue-700/30 pb-6">
                  <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                    Deal Pipeline Analysis
                    <div className="p-2 bg-blue-500/20 rounded-xl">
                      <BarChart3 className="h-6 w-6 text-blue-400" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {mockDashboardData.pipeline.map((stage) => (
                      <div key={stage.stage} className="floating-card rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="text-slate-200 font-semibold text-lg">{stage.stage}</h4>
                            <p className="text-slate-400 text-sm">{stage.count} properties</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-gradient">{formatCurrencyCompact(stage.value)}</p>
                            <p className="text-slate-400 text-sm">total value</p>
                          </div>
                        </div>
                        {/* Progress component would need to be imported if not already */}
                        {/* <Progress value={((stage.count / mockDashboardData.pipeline[0].count) * 100)} className="h-3 bg-slate-700/30" /> */}
                        <div className="mt-2 flex justify-between text-xs text-slate-400">
                          <span>{((stage.count / mockDashboardData.pipeline[0].count) * 100).toFixed(1)}% of total leads</span>
                          <span>Avg: {formatCurrencyCompact(stage.value / stage.count)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* ... Other sections like Recent Activity, Market Trends, Top Markets using mock data ... */}
               <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-800/30 to-purple-700/30 pb-6">
                  <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
                    Recent Activity
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Activity className="h-5 w-5 text-purple-400" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockDashboardData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 rounded-xl hover:bg-slate-700/20 transition-colors">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'lead' ? 'bg-blue-500/20 text-blue-400' :
                          activity.type === 'deal' ? 'bg-emerald-500/20 text-emerald-400' :
                          activity.type === 'contact' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {activity.type === 'lead' && <Users className="h-4 w-4" />}
                          {activity.type === 'deal' && <Target className="h-4 w-4" />}
                          {activity.type === 'contact' && <Users className="h-4 w-4" />} {/* Changed icon for contact */}
                          {activity.type === 'analysis' && <Eye className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 font-medium truncate">{activity.address}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={`text-xs ${
                              activity.status === 'qualified' ? 'status-active' :
                              activity.status === 'contract' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                              activity.status === 'contacted' ? 'status-pending' :
                              'status-inactive'
                            }`}>
                              {activity.status}
                            </Badge>
                            <span className="text-slate-400 text-xs">{activity.time}</span>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          activity.priority === 'high' ? 'bg-red-400' :
                          activity.priority === 'medium' ? 'bg-amber-400' :
                          'bg-slate-400'
                        }`} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-emerald-800/30 to-emerald-700/30 pb-6">
                  <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                    Market Intelligence
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="glass-card rounded-2xl p-5 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">+{mockDashboardData.marketTrends.priceAppreciation}%</div>
                      <div className="text-slate-400 text-sm">Price Appreciation</div>
                      <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                        Above Average
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-5 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">{mockDashboardData.marketTrends.daysOnMarket}</div>
                      <div className="text-slate-400 text-sm">Avg Days on Market</div>
                      <div className="mt-2 text-xs text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                        Fast Market
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-5 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">{mockDashboardData.marketTrends.inventoryLevel}</div>
                      <div className="text-slate-400 text-sm">Months Inventory</div>
                      <div className="mt-2 text-xs text-amber-400 bg-amber-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                        Low Supply
                      </div>
                    </div>
                    <div className="glass-card rounded-2xl p-5 text-center">
                      <div className="text-3xl font-bold text-gradient mb-2">{mockDashboardData.marketTrends.demandIndex}</div>
                      <div className="text-slate-400 text-sm">Demand Index</div>
                      <div className="mt-2 text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full w-fit mx-auto">
                        High Demand
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-purple-800/30 to-purple-700/30 pb-6">
                  <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
                    Top Markets
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <MapPin className="h-6 w-6 text-purple-400" />
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockDashboardData.topMarkets.map((market, index) => (
                      <div key={market.city} className="flex items-center justify-between p-4 glass-card rounded-2xl hover:scale-105 transition-transform duration-300">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-slate-200 font-semibold">{market.city}</p>
                            <p className="text-slate-400 text-sm">{market.deals} active deals</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gradient">{market.roi}%</span>
                            {market.trend === 'up' ? (
                              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-400" />
                            )}
                          </div>
                          <p className="text-slate-400 text-xs">ROI</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}