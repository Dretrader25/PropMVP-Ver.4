import { PropertyWithDetails } from "@shared/schema";
import PropertyHeader from "./property-header";
import PropertyDetails from "./property-details";
import ListingStatus from "./listing-status";
import SkipTracingPlaceholder from "./skip-tracing-placeholder";
import ComparableSales from "./comparable-sales";
import MarketAnalysis from "./market-analysis";
import ExportActions from "./export-actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

interface PropertyDashboardProps {
  property: PropertyWithDetails;
}

export default function PropertyDashboard({ property }: PropertyDashboardProps) {
  // Check if data appears to be limited due to missing API key
  const isDataLimited = property.listingStatus === "Data Unavailable" || 
                       property.propertyType === "Data Unavailable" ||
                       (property.sqft === 0 && property.yearBuilt === 0);

  return (
    <div className="space-y-8">
      <PropertyHeader property={property} />
      
      {isDataLimited && (
        <Alert className="border-amber-500/30 bg-amber-500/10">
          <Info className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-amber-200">
            <strong>Limited Property Data:</strong> Property location confirmed, but detailed information is unavailable. 
            This typically occurs when the Rentcast API key isn't configured. Core property analysis features are still available.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PropertyDetails property={property} />
        <ListingStatus property={property} />
        <SkipTracingPlaceholder />
      </div>
      
      <ComparableSales comparables={property.comparables} />
      
      <MarketAnalysis property={property} />
      
      <ExportActions property={property} />
    </div>
  );
}
