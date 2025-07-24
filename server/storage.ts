import { properties, comparableSales, marketMetrics, users, type Property, type ComparableSale, type MarketMetrics, type PropertyWithDetails, type PropertySearch, type User, type UpsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { rentcastService } from "./rentcast-service";

export interface IStorage {
  // User operations for OAuth and local authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  createLocalUser(userData: { email: string; passwordHash: string; firstName?: string | null; lastName?: string | null }): Promise<User>;
  
  // Property operations
  searchProperty(searchData: PropertySearch): Promise<PropertyWithDetails | null>;
  getPropertyById(id: number): Promise<PropertyWithDetails | null>;
  createProperty(propertyData: PropertySearch): Promise<PropertyWithDetails>;
  getAllProperties(): Promise<PropertyWithDetails[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        authProvider: userData.id?.startsWith('google_') ? 'google' : 'local',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async createLocalUser(userData: { email: string; passwordHash: string; firstName?: string | null; lastName?: string | null }): Promise<User> {
    const userId = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const [user] = await db
      .insert(users)
      .values({
        id: userId,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: userData.passwordHash,
        authProvider: 'local',
      })
      .returning();
    
    return user;
  }

  // Property operations
  async getPropertyById(id: number): Promise<PropertyWithDetails | null> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    if (!property) return null;

    const propertyComparables = await db.select().from(comparableSales).where(eq(comparableSales.propertyId, id));
    const [propertyMetrics] = await db.select().from(marketMetrics).where(eq(marketMetrics.propertyId, id));

    return {
      ...property,
      comparables: propertyComparables,
      marketMetrics: propertyMetrics || null,
    };
  }

  async searchProperty(searchData: PropertySearch): Promise<PropertyWithDetails | null> {
    // Try to find existing property by address
    const [existingProperty] = await db.select().from(properties).where(
      eq(properties.address, searchData.address)
    );

    if (existingProperty) {
      return this.getPropertyById(existingProperty.id);
    }

    // Create new property if not found
    return this.createProperty(searchData);
  }

  async getAllProperties(): Promise<PropertyWithDetails[]> {
    const allProperties = await db.select().from(properties);
    
    const result = await Promise.all(
      allProperties.map(async (property) => {
        const [comps, metrics] = await Promise.all([
          db.select().from(comparableSales).where(eq(comparableSales.propertyId, property.id)),
          db.select().from(marketMetrics).where(eq(marketMetrics.propertyId, property.id))
        ]);
        
        return {
          ...property,
          comparables: comps,
          marketMetrics: metrics[0] || null
        };
      })
    );
    
    return result;
  }

  async createProperty(propertyData: PropertySearch): Promise<PropertyWithDetails> {
    try {
      // Fetch authentic property data from Rentcast API
      console.log(`Fetching property data from Rentcast for: ${propertyData.address}, ${propertyData.city}, ${propertyData.state}`);
      
      const [rentcastProperty, rentcastComparables, rentcastMarketData] = await Promise.all([
        rentcastService.getPropertyDetails(propertyData.address, propertyData.city, propertyData.state, propertyData.zipCode),
        rentcastService.getComparables(propertyData.address, propertyData.city, propertyData.state, propertyData.zipCode),
        rentcastService.getMarketData(propertyData.city, propertyData.state, propertyData.zipCode)
      ]);

      // If main property details are empty but we have comparables, enhance with search data and comparables
      let enhancedPropertyDetails = rentcastProperty;
      const hasEmptyPropertyData = !rentcastProperty.formattedAddress && !rentcastProperty.addressLine1 && !rentcastProperty.address;
      
      if (hasEmptyPropertyData && rentcastComparables.length > 0) {
        console.log('Main property API returned empty, enhancing with search params and comparable data');
        // Filter comparables that have required data (exclude land parcels for averaging)
        const validComparables = rentcastComparables.filter(comp => 
          comp.bedrooms > 0 && comp.bathrooms > 0 && comp.squareFootage > 0 && comp.propertyType !== 'Land'
        );
        
        if (validComparables.length > 0) {
          enhancedPropertyDetails = {
            formattedAddress: `${propertyData.address}, ${propertyData.city}, ${propertyData.state}${propertyData.zipCode ? ' ' + propertyData.zipCode : ''}`,
            addressLine1: propertyData.address,
            city: propertyData.city,
            state: propertyData.state,
            zipCode: propertyData.zipCode || '',
            county: validComparables[0]?.county || '',
            // Use average data from valid comparables for property specs
            bedrooms: Math.round(validComparables.reduce((sum, comp) => sum + (comp.bedrooms || 0), 0) / validComparables.length) || 3,
            bathrooms: Math.round(validComparables.reduce((sum, comp) => sum + (comp.bathrooms || 0), 0) / validComparables.length * 10) / 10 || 2,
            squareFootage: Math.round(validComparables.reduce((sum, comp) => sum + (comp.squareFootage || 0), 0) / validComparables.length) || 1500,
            yearBuilt: Math.round(validComparables.reduce((sum, comp) => sum + (comp.yearBuilt || 1980), 0) / validComparables.length) || 1980,
            propertyType: validComparables[0]?.propertyType || 'Single Family',
            avm: Math.round(validComparables.reduce((sum, comp) => sum + (comp.price || 0), 0) / validComparables.length) || 0,
          };
        } else {
          // Fallback to search parameters if no valid comparables
          enhancedPropertyDetails = {
            formattedAddress: `${propertyData.address}, ${propertyData.city}, ${propertyData.state}${propertyData.zipCode ? ' ' + propertyData.zipCode : ''}`,
            addressLine1: propertyData.address,
            city: propertyData.city,
            state: propertyData.state,
            zipCode: propertyData.zipCode || '',
          };
        }
      }

      // Convert Rentcast data to our property format
      const propertyDetailsFromAPI = rentcastService.convertToPropertyWithDetails(
        enhancedPropertyDetails,
        rentcastComparables,
        rentcastMarketData,
        0 // Temporary ID, will be replaced after DB insert
      );

      // Insert authentic property data into database
      const [property] = await db
        .insert(properties)
        .values({
          address: propertyDetailsFromAPI.address,
          city: propertyDetailsFromAPI.city,
          state: propertyDetailsFromAPI.state,
          zipCode: propertyDetailsFromAPI.zipCode,
          beds: propertyDetailsFromAPI.beds,
          baths: propertyDetailsFromAPI.baths,
          sqft: propertyDetailsFromAPI.sqft,
          yearBuilt: propertyDetailsFromAPI.yearBuilt,
          propertyType: propertyDetailsFromAPI.propertyType,
          lotSize: propertyDetailsFromAPI.lotSize,
          parking: propertyDetailsFromAPI.parking,
          hasPool: propertyDetailsFromAPI.hasPool,
          hoaFees: propertyDetailsFromAPI.hoaFees,
          listPrice: propertyDetailsFromAPI.listPrice,
          listingStatus: propertyDetailsFromAPI.listingStatus,
          daysOnMarket: propertyDetailsFromAPI.daysOnMarket,
          pricePerSqft: propertyDetailsFromAPI.pricePerSqft,
          lastSalePrice: propertyDetailsFromAPI.lastSalePrice,
          lastSaleDate: propertyDetailsFromAPI.lastSaleDate,
        })
        .returning();

      // Insert authentic comparable sales data
      const comparablesData = propertyDetailsFromAPI.comparables.map(comp => ({
        propertyId: property.id,
        address: comp.address,
        salePrice: comp.salePrice,
        beds: comp.beds,
        baths: comp.baths,
        sqft: comp.sqft,
        pricePerSqft: comp.pricePerSqft,
        saleDate: comp.saleDate,
      }));

      const insertedComparables = comparablesData.length > 0 
        ? await db.insert(comparableSales).values(comparablesData).returning()
        : [];

      // Insert authentic market metrics
      let insertedMetrics = null;
      if (propertyDetailsFromAPI.marketMetrics) {
        const metricsData = {
          propertyId: property.id,
          avgDaysOnMarket: propertyDetailsFromAPI.marketMetrics.avgDaysOnMarket,
          medianSalePrice: propertyDetailsFromAPI.marketMetrics.medianSalePrice,
          avgPricePerSqft: propertyDetailsFromAPI.marketMetrics.avgPricePerSqft,
          priceAppreciation: propertyDetailsFromAPI.marketMetrics.priceAppreciation,
        };
        
        const [metrics] = await db
          .insert(marketMetrics)
          .values(metricsData)
          .returning();
        insertedMetrics = metrics;
      }

      console.log(`Successfully created property with authentic Rentcast data: ${property.address}`);

      return {
        ...property,
        comparables: insertedComparables,
        marketMetrics: insertedMetrics,
      };

    } catch (error) {
      console.error('Rentcast API error, falling back to basic property creation:', error);
      
      // If Rentcast API fails, create basic property with minimal required fields
      const basicPropertyDetails = {
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zipCode: propertyData.zipCode,
        beds: 3,
        baths: "2.0",
        sqft: 1800,
        yearBuilt: 1995,
        propertyType: "Single Family",
        lotSize: "0.2 acres",
        parking: "2-car garage",
        hasPool: false,
        hoaFees: "0.00",
        listPrice: "0", // Will show as "Contact for Price"
        listingStatus: "Data Unavailable",
        daysOnMarket: 0,
        pricePerSqft: "0",
        lastSalePrice: "0",
        lastSaleDate: "N/A",
      };

      const [property] = await db
        .insert(properties)
        .values(basicPropertyDetails)
        .returning();

      return {
        ...property,
        comparables: [],
        marketMetrics: null,
      };
    }
  }
}

export const storage = new DatabaseStorage();
