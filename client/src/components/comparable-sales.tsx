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
    <Card className="card-bg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-100">
          Comparable Sales
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 text-sm">Last 6 months</span>
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Address</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Sale Price</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Bed/Bath</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Sq Ft</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Price/Sq Ft</th>
                <th className="text-left py-3 px-4 text-slate-400 font-medium">Sale Date</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((comp) => (
                <tr 
                  key={comp.id} 
                  className="border-b border-slate-700/30 hover:bg-slate-700/20 transition-colors duration-200"
                >
                  <td className="py-4 px-4 text-slate-200 font-medium">{comp.address}</td>
                  <td className="py-4 px-4 text-emerald-400 font-semibold">{formatPrice(comp.salePrice)}</td>
                  <td className="py-4 px-4 text-slate-300">{comp.beds}/{comp.baths}</td>
                  <td className="py-4 px-4 text-slate-300">{comp.sqft?.toLocaleString()}</td>
                  <td className="py-4 px-4 text-slate-300">${comp.pricePerSqft}</td>
                  <td className="py-4 px-4 text-slate-400">{comp.saleDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
