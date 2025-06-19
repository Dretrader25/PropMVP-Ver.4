import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  TrendingUp, 
  Home, 
  DollarSign, 
  Filter,
  RotateCcw,
  Maximize,
  Eye,
  Search,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

// Property data with investment scoring
interface Property {
  id: number;
  address: string;
  lat: number;
  lng: number;
  price: number;
  estimatedValue: number;
  equity: number;
  investmentScore: number; // 0-100
  riskLevel: "low" | "medium" | "high";
  dealType: "wholesale" | "flip" | "rental" | "land";
  daysOnMarket: number;
  motivation: string;
  distressLevel: number; // 0-100
  roi: number;
  cashFlow: number;
  appreciationPotential: number;
}

// Investment potential data with real property locations
const propertyHeatmapData: Property[] = [
  {
    id: 1,
    address: "1234 Oak Street, Los Angeles, CA",
    lat: 34.0522,
    lng: -118.2437,
    price: 285000,
    estimatedValue: 425000,
    equity: 140000,
    investmentScore: 92,
    riskLevel: "low",
    dealType: "wholesale",
    daysOnMarket: 12,
    motivation: "Foreclosure",
    distressLevel: 85,
    roi: 35.2,
    cashFlow: 1200,
    appreciationPotential: 18.5
  },
  {
    id: 2,
    address: "5678 Pine Avenue, Beverly Hills, CA",
    lat: 34.0736,
    lng: -118.4004,
    price: 650000,
    estimatedValue: 785000,
    equity: 135000,
    investmentScore: 78,
    riskLevel: "medium",
    dealType: "flip",
    daysOnMarket: 28,
    motivation: "Divorce",
    distressLevel: 65,
    roi: 21.8,
    cashFlow: 800,
    appreciationPotential: 12.3
  },
  {
    id: 3,
    address: "9012 Elm Drive, Santa Monica, CA",
    lat: 34.0195,
    lng: -118.4912,
    price: 495000,
    estimatedValue: 625000,
    equity: 130000,
    investmentScore: 85,
    riskLevel: "low",
    dealType: "rental",
    daysOnMarket: 18,
    motivation: "Relocation",
    distressLevel: 55,
    roi: 26.3,
    cashFlow: 1450,
    appreciationPotential: 15.7
  },
  {
    id: 4,
    address: "3456 Maple Lane, Pasadena, CA",
    lat: 34.1478,
    lng: -118.1445,
    price: 175000,
    estimatedValue: 245000,
    equity: 70000,
    investmentScore: 68,
    riskLevel: "medium",
    dealType: "wholesale",
    daysOnMarket: 45,
    motivation: "Financial Distress",
    distressLevel: 78,
    roi: 18.5,
    cashFlow: 650,
    appreciationPotential: 9.8
  },
  {
    id: 5,
    address: "7890 Cedar Court, Long Beach, CA",
    lat: 33.7701,
    lng: -118.1937,
    price: 325000,
    estimatedValue: 445000,
    equity: 120000,
    investmentScore: 88,
    riskLevel: "low",
    dealType: "flip",
    daysOnMarket: 8,
    motivation: "Inheritance",
    distressLevel: 70,
    roi: 32.1,
    cashFlow: 950,
    appreciationPotential: 11.2
  },
  {
    id: 6,
    address: "2468 Birch Street, Burbank, CA",
    lat: 34.1808,
    lng: -118.3090,
    price: 225000,
    estimatedValue: 285000,
    equity: 60000,
    investmentScore: 55,
    riskLevel: "high",
    dealType: "wholesale",
    daysOnMarket: 67,
    motivation: "Job Loss",
    distressLevel: 60,
    roi: 14.2,
    cashFlow: 450,
    appreciationPotential: 8.1
  },
  {
    id: 7,
    address: "1357 Spruce Ave, Glendale, CA",
    lat: 34.1425,
    lng: -118.2551,
    price: 385000,
    estimatedValue: 475000,
    equity: 90000,
    investmentScore: 72,
    riskLevel: "medium",
    dealType: "rental",
    daysOnMarket: 32,
    motivation: "Downsizing",
    distressLevel: 45,
    roi: 19.8,
    cashFlow: 750,
    appreciationPotential: 10.5
  },
  {
    id: 8,
    address: "9753 Willow Dr, Torrance, CA",
    lat: 33.8358,
    lng: -118.3406,
    price: 265000,
    estimatedValue: 345000,
    equity: 80000,
    investmentScore: 75,
    riskLevel: "medium",
    dealType: "wholesale",
    daysOnMarket: 21,
    motivation: "Medical Bills",
    distressLevel: 72,
    roi: 22.4,
    cashFlow: 680,
    appreciationPotential: 7.9
  },
  {
    id: 9,
    address: "4680 Poplar Rd, Compton, CA",
    lat: 33.8958,
    lng: -118.2201,
    price: 145000,
    estimatedValue: 225000,
    equity: 80000,
    investmentScore: 95,
    riskLevel: "low",
    dealType: "wholesale",
    daysOnMarket: 5,
    motivation: "Bankruptcy",
    distressLevel: 95,
    roi: 42.8,
    cashFlow: 1100,
    appreciationPotential: 22.1
  },
  {
    id: 10,
    address: "8024 Aspen St, Inglewood, CA",
    lat: 33.9617,
    lng: -118.3531,
    price: 195000,
    estimatedValue: 285000,
    equity: 90000,
    investmentScore: 89,
    riskLevel: "low",
    dealType: "flip",
    daysOnMarket: 14,
    motivation: "Estate Sale",
    distressLevel: 80,
    roi: 35.7,
    cashFlow: 1050,
    appreciationPotential: 19.3
  },
  {
    id: 11,
    address: "6159 Hickory Ln, Hawthorne, CA",
    lat: 33.9164,
    lng: -118.3526,
    price: 155000,
    estimatedValue: 195000,
    equity: 40000,
    investmentScore: 45,
    riskLevel: "high",
    dealType: "land",
    daysOnMarket: 89,
    motivation: "Tax Issues",
    distressLevel: 50,
    roi: 12.8,
    cashFlow: 280,
    appreciationPotential: 6.7
  },
  {
    id: 12,
    address: "3791 Sycamore Ct, El Segundo, CA",
    lat: 33.9192,
    lng: -118.4165,
    price: 475000,
    estimatedValue: 525000,
    equity: 50000,
    investmentScore: 62,
    riskLevel: "medium",
    dealType: "rental",
    daysOnMarket: 52,
    motivation: "Retirement",
    distressLevel: 35,
    roi: 16.5,
    cashFlow: 620,
    appreciationPotential: 5.2
  }
];

export default function PropertyHeatmap() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filterScore, setFilterScore] = useState<number>(0);
  const [filterDealType, setFilterDealType] = useState<string>("all");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Fetch properties from API
  const { data: apiProperties } = useQuery({
    queryKey: ['/api/properties'],
    queryFn: async () => {
      const response = await fetch('/api/properties');
      return response.json();
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getInvestmentColor = (score: number) => {
    if (score >= 90) return "#10B981"; // emerald-500 - Excellent
    if (score >= 80) return "#3B82F6"; // blue-500 - Very Good
    if (score >= 70) return "#8B5CF6"; // violet-500 - Good
    if (score >= 60) return "#F59E0B"; // amber-500 - Fair
    if (score >= 50) return "#EF4444"; // red-500 - Poor
    return "#6B7280"; // gray-500 - Very Poor
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { label: "🎯 Excellent Deal", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
    if (score >= 80) return { label: "⭐ Very Good", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" };
    if (score >= 70) return { label: "👍 Good Deal", color: "bg-violet-500/20 text-violet-400 border-violet-500/30" };
    if (score >= 60) return { label: "⚠️ Fair Deal", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    if (score >= 50) return { label: "⛔ Poor Deal", color: "bg-red-500/20 text-red-400 border-red-500/30" };
    return { label: "🚫 Avoid", color: "bg-gray-500/20 text-gray-400 border-gray-500/30" };
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "low": return <CheckCircle className="h-4 w-4 text-emerald-400" />;
      case "medium": return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case "high": return <XCircle className="h-4 w-4 text-red-400" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMarkerSize = (score: number) => {
    if (score >= 90) return "w-8 h-8";
    if (score >= 80) return "w-7 h-7";
    if (score >= 70) return "w-6 h-6";
    if (score >= 60) return "w-5 h-5";
    return "w-4 h-4";
  };

  const filteredProperties = propertyHeatmapData.filter(property => {
    if (filterScore > 0 && property.investmentScore < filterScore) return false;
    if (filterDealType !== "all" && property.dealType !== filterDealType) return false;
    return true;
  });

  return (
    <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-emerald-800/30 to-emerald-700/30 pb-6">
        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
          Investment Property Heatmap
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <select 
                className="bg-slate-800/50 border border-slate-600 rounded-lg px-3 py-1 text-sm text-slate-200"
                value={filterDealType}
                onChange={(e) => setFilterDealType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="wholesale">Wholesale</option>
                <option value="flip">Flip</option>
                <option value="rental">Rental</option>
                <option value="land">Land</option>
              </select>
              <input
                type="range"
                min="0"
                max="100"
                value={filterScore}
                onChange={(e) => setFilterScore(Number(e.target.value))}
                className="w-20"
              />
              <span className="text-xs text-slate-300 min-w-[60px]">Score: {filterScore}+</span>
            </div>
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <Target className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          
          {/* Interactive Investment Heatmap */}
          <div className="lg:col-span-2 relative bg-slate-900/50 min-h-[600px] overflow-hidden">
            
            {/* Map Background with Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" className="text-slate-600">
                <defs>
                  <pattern id="property-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#property-grid)" />
              </svg>
            </div>

            {/* Property Markers */}
            <div className="absolute inset-0 p-8">
              <div className="relative w-full h-full">
                {filteredProperties.map((property) => {
                  const x = ((property.lng + 118.5) / 1.0) * 100; // Normalize longitude
                  const y = ((34.3 - property.lat) / 0.6) * 100; // Normalize latitude
                  
                  return (
                    <div
                      key={property.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                      style={{ 
                        left: `${Math.max(5, Math.min(95, x))}%`, 
                        top: `${Math.max(5, Math.min(95, y))}%` 
                      }}
                      onClick={() => setSelectedProperty(property)}
                    >
                      {/* Investment Score Pulse */}
                      <div 
                        className={`absolute ${getMarkerSize(property.investmentScore)} rounded-full animate-ping opacity-40`}
                        style={{ backgroundColor: getInvestmentColor(property.investmentScore) }}
                      />
                      
                      {/* Main Property Marker */}
                      <div 
                        className={`${getMarkerSize(property.investmentScore)} rounded-full border-2 border-white shadow-lg transform transition-all duration-300 group-hover:scale-125 z-20 relative flex items-center justify-center`}
                        style={{ backgroundColor: getInvestmentColor(property.investmentScore) }}
                      >
                        <Home className="h-3 w-3 text-white" />
                      </div>
                      
                      {/* Investment Score Badge */}
                      <div className="absolute -top-2 -right-2 bg-slate-900/95 text-white text-xs px-1 py-0.5 rounded border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                        {property.investmentScore}
                      </div>
                      
                      {/* Hover Details */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                        <div className="bg-slate-900/95 text-white text-xs px-3 py-2 rounded-lg border border-slate-700/50 whitespace-nowrap">
                          <div className="font-semibold">{property.address.split(',')[0]}</div>
                          <div className="text-slate-300">Score: {property.investmentScore}/100</div>
                          <div className="text-slate-300">{formatCurrency(property.price)}</div>
                          <div className="text-slate-300">ROI: {property.roi}%</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Control Panel */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Button variant="outline" size="sm" className="glass-card">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="glass-card" onClick={() => setFilterScore(0)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button variant="outline" size="sm" className="glass-card">
                <Maximize className="h-4 w-4 mr-2" />
                Fullscreen
              </Button>
            </div>

            {/* Investment Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/95 rounded-xl p-4 border border-slate-700/50">
              <div className="text-slate-200 text-sm font-semibold mb-3">Investment Score</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#10B981" }}></div>
                  <span className="text-slate-300 text-xs">90-100 (Excellent)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#3B82F6" }}></div>
                  <span className="text-slate-300 text-xs">80-89 (Very Good)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#8B5CF6" }}></div>
                  <span className="text-slate-300 text-xs">70-79 (Good)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#F59E0B" }}></div>
                  <span className="text-slate-300 text-xs">60-69 (Fair)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#EF4444" }}></div>
                  <span className="text-slate-300 text-xs">50-59 (Poor)</span>
                </div>
              </div>
            </div>

            {/* Stats Overlay */}
            <div className="absolute top-4 right-4 bg-slate-900/95 rounded-xl p-4 border border-slate-700/50">
              <div className="text-slate-200 text-sm font-semibold mb-3">Live Stats</div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Properties:</span>
                  <span className="text-slate-200 font-medium">{filteredProperties.length}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Avg Score:</span>
                  <span className="text-slate-200 font-medium">
                    {(filteredProperties.reduce((acc, p) => acc + p.investmentScore, 0) / filteredProperties.length).toFixed(0)}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Excellent:</span>
                  <span className="text-emerald-400 font-medium">
                    {filteredProperties.filter(p => p.investmentScore >= 90).length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Details Panel */}
          <div className="bg-slate-800/30 p-6 border-l border-slate-700/30">
            {selectedProperty ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-200">{selectedProperty.address.split(',')[0]}</h3>
                    <Badge className={getScoreLabel(selectedProperty.investmentScore).color + " border"}>
                      {getScoreLabel(selectedProperty.investmentScore).label}
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Investment Score</span>
                        <div className="p-1 bg-emerald-500/20 rounded-lg">
                          <Target className="h-4 w-4 text-emerald-400" />
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gradient">{selectedProperty.investmentScore}/100</div>
                      <div className="text-slate-500 text-xs mt-1">Overall potential rating</div>
                    </div>

                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Deal Details</span>
                        <div className="p-1 bg-blue-500/20 rounded-lg">
                          <DollarSign className="h-4 w-4 text-blue-400" />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Price:</span>
                          <span className="text-slate-200 font-medium">{formatCurrency(selectedProperty.price)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Est. Value:</span>
                          <span className="text-slate-200 font-medium">{formatCurrency(selectedProperty.estimatedValue)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Equity:</span>
                          <span className="text-emerald-400 font-medium">{formatCurrency(selectedProperty.equity)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ROI:</span>
                          <span className="text-purple-400 font-medium">{selectedProperty.roi}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Risk & Type</span>
                        {getRiskIcon(selectedProperty.riskLevel)}
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Risk Level:</span>
                          <span className={`font-medium ${
                            selectedProperty.riskLevel === 'low' ? 'text-emerald-400' :
                            selectedProperty.riskLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {selectedProperty.riskLevel.charAt(0).toUpperCase() + selectedProperty.riskLevel.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Deal Type:</span>
                          <span className="text-slate-200 font-medium">
                            {selectedProperty.dealType.charAt(0).toUpperCase() + selectedProperty.dealType.slice(1)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Days on Market:</span>
                          <span className="text-slate-200 font-medium">{selectedProperty.daysOnMarket}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Motivation:</span>
                          <span className="text-orange-400 font-medium">{selectedProperty.motivation}</span>
                        </div>
                      </div>
                    </div>

                    <div className="glass-card rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">Performance Metrics</span>
                        <div className="p-1 bg-purple-500/20 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-purple-400" />
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cash Flow:</span>
                          <span className="text-emerald-400 font-medium">{formatCurrency(selectedProperty.cashFlow)}/mo</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Appreciation:</span>
                          <span className="text-blue-400 font-medium">+{selectedProperty.appreciationPotential}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Distress Level:</span>
                          <span className="text-red-400 font-medium">{selectedProperty.distressLevel}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-2 px-4 rounded-xl">
                    <Eye className="h-4 w-4 mr-2" />
                    Analyze Deal
                  </Button>
                  <Button variant="outline" className="w-full glass-card">
                    <Search className="h-4 w-4 mr-2" />
                    View Comparables
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300 mb-2">Select a Property</h3>
                <p className="text-slate-400 text-sm">Click on any property marker to view detailed investment analysis and metrics</p>
                <div className="mt-4 text-xs text-slate-500">
                  {filteredProperties.length} properties shown
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}