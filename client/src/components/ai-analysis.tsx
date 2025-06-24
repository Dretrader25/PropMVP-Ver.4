import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign,
  Clock,
  Target,
  Zap,
  Image as ImageIcon, // For placeholder
} from "lucide-react";
import { PropertyWithDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient"; // Not used directly in this component for mutation
import { formatCurrency } from "@/lib/utils";

// This is the AI analysis part of the backend response
interface AIAnalysisResult {
  grade: string;
  score: number;
  summary: string;
  keyStrengths: string[];
  riskFactors: string[];
  recommendation: string;
  estimatedProfit: number;
  confidenceLevel: number;
  marketPosition: string;
  urgency: string;
}

// This is the augmented property part of the backend response
export type AnalyzedProperty = PropertyWithDetails & {
  externalImageURL?: string;
  // Potentially other augmented fields if we decide to add more
};

// The full response structure from /api/properties/:id/analyze
interface AnalysisApiResponse {
  aiAnalysis: AIAnalysisResult;
  property: AnalyzedProperty;
  dataSource: string;
  externalImageURL?: string; // Explicitly part of the root for easier access initially
}

interface AIAnalysisComponentProps {
  onAnalysisComplete: (data: AnalysisApiResponse) => void;
}


export default function AIAnalysisComponent({ onAnalysisComplete }: AIAnalysisComponentProps) {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>("");
  // The 'analysis' state will now store the AI part of the response
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null);

  // Fetch all properties for selection
  const { data: properties = [], isLoading: propertiesLoading } = useQuery<PropertyWithDetails[]>({
    queryKey: ["/api/properties"], // StandardTanstack Query key, not a direct fetch URL
    queryFn: () => apiRequest<PropertyWithDetails[]>("/api/properties"), // Using apiRequest
    enabled: true
  });

  // AI Analysis mutation
  const analysisMutation = useMutation<AnalysisApiResponse, Error, string>({
    mutationFn: async (propertyId: string): Promise<AnalysisApiResponse> => {
      const response = await fetch(`/api/properties/${propertyId}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to analyze property and parse error' }));
        throw new Error(errorData.message || 'Failed to analyze property');
      }
      
      return await response.json() as AnalysisApiResponse;
    },
    onSuccess: (data) => {
      setAiAnalysisResult(data.aiAnalysis);
      onAnalysisComplete(data); // Pass the full data to the parent
    },
    onError: (error) => {
      console.error("Analysis mutation error:", error);
      // Error is handled by isError and error properties of useMutation
    }
  });

  const handleAnalyze = () => {
    if (selectedPropertyId) {
      setAiAnalysisResult(null); // Clear previous results
      analysisMutation.mutate(selectedPropertyId);
    }
  };

  const getGradeColor = (grade: string = "") => {
    const gradeMap: { [key: string]: string } = {
      'A+': 'text-emerald-400 bg-emerald-500/20',
      'A': 'text-emerald-400 bg-emerald-500/20',
      'A-': 'text-emerald-400 bg-emerald-500/20',
      'B+': 'text-blue-400 bg-blue-500/20',
      'B': 'text-blue-400 bg-blue-500/20',
      'B-': 'text-blue-400 bg-blue-500/20',
      'C+': 'text-yellow-400 bg-yellow-500/20',
      'C': 'text-yellow-400 bg-yellow-500/20',
      'C-': 'text-yellow-400 bg-yellow-500/20',
      'D+': 'text-orange-400 bg-orange-500/20',
      'D': 'text-orange-400 bg-orange-500/20',
      'D-': 'text-orange-400 bg-orange-500/20',
      'F': 'text-red-400 bg-red-500/20'
    };
    return gradeMap[grade] || 'text-slate-400 bg-slate-500/20';
  };

  const getUrgencyColor = (urgency: string = "") => {
    const urgencyMap: { [key: string]: string } = {
      'Buy ASAP': 'text-emerald-400 bg-emerald-500/20',
      'Strong Consider': 'text-blue-400 bg-blue-500/20',
      'Evaluate Further': 'text-yellow-400 bg-yellow-500/20',
      'Proceed with Caution': 'text-orange-400 bg-orange-500/20',
      'Avoid': 'text-red-400 bg-red-500/20'
    };
    return urgencyMap[urgency] || 'text-slate-400 bg-slate-500/20';
  };

  return (
    <Card className="glass-card rounded-3xl shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 pb-6">
        <CardTitle className="flex items-center justify-between text-slate-100 text-2xl">
          <div className="flex items-center">
            <Brain className="h-6 w-6 text-purple-400 mr-3" />
            AI Property Analysis Engine
          </div>
          <div className="p-2 bg-purple-500/20 rounded-xl">
            <Zap className="h-6 w-6 text-purple-400" />
          </div>
        </CardTitle>
        <p className="text-slate-400 mt-2">
          Select a property to fetch the latest data and generate an AI-powered investment analysis.
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Property Selection */}
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="property-select" className="text-slate-300 text-sm font-medium mb-2 block">
              Select Property to Analyze
            </label>
            <div className="flex gap-4">
              <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
                <SelectTrigger id="property-select" className="flex-1 modern-input bg-slate-800/50 border-slate-600">
                  <SelectValue placeholder="Choose a property from your searches..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {propertiesLoading ? (
                    <SelectItem value="loading" disabled>Loading properties...</SelectItem>
                  ) : (properties && properties.length === 0) ? (
                    <SelectItem value="none" disabled>No properties found. Search first.</SelectItem>
                  ) : (
                    properties?.map((property) => (
                      <SelectItem key={property.id} value={property.id.toString()}>
                        {property.address}, {property.city}, {property.state} - {property.listPrice ? formatCurrency(Number(property.listPrice)) : 'Price TBD'}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={handleAnalyze}
                disabled={!selectedPropertyId || analysisMutation.isPending || propertiesLoading}
                className="btn-primary-gradient min-w-[120px]"
              >
                {analysisMutation.isPending ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {aiAnalysisResult && (
          <div className="space-y-6">
            {/* Grade and Score Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="mb-2">
                  <span className={`text-4xl font-bold px-4 py-2 rounded-xl ${getGradeColor(aiAnalysisResult.grade)}`}>
                    {aiAnalysisResult.grade}
                  </span>
                </div>
                <p className="text-slate-400 text-sm">Investment Grade</p>
              </div>
              
              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-3xl font-bold text-gradient mb-2">{aiAnalysisResult.score}</div>
                <p className="text-slate-400 text-sm">Score (0-100)</p>
                <Progress value={aiAnalysisResult.score} className="mt-2 h-2" />
              </div>
              
              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-2">
                  {formatCurrency(aiAnalysisResult.estimatedProfit)}
                </div>
                <p className="text-slate-400 text-sm">Est. Profit</p>
              </div>
              
              <div className="glass-card rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">{aiAnalysisResult.confidenceLevel}%</div>
                <p className="text-slate-400 text-sm">Confidence</p>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center">
                <Target className="h-5 w-5 text-blue-400 mr-2" />
                Executive Summary
              </h3>
              <p className="text-slate-300 leading-relaxed">{aiAnalysisResult.summary}</p>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-600">
                <div>
                  <span className="text-slate-400 text-sm">Market Position: </span>
                  <span className="text-slate-200 font-medium">{aiAnalysisResult.marketPosition}</span>
                </div>
                <Badge className={`${getUrgencyColor(aiAnalysisResult.urgency)} border-none`}>
                  {aiAnalysisResult.urgency}
                </Badge>
              </div>
            </div>

            {/* Strengths and Risks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Key Strengths */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-400 mr-2" />
                  Key Strengths
                </h3>
                <div className="space-y-3">
                  {aiAnalysisResult.keyStrengths.map((strength, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Factors */}
              <div className="glass-card rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-amber-400 mr-2" />
                  Risk Factors
                </h3>
                <div className="space-y-3">
                  {aiAnalysisResult.riskFactors.map((risk, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-slate-300 text-sm">{risk}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Recommendation */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
                Investment Recommendation
              </h3>
              <p className="text-slate-300 leading-relaxed">{aiAnalysisResult.recommendation}</p>
            </div>
          </div>
        )}

        {/* Error Handling */}
        {analysisMutation.isError && (
          <div className="glass-card rounded-2xl p-6 border border-red-500/30">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
              <h3 className="text-red-400 font-semibold">Analysis Failed</h3>
            </div>
            <p className="text-slate-300">
              {analysisMutation.error instanceof Error 
                ? analysisMutation.error.message 
                : "Failed to analyze property. Please try again."}
            </p>
            <Button 
              onClick={() => analysisMutation.reset()}
              variant="outline"
              className="mt-3"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Getting Started */}
        {!aiAnalysisResult && !analysisMutation.isPending && (
          <div className="text-center py-8">
            <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Ready for AI Analysis</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Select a property from your searches above and click "Analyze" to get a comprehensive AI-powered investment grade from F to A+.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}