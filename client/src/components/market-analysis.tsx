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
      <Card className="card-bg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-100">
            Market Metrics
            <BarChart3 className="h-5 w-5 text-primary" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Average Days on Market</span>
                <span className="text-2xl font-bold text-primary">
                  {marketMetrics?.avgDaysOnMarket || 0}
                </span>
              </div>
              <div className="text-xs text-slate-500">Neighborhood average</div>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Median Sale Price</span>
                <span className="text-2xl font-bold text-emerald-400">
                  {marketMetrics?.medianSalePrice ? 
                    `$${(parseInt(marketMetrics.medianSalePrice) / 1000000).toFixed(1)}M` : 
                    "N/A"
                  }
                </span>
              </div>
              <div className="text-xs text-emerald-400">
                +{marketMetrics?.priceAppreciation || 0}% from last year
              </div>
            </div>
            
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400">Price per Sq Ft</span>
                <span className="text-2xl font-bold text-primary">
                  ${marketMetrics?.avgPricePerSqft || 0}
                </span>
              </div>
              <div className="text-xs text-primary">+12.3% from last year</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="card-bg border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-100">
            Price Trend
            <TrendingUp className="h-5 w-5 text-emerald-400" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between space-x-2">
            {chartData.map((data, index) => (
              <div key={data.month} className="flex flex-col items-center space-y-2 flex-1">
                <div 
                  className={`w-full rounded-t ${
                    index === chartData.length - 1 ? 'bg-emerald-500' : 'bg-primary'
                  }`}
                  style={{ height: `${data.height}px` }}
                />
                <span className="text-xs text-slate-400">{data.month}</span>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-slate-400 text-sm">Median sale price trend over 6 months</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
