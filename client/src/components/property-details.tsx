import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";

interface PropertyDetailsProps {
  property: PropertyWithDetails;
}

export default function PropertyDetails({ property }: PropertyDetailsProps) {
  const details = [
    { label: "Property Type", value: property.propertyType || "N/A" },
    { label: "Lot Size", value: property.lotSize || "N/A" },
    { label: "Parking", value: property.parking || "N/A" },
    { label: "Pool", value: property.hasPool ? "Yes" : "No" },
    { label: "HOA", value: property.hoaFees ? `$${property.hoaFees}/month` : "None" },
  ];

  return (
    <Card className="card-bg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-100">
          Property Details
          <Home className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {details.map((detail, index) => (
            <div 
              key={detail.label}
              className={`flex justify-between items-center py-2 ${
                index < details.length - 1 ? 'border-b border-slate-700/50' : ''
              }`}
            >
              <span className="text-slate-400">{detail.label}</span>
              <span className={`font-medium ${
                detail.label === "Pool" && property.hasPool 
                  ? "text-emerald-400" 
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
