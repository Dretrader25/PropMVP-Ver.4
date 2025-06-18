import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

interface PropertyHeaderProps {
  property: PropertyWithDetails;
}

export default function PropertyHeader({ property }: PropertyHeaderProps) {
  const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zipCode}`;
  
  return (
    <Card className="card-bg border-slate-700/50">
      <CardContent className="p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-slate-100">{fullAddress}</h2>
              <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            </div>
            <p className="text-slate-400 mb-4">
              {property.propertyType} • Built in {property.yearBuilt} • Last sold in {property.lastSaleDate ? new Date(property.lastSaleDate).getFullYear() : 'N/A'}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{property.beds}</div>
                <div className="text-xs text-slate-400">Bedrooms</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{property.baths}</div>
                <div className="text-xs text-slate-400">Bathrooms</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{property.sqft?.toLocaleString()}</div>
                <div className="text-xs text-slate-400">Sq Ft</div>
              </div>
              <div className="bg-slate-700/30 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-primary">{property.yearBuilt}</div>
                <div className="text-xs text-slate-400">Year Built</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 lg:mt-0 lg:ml-8">
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
              alt="Property exterior view" 
              className="w-full lg:w-80 h-48 object-cover rounded-xl border border-slate-600/50"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
