import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { PropertyWithDetails, propertySearchSchema } from "@shared/schema";
import { z } from "zod";
import { analyzePropertyWithAI, AIPropertyAnalysis } from "./ai-analysis";
import { fetchZillowData, fetchRentcastData, ExternalPropertyData } from "./external-property-apis";

export async function registerRoutes(app: Express): Promise<Server> {
  // Property search endpoint
  app.post("/api/properties/search", async (req, res) => {
    try {
      const searchData = propertySearchSchema.parse(req.body);
      const property = await storage.searchProperty(searchData);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid search data", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get property by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Export property data as JSON
  app.get("/api/properties/:id/export", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      const property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="property-report.json"');
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Analysis endpoint
  app.post("/api/properties/:id/analyze", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid property ID" });
      }
      
      let property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }

      let externalData: ExternalPropertyData | null = null;
      let augmentedProperty: PropertyWithDetails = { ...property }; // Create a mutable copy

      // Attempt to fetch data from Zillow
      if (property) { // Ensure property is not null before trying to fetch
        externalData = await fetchZillowData(property);
      }

      // If Zillow fails or doesn't provide an image, try Rentcast
      if (property && (!externalData || !externalData.externalImageURL)) {
        const rentcastData = await fetchRentcastData(property);
        if (rentcastData && rentcastData.externalImageURL) { // Prioritize Rentcast if it has an image and Zillow didn't
          externalData = rentcastData;
        } else if (rentcastData && !externalData) { // If Zillow failed completely, use Rentcast data
          externalData = rentcastData;
        }
      }
      
      let dataSource = "local";
      if (externalData) {
        dataSource = externalData.source;
        // Augment property data
        augmentedProperty.address = externalData.fullAddress || augmentedProperty.address;
        augmentedProperty.propertyType = externalData.propertyType || augmentedProperty.propertyType;
        augmentedProperty.beds = externalData.beds ?? augmentedProperty.beds;
        // Ensure baths is handled correctly as it's decimal in schema
        const bathsValue = externalData.baths !== undefined ? String(externalData.baths) : augmentedProperty.baths;
        augmentedProperty.baths = bathsValue ? bathsValue : null;

        augmentedProperty.sqft = externalData.sqft ?? augmentedProperty.sqft;
        augmentedProperty.lotSize = externalData.lotSize || augmentedProperty.lotSize;
        augmentedProperty.yearBuilt = externalData.yearBuilt ?? augmentedProperty.yearBuilt;
        // Add externalImageURL to the property object if it's not part of the schema
        (augmentedProperty as any).externalImageURL = externalData.externalImageURL;
      }

      const aiAnalysis: AIPropertyAnalysis = await analyzePropertyWithAI(augmentedProperty);

      res.json({
        aiAnalysis,
        property: augmentedProperty, // Send the augmented property data
        dataSource, // Indicate where the primary external data came from
        externalImageURL: (augmentedProperty as any).externalImageURL // Explicitly include for frontend
      });

    } catch (error) {
      console.error('AI Analysis or External API error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze property or fetch external data"
      });
    }
  });

  // Get all properties for selection
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getAllProperties();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
