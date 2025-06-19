import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { propertySearchSchema } from "@shared/schema";
import { z } from "zod";
import { analyzePropertyWithAI } from "./ai-analysis";

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
      
      const property = await storage.getPropertyById(id);
      
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const analysis = await analyzePropertyWithAI(property);
      res.json(analysis);
    } catch (error) {
      console.error('AI Analysis error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze property" 
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
