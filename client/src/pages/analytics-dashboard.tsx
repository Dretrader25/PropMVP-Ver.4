import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import Sidebar from "@/components/sidebar";
import AIAnalysis from "@/components/ai-analysis";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Home, 
  Users, 
  Target,
  Calendar,
  MapPin,
  BarChart3,
  PieChart,
  Activity,
  Clock,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Eye,
  Phone,
  Mail,
  ArrowLeft,
  Menu
} from "lucide-react";

// Mock data for the dashboard - in a real app, this would come from APIs
const mockDashboardData = {
  overview: {
    totalLeads: 1247,
    activeProperties: 89,
    dealsPending: 23,
    monthlyRevenue: 284750,
    conversionRate: 18.5,
    avgDealSize: 47800
  },
  // Sample property for comprehensive analysis
  featuredProperty: {
    // Location & Property Basics
    fullAddress: "1234 Maple Street, Atlanta, GA 30309",
    county: "Fulton County",
    beds: 3,
    baths: 2,
    squareFootage: 1850,
    lotSize: "0.25 acres",
    yearBuilt: 1985,
    propertyType: "Single Family Home",
    
    // Motivation & Distress Indicators
    ownerOccupancy: "Absentee Owner",
    lastSaleDate: "2019-03-15",
    lastSalePrice: 145000,
    mortgageBalance: 98000,
    taxDelinquency: "Current",
    foreclosureStatus: "None",
    codeViolations: 2,
    vacancyStatus: "Likely Vacant",
    
    // Valuation & Deal Analysis
    estimatedMarketValue: 225000,
    arvEstimate: 275000,
    rentalEstimate: 1850,
    estimatedEquity: 127000,
    
    // Market Data for Dispo
    avgDaysOnMarket: 45,
    pricePerSqFt: 122,
    appreciationTrend: "+8.2%",
    floodZone: "No",
    
    // Comparable Sales
    recentComps: [
      { address: "1240 Maple St", price: 235000, distance: "0.1 mi", dom: 32, sqft: 1900 },
      { address: "1156 Oak Ave", price: 218000, distance: "0.3 mi", dom: 28, sqft: 1780 },
      { address: "1301 Pine Dr", price: 242000, distance: "0.2 mi", dom: 41, sqft: 1920 }
    ],
    
    // Active Competition
    activeListings: [
      { address: "1267 Maple St", price: 249000, distance: "0.2 mi", dom: 15, sqft: 1875 },
      { address: "1145 Elm St", price: 239000, distance: "0.4 mi", dom: 22, sqft: 1820 }
    ]
  },
  recentActivity: [
    { id: 1, type: "lead", address: "1234 Oak Street", status: "qualified", time: "2 hours ago", priority: "high" },
    { id: 2, type: "deal", address: "5678 Pine Avenue", status: "contract", time: "4 hours ago", priority: "medium" },
    { id: 3, type: "contact", address: "9012 Elm Drive", status: "contacted", time: "6 hours ago", priority: "low" },
    { id: 4, type: "analysis", address: "3456 Maple Lane", status: "analyzed", time: "8 hours ago", priority: "medium" }
  ],
  marketTrends: {
    priceAppreciation: 12.3,
    daysOnMarket: 28,
    inventoryLevel: 2.8,
    demandIndex: 87
  },
  topMarkets: [
    { city: "Los Angeles", deals: 45, roi: 23.5, trend: "up" },
    { city: "San Diego", deals: 32, roi: 19.8, trend: "up" },
    { city: "Orange County", deals: 28, roi: 21.2, trend: "down" },
    { city: "Riverside", deals: 15, roi: 18.7, trend: "up" }
  ],
  pipeline: [
    { stage: "Leads", count: 156, value: 7450000 },
    { stage: "Qualified", count: 89, value: 4250000 },
    { stage: "Analysis", count: 34, value: 1620000 },
    { stage: "Contract", count: 12, value: 574000 }
  ]
};

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("30d");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();

  // Apply dark theme
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(num);
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        {/* Top bar */}
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
                  Featured Property Analysis
                  <div className="p-2 bg-emerald-500/20 rounded-xl">
                    <Target className="h-6 w-6 text-emerald-400" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
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
                        <p className="text-slate-200 font-medium">{mockDashboardData.featuredProperty.fullAddress}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">County</p>
                        <p className="text-slate-200">{mockDashboardData.featuredProperty.county}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-slate-400 text-sm">Beds/Baths</p>
                          <p className="text-slate-200">{mockDashboardData.featuredProperty.beds}/{mockDashboardData.featuredProperty.baths}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-sm">Year Built</p>
                          <p className="text-slate-200">{mockDashboardData.featuredProperty.yearBuilt}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Square Footage</p>
                        <p className="text-slate-200">{mockDashboardData.featuredProperty.squareFootage.toLocaleString()} sq ft</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Lot Size</p>
                        <p className="text-slate-200">{mockDashboardData.featuredProperty.lotSize}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Property Type</p>
                        <p className="text-slate-200">{mockDashboardData.featuredProperty.propertyType}</p>
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
                          <p className="text-slate-200">{mockDashboardData.featuredProperty.ownerOccupancy}</p>
                          <span className="ml-2 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">High Motivation</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Last Sale</p>
                        <p className="text-slate-200">{mockDashboardData.featuredProperty.lastSaleDate} - {formatCurrency(mockDashboardData.featuredProperty.lastSalePrice)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Mortgage Balance</p>
                        <p className="text-slate-200">{formatCurrency(mockDashboardData.featuredProperty.mortgageBalance)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Tax Status</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{mockDashboardData.featuredProperty.taxDelinquency}</p>
                          <span className="ml-2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">Good</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Foreclosure Status</p>
                        <p className="text-slate-200">{mockDashboardData.featuredProperty.foreclosureStatus}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Code Violations</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{mockDashboardData.featuredProperty.codeViolations} violations</p>
                          <span className="ml-2 px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Alert</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Vacancy Status</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{mockDashboardData.featuredProperty.vacancyStatus}</p>
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
                        <p className="text-2xl font-bold text-gradient">{formatCurrency(mockDashboardData.featuredProperty.estimatedMarketValue)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">ARV (After Repair Value)</p>
                        <p className="text-xl font-semibold text-emerald-400">{formatCurrency(mockDashboardData.featuredProperty.arvEstimate)}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Rental Estimate</p>
                        <p className="text-slate-200">{formatCurrency(mockDashboardData.featuredProperty.rentalEstimate)}/month</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Estimated Equity</p>
                        <p className="text-xl font-semibold text-blue-400">{formatCurrency(mockDashboardData.featuredProperty.estimatedEquity)}</p>
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
                        <p className="text-slate-200">{mockDashboardData.featuredProperty.avgDaysOnMarket} days</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Price per Sq Ft</p>
                        <p className="text-slate-200">${mockDashboardData.featuredProperty.pricePerSqFt}/sq ft</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Appreciation Trend</p>
                        <div className="flex items-center">
                          <p className="text-emerald-400 font-semibold">{mockDashboardData.featuredProperty.appreciationTrend}</p>
                          <ArrowUpRight className="h-4 w-4 text-emerald-400 ml-1" />
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Flood Zone</p>
                        <div className="flex items-center">
                          <p className="text-slate-200">{mockDashboardData.featuredProperty.floodZone}</p>
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
                      {mockDashboardData.featuredProperty.recentComps.map((comp, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-700/20 rounded-xl">
                          <div>
                            <p className="text-slate-200 font-medium">{comp.address}</p>
                            <p className="text-slate-400 text-sm">{comp.distance} • {comp.sqft.toLocaleString()} sq ft</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-200 font-semibold">{formatCurrency(comp.price)}</p>
                            <p className="text-slate-400 text-sm">{comp.dom} DOM</p>
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
                      {mockDashboardData.featuredProperty.activeListings.map((listing, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-700/20 rounded-xl">
                          <div>
                            <p className="text-slate-200 font-medium">{listing.address}</p>
                            <p className="text-slate-400 text-sm">{listing.distance} • {listing.sqft.toLocaleString()} sq ft</p>
                          </div>
                          <div className="text-right">
                            <p className="text-slate-200 font-semibold">{formatCurrency(listing.price)}</p>
                            <p className="text-slate-400 text-sm">{listing.dom} DOM</p>
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
            <AIAnalysis />

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <Card className="floating-card rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">Total Leads</p>
                    <p className="text-3xl font-bold text-gradient mt-1">{formatNumber(mockDashboardData.overview.totalLeads)}</p>
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
                    <p className="text-3xl font-bold text-gradient mt-1">{formatCurrency(mockDashboardData.overview.monthlyRevenue)}</p>
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
                    <p className="text-3xl font-bold text-gradient mt-1">{formatCurrency(mockDashboardData.overview.avgDealSize)}</p>
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
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Deal Pipeline */}
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
                  {mockDashboardData.pipeline.map((stage, index) => (
                    <div key={stage.stage} className="floating-card rounded-2xl p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-slate-200 font-semibold text-lg">{stage.stage}</h4>
                          <p className="text-slate-400 text-sm">{stage.count} properties</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gradient">{formatCurrency(stage.value)}</p>
                          <p className="text-slate-400 text-sm">total value</p>
                        </div>
                      </div>
                      <Progress 
                        value={((stage.count / mockDashboardData.pipeline[0].count) * 100)} 
                        className="h-3 bg-slate-700/30"
                      />
                      <div className="mt-2 flex justify-between text-xs text-slate-400">
                        <span>{((stage.count / mockDashboardData.pipeline[0].count) * 100).toFixed(1)}% of total leads</span>
                        <span>Avg: {formatCurrency(stage.value / stage.count)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
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
                        {activity.type === 'contact' && <Phone className="h-4 w-4" />}
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

          {/* Market Intelligence & Top Markets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Market Trends */}
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

            {/* Top Markets */}
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