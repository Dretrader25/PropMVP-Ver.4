import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { propertySearchSchema, type PropertySearch, type PropertyWithDetails } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
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
    <Card className="card-bg border-slate-700/50 mb-8">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-100 mb-2">Property Lead Enrichment</h2>
          <p className="text-slate-400">Enter a property address to get comprehensive property details, market analysis, and owner information</p>
        </div>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="text-slate-300 mb-2">Street Address</Label>
              <Input
                {...form.register("address")}
                placeholder="123 Main Street"
                className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400"
              />
              {form.formState.errors.address && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.address.message}</p>
              )}
            </div>
            
            <div>
              <Label className="text-slate-300 mb-2">City</Label>
              <Input
                {...form.register("city")}
                placeholder="Los Angeles"
                className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400"
              />
              {form.formState.errors.city && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.city.message}</p>
              )}
            </div>
            
            <div>
              <Label className="text-slate-300 mb-2">State</Label>
              <Select onValueChange={(value) => form.setValue("state", value)}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600/50 text-slate-200">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.state && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.state.message}</p>
              )}
            </div>
            
            <div>
              <Label className="text-slate-300 mb-2">ZIP Code</Label>
              <Input
                {...form.register("zipCode")}
                placeholder="90210"
                className="bg-slate-700/50 border-slate-600/50 text-slate-200 placeholder-slate-400"
              />
              {form.formState.errors.zipCode && (
                <p className="text-red-400 text-sm mt-1">{form.formState.errors.zipCode.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              type="submit"
              disabled={searchMutation.isPending}
              className="flex-1 btn-primary-gradient text-white font-semibold py-4 px-6 hover:scale-105 transition-transform"
            >
              <Search className="mr-2 h-4 w-4" />
              {searchMutation.isPending ? "Searching..." : "Search Property"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="bg-slate-700/50 border-slate-600/50 text-slate-300 py-4 px-6"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
