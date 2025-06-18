import { PropertyWithDetails } from "@shared/schema";
import PropertyHeader from "./property-header";
import PropertyDetails from "./property-details";
import ListingStatus from "./listing-status";
import SkipTracingPlaceholder from "./skip-tracing-placeholder";
import ComparableSales from "./comparable-sales";
import MarketAnalysis from "./market-analysis";
import ExportActions from "./export-actions";

interface PropertyDashboardProps {
  property: PropertyWithDetails;
}

export default function PropertyDashboard({ property }: PropertyDashboardProps) {
  return (
    <div className="space-y-8">
      <PropertyHeader property={property} />
      
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
