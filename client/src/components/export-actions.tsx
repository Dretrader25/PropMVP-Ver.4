import { PropertyWithDetails } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileCode, FileText, FileSpreadsheet, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportActionsProps {
  property: PropertyWithDetails;
}

export default function ExportActions({ property }: ExportActionsProps) {
  const { toast } = useToast();

  const handleExportJSON = async () => {
    try {
      const response = await fetch(`/api/properties/${property.id}/export`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Export failed");
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'property-report.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Property data exported as JSON file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export property data.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented with a report generation service.",
    });
  };

  const handleExportExcel = () => {
    toast({
      title: "Excel Export",
      description: "Excel export functionality would be implemented with spreadsheet generation.",
    });
  };

  return (
    <Card className="card-bg border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-slate-100">
          Export & Reports
          <Download className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="flex items-center justify-center space-x-3 bg-slate-700/50 border-slate-600/50 text-slate-300 py-4 px-6 hover:bg-slate-700 hover:border-slate-500"
          >
            <FileCode className="h-4 w-4 text-primary" />
            <span>Export JSON</span>
          </Button>
          
          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="flex items-center justify-center space-x-3 bg-slate-700/50 border-slate-600/50 text-slate-300 py-4 px-6 hover:bg-slate-700 hover:border-slate-500"
          >
            <FileText className="h-4 w-4 text-red-400" />
            <span>Download PDF</span>
          </Button>
          
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="flex items-center justify-center space-x-3 bg-slate-700/50 border-slate-600/50 text-slate-300 py-4 px-6 hover:bg-slate-700 hover:border-slate-500"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
            <span>Export Excel</span>
          </Button>
        </div>
        
        <div className="mt-6 p-4 bg-slate-700/20 rounded-lg border border-slate-600/30">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-slate-300 font-medium">Report Contents</p>
              <p className="text-slate-400 text-sm mt-1">
                Includes property details, comparable sales, market analysis, and all enriched data points. 
                Skip tracing data included with premium subscription.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
