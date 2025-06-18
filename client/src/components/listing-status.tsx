import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Circle } from "lucide-react";

interface ListingStatusProps {
  property: PropertyWithDetails;
}

export default function ListingStatus({ property }: ListingStatusProps) {
  const formatPrice = (price: string | null) => {
    if (!price) return "N/A";
    return `$${parseInt(price).toLocaleString()}`;
  };

  const formatPriceShort = (price: string | null) => {
    if (!price) return "N/A";
    const num = parseInt(price);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  return (
    <Card className="card-bg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-100">
          Listing Status
          <Tag className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-3xl font-bold text-emerald-400 mb-1">
              {formatPrice(property.listPrice)}
            </div>
            <div className="text-slate-400 text-sm">Current List Price</div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Status</span>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <Circle className="mr-1 h-2 w-2 fill-current" />
                {property.listingStatus || "Not Listed"}
              </Badge>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Days on Market</span>
              <span className="text-slate-200 font-medium">{property.daysOnMarket || 0} days</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Price/Sq Ft</span>
              <span className="text-slate-200 font-medium">${property.pricePerSqft || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Last Sale</span>
              <span className="text-slate-200 font-medium">
                {formatPriceShort(property.lastSalePrice)} ({property.lastSaleDate ? new Date(property.lastSaleDate).getFullYear() : "N/A"})
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
