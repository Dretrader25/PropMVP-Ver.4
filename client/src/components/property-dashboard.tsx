import { PropertyWithDetails } from "@shared/schema";
import PropertyHeader from "./property-header";
import PropertyDetails from "./property-details";
import ListingStatus from "./listing-status";
import SkipTracingPlaceholder from "./skip-tracing-placeholder";
import ComparableSales from "./comparable-sales";
import MarketAnalysis from "./market-analysis";
import ExportActions from "./export-actions";
import CollapsibleSection from "./collapsible-section";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, Home, TrendingUp, BarChart3, FileText, Users } from "lucide-react";

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
      
      {/* Property Overview & Details */}
      <CollapsibleSection
        title="Property Overview & Details"
        description="Comprehensive property information and current listing status"
        icon={Home}
        defaultExpanded={true}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <PropertyDetails property={property} />
          <ListingStatus property={property} />
          <SkipTracingPlaceholder />
        </div>
      </CollapsibleSection>
      
      {/* Market Analysis & Comparables */}
      <CollapsibleSection
        title="Market Analysis & Comparable Sales"
        description="Market trends, comparable sales data, and neighborhood analysis"
        icon={TrendingUp}
        badge="Market Data"
        defaultExpanded={true}
      >
        <div className="space-y-6">
          <ComparableSales comparables={property.comparables} />
          <MarketAnalysis property={property} />
        </div>
      </CollapsibleSection>
      
      {/* Export & Actions */}
      <CollapsibleSection
        title="Export & Actions"
        description="Download reports, export data, and manage property information"
        icon={FileText}
        defaultExpanded={false}
      >
        <ExportActions property={property} />
      </CollapsibleSection>
    </div>
  );
}
