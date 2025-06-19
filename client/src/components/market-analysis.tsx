import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3 } from "lucide-react";

interface MarketAnalysisProps {
  property: PropertyWithDetails;
}

export default function MarketAnalysis({ property }: MarketAnalysisProps) {
  const { marketMetrics } = property;
  
  // Mock chart data for visualization
  const chartData = [
    { month: "Jan", height: 40 },
    { month: "Feb", height: 55 },
    { month: "Mar", height: 48 },
    { month: "Apr", height: 62 },
    { month: "May", height: 70 },
    { month: "Jun", height: 85 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-800/30 to-blue-700/30 pb-6">
          <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
            Market Intelligence
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 font-medium">Average Days on Market</span>
                <span className="text-3xl font-bold text-gradient">
                  {marketMetrics?.avgDaysOnMarket || 0}
                </span>
              </div>
              <div className="text-sm text-slate-500 bg-slate-700/30 px-3 py-1 rounded-full w-fit">
                Neighborhood average
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 font-medium">Median Sale Price</span>
                <span className="text-3xl font-bold text-gradient">
                  {marketMetrics?.medianSalePrice ? 
                    `$${(parseInt(marketMetrics.medianSalePrice) / 1000000).toFixed(1)}M` : 
                    "N/A"
                  }
                </span>
              </div>
              <div className="flex items-center">
                <div className="text-sm bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/30">
                  +{marketMetrics?.priceAppreciation || 0}% from last year
                </div>
              </div>
            </div>
            
            <div className="glass-card rounded-2xl p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 font-medium">Price per Sq Ft</span>
                <span className="text-3xl font-bold text-gradient">
                  ${marketMetrics?.avgPricePerSqft || 0}
                </span>
              </div>
              <div className="text-sm bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 w-fit">
                +12.3% from last year
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-800/30 to-emerald-700/30 pb-6">
          <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
            Price Trend Analysis
            <div className="p-2 bg-emerald-500/20 rounded-xl">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-slate-800/30 rounded-2xl p-6">
            <div className="h-64 flex items-end justify-between space-x-3">
              {chartData.map((data, index) => (
                <div key={data.month} className="flex flex-col items-center space-y-3 flex-1 group">
                  <div 
                    className={`w-full rounded-t-lg transition-all duration-500 hover:scale-105 ${
                      index === chartData.length - 1 
                        ? 'bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/25' 
                        : 'bg-gradient-to-t from-blue-500 to-blue-400 shadow-lg shadow-blue-500/25'
                    }`}
                    style={{ height: `${data.height}px` }}
                  />
                  <span className="text-xs text-slate-400 font-medium group-hover:text-slate-300 transition-colors">
                    {data.month}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-slate-700/20 rounded-xl">
              <div className="flex items-center justify-between">
                <p className="text-slate-400 text-sm font-medium">6-month price trend</p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-slate-400 text-xs">Historical</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                    <span className="text-slate-400 text-xs">Current</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
