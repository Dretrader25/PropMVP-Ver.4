import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { propertySearchSchema, type PropertySearch, type PropertyWithDetails } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertySearchFormProps {
  onPropertySelect: (property: PropertyWithDetails) => void;
  onLoadingChange: (loading: boolean) => void;
}

const states = [
  { value: "CA", label: "California" },
  { value: "TX", label: "Texas" },
  { value: "NY", label: "New York" },
  { value: "FL", label: "Florida" },
  { value: "WA", label: "Washington" },
  { value: "OR", label: "Oregon" },
  { value: "AZ", label: "Arizona" },
  { value: "NV", label: "Nevada" },
];

export default function PropertySearchForm({ onPropertySelect, onLoadingChange }: PropertySearchFormProps) {
  const { toast } = useToast();
  
  const form = useForm<PropertySearch>({
    resolver: zodResolver(propertySearchSchema),
    defaultValues: {
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const searchMutation = useMutation({
    mutationFn: async (data: PropertySearch) => {
      const response = await apiRequest("POST", "/api/properties/search", data);
      return response.json() as Promise<PropertyWithDetails>;
    },
    onMutate: () => {
      onLoadingChange(true);
    },
    onSuccess: (property) => {
      onLoadingChange(false);
      onPropertySelect(property);
      // Invalidate properties cache so analytics dashboard sees the new property
      queryClient.invalidateQueries({ queryKey: ['/api/properties'] });
      toast({
        title: "Property Found",
        description: "Property data has been successfully enriched.",
      });
    },
    onError: (error) => {
      onLoadingChange(false);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to search property. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PropertySearch) => {
    searchMutation.mutate(data);
  };

  const handleClear = () => {
    form.reset();
  };

  return (
    <Card className="premium-card rounded-3xl shadow-2xl">
      <CardContent className="p-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl mb-4 float-animation">
            <Search className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-gradient mb-3">Property Intelligence Engine</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Powered by authentic MLS data - Enter complete address for accurate property analysis
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-xl border border-emerald-500/20">
            <p className="text-sm text-emerald-400 font-medium">
              ✓ Real MLS Data • ✓ Authentic Comparables • ✓ Current Market Trends
            </p>
          </div>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-slate-200 font-medium text-sm uppercase tracking-wide">Street Address</Label>
              <Input
                {...form.register("address")}
                placeholder="123 Main Street"
                className="modern-input h-12 text-slate-200 placeholder-slate-400 rounded-xl"
              />
              {form.formState.errors.address && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label className="text-slate-200 font-medium text-sm uppercase tracking-wide">City</Label>
              <Input
                {...form.register("city")}
                placeholder="Los Angeles"
                className="modern-input h-12 text-slate-200 placeholder-slate-400 rounded-xl"
              />
              {form.formState.errors.city && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label className="text-slate-200 font-medium text-sm uppercase tracking-wide">State</Label>
              <Select onValueChange={(value) => form.setValue("state", value)}>
                <SelectTrigger className="modern-input h-12 text-slate-200 rounded-xl">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value} className="text-slate-200 focus:bg-slate-700">
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.state && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  {form.formState.errors.state.message}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <Label className="text-slate-200 font-medium text-sm uppercase tracking-wide">ZIP Code</Label>
              <Input
                {...form.register("zipCode")}
                placeholder="90210"
                className="modern-input h-12 text-slate-200 placeholder-slate-400 rounded-xl"
              />
              {form.formState.errors.zipCode && (
                <p className="text-red-400 text-sm mt-2 flex items-center">
                  <X className="h-3 w-3 mr-1" />
                  {form.formState.errors.zipCode.message}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <Button
              type="submit"
              disabled={searchMutation.isPending}
              className="flex-1 btn-primary-gradient text-white font-bold py-4 px-8 rounded-xl h-14 text-lg transition-all duration-300"
            >
              <Search className="mr-3 h-5 w-5" />
              {searchMutation.isPending ? "Analyzing Property..." : "Analyze Property"}
            </Button>
            <Button
              type="button"
              onClick={handleClear}
              className="btn-secondary-gradient text-slate-300 font-medium py-4 px-8 rounded-xl h-14 transition-all duration-300"
            >
              <X className="mr-2 h-4 w-4" />
              Clear Form
            </Button>
          </div>
        </form>
        
        <div className="mt-8 pt-8 border-t border-slate-700/30">
          <div className="flex items-center justify-center space-x-8 text-slate-400 text-sm">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
              Property Details
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Market Analysis
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Comparable Sales
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
