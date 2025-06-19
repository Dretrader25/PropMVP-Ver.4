import { ComparableSale } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface ComparableSalesProps {
  comparables: ComparableSale[];
}

export default function ComparableSales({ comparables }: ComparableSalesProps) {
  const formatPrice = (price: string) => {
    return `$${parseInt(price).toLocaleString()}`;
  };

  return (
    <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 pb-6">
        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
          Comparable Sales Analysis
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 text-sm bg-slate-700/40 px-3 py-1 rounded-full">Last 6 months</span>
            <div className="p-2 bg-blue-500/20 rounded-xl">
              <BarChart3 className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/30 bg-slate-800/30">
                <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm uppercase tracking-wide">Property Address</th>
                <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm uppercase tracking-wide">Sale Price</th>
                <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm uppercase tracking-wide">Bed/Bath</th>
                <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm uppercase tracking-wide">Square Feet</th>
                <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm uppercase tracking-wide">Price/Sq Ft</th>
                <th className="text-left py-4 px-6 text-slate-300 font-semibold text-sm uppercase tracking-wide">Sale Date</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((comp, index) => (
                <tr 
                  key={comp.id} 
                  className={`border-b border-slate-700/20 hover:bg-slate-700/20 transition-all duration-300 group ${
                    index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/10'
                  }`}
                >
                  <td className="py-5 px-6 text-slate-200 font-medium group-hover:text-white transition-colors">
                    {comp.address}
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-emerald-400 font-bold text-lg bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      {formatPrice(comp.salePrice)}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-slate-300 bg-slate-700/30 px-3 py-1 rounded-full font-medium">
                      {comp.beds}/{comp.baths}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-slate-300 bg-slate-700/30 px-3 py-1 rounded-full font-medium">
                      {comp.sqft?.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-5 px-6">
                    <span className="text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full font-semibold border border-blue-500/20">
                      ${comp.pricePerSqft}
                    </span>
                  </td>
                  <td className="py-5 px-6 text-slate-400 font-medium">{comp.saleDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-6 bg-slate-800/20 border-t border-slate-700/30">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">
              Showing {comparables.length} comparable properties within 0.5 miles
            </span>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
                <span className="text-slate-400">Sale Price</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-slate-400">Price/Sq Ft</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
