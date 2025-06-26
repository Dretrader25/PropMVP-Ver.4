import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { propertySearchSchema } from "@shared/schema";
import { z } from "zod";
import { analyzePropertyWithAI } from "./ai-analysis";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Protected property search endpoint
  app.post("/api/properties/search", isAuthenticated, async (req, res) => {
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

  // Protected get property by ID
  app.get("/api/properties/:id", isAuthenticated, async (req, res) => {
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

  // Protected export property data as JSON
  app.get("/api/properties/:id/export", isAuthenticated, async (req, res) => {
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

  // Protected AI Analysis endpoint
  app.post("/api/properties/:id/analyze", isAuthenticated, async (req, res) => {
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

  // Protected get all properties for selection
  app.get("/api/properties", isAuthenticated, async (req, res) => {
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
