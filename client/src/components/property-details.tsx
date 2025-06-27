import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PropertyDetailsProps {
  property: PropertyWithDetails;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  // Check if data appears to be unavailable (indicating missing API key)
  const isDataLimited = property.listingStatus === "Data Unavailable" || 
                       property.propertyType === "Data Unavailable" ||
                       (property.sqft === 0 && property.yearBuilt === 0);

  const details = [
    { label: "Property Type", value: property.propertyType || "N/A" },
    { label: "Lot Size", value: property.lotSize || "N/A" },
    { label: "Parking", value: property.parking || "N/A" },
    { label: "Pool", value: property.hasPool ? "Yes" : "No" },
    { label: "HOA", value: property.hoaFees && property.hoaFees !== "0.00" ? `$${property.hoaFees}/month` : "None" },
  ];

  return (
    <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 pb-4">
        <CardTitle className="flex items-center justify-between text-slate-100 text-xl">
          <div className="flex items-center gap-3">
            Property Details
            {isDataLimited && (
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Limited Data
              </Badge>
            )}
          </div>
          <div className="p-2 bg-blue-500/20 rounded-xl">
            <Home className="h-6 w-6 text-blue-400" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-5">
          {details.map((detail, index) => (
            <div 
              key={detail.label}
              className={`flex justify-between items-center py-3 px-4 rounded-xl transition-all duration-200 hover:bg-slate-700/20 ${
                index < details.length - 1 ? 'border-b border-slate-700/30' : ''
              }`}
            >
              <span className="text-slate-400 font-medium">{detail.label}</span>
              <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
                detail.label === "Pool" && property.hasPool 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : "text-slate-200"
              }`}>
                {detail.value}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
