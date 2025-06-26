import { properties, comparableSales, marketMetrics, users, type Property, type ComparableSale, type MarketMetrics, type PropertyWithDetails, type PropertySearch, type User, type UpsertUser } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { rentcastService } from "./rentcast-service";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
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
      // Try to fetch real property data from Rentcast API
      let rentcastProperty: any = null;
      let rentcastComparables: any[] = [];
      let rentcastMarketData: any = null;
      let useRentcastData = false;

      try {
        if (process.env.RENTCAST_API_KEY && process.env.RENTCAST_API_KEY.length > 10) {
          [rentcastProperty, rentcastComparables, rentcastMarketData] = await Promise.all([
            rentcastService.getPropertyDetails(propertyData.address, propertyData.city, propertyData.state, propertyData.zipCode),
            rentcastService.getComparables(propertyData.address, propertyData.city, propertyData.state, propertyData.zipCode),
            rentcastService.getMarketData(propertyData.city, propertyData.state, propertyData.zipCode)
          ]);
          useRentcastData = true;
          console.log('Using authentic Rentcast data');
        }
      } catch (rentcastError) {
        console.error('Rentcast API error, property will be created with basic information only:', rentcastError);
        useRentcastData = false;
      }

      let propertyDetails;
      if (useRentcastData && rentcastProperty) {
        // Use authentic Rentcast data
        propertyDetails = {
          address: rentcastProperty.address,
          city: rentcastProperty.city,
          state: rentcastProperty.state,
          zipCode: rentcastProperty.zipCode,
          beds: rentcastProperty.bedrooms,
          baths: rentcastProperty.bathrooms.toString(),
          sqft: rentcastProperty.squareFootage,
          yearBuilt: rentcastProperty.yearBuilt,
          propertyType: rentcastProperty.propertyType,
          lotSize: rentcastProperty.lotSizeSquareFeet 
            ? (rentcastProperty.lotSizeSquareFeet / 43560).toFixed(2) + ' acres'
            : 'N/A',
          parking: rentcastProperty.amenities?.includes('garage') ? '2-car garage' : 'Street parking',
          hasPool: rentcastProperty.amenities?.includes('pool') || false,
          hoaFees: '0.00',
          listPrice: (rentcastProperty.avm?.value || 0).toString(),
          listingStatus: 'For Sale',
          daysOnMarket: rentcastMarketData?.averageDaysOnMarket || 30,
          pricePerSqft: (rentcastProperty.avm?.pricePerSquareFoot || 0).toString(),
          lastSalePrice: (rentcastProperty.lastSale?.price || 0).toString(),
          lastSaleDate: rentcastProperty.lastSale?.date || 'N/A',
        };
      } else {
        // Create basic property record for demonstration
        propertyDetails = {
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zipCode: propertyData.zipCode,
          beds: null,
          baths: null,
          sqft: null,
          yearBuilt: null,
          propertyType: 'Unknown',
          lotSize: 'N/A',
          parking: 'Unknown',
          hasPool: false,
          hoaFees: '0.00',
          listPrice: '0.00',
          listingStatus: 'Data Unavailable',
          daysOnMarket: 0,
          pricePerSqft: '0.00',
          lastSalePrice: '0.00',
          lastSaleDate: 'N/A',
        };
      }

      // Insert property into database
      const [property] = await db
        .insert(properties)
        .values(propertyDetails)
        .returning();

      // Handle comparable sales
      let insertedComparables: ComparableSale[] = [];
      if (useRentcastData && rentcastComparables && rentcastComparables.length > 0) {
        const comparablesData = rentcastComparables.map(comp => ({
          propertyId: property.id,
          address: comp.address,
          salePrice: comp.salePrice.toString(),
          beds: comp.bedrooms,
          baths: comp.bathrooms.toString(),
          sqft: comp.squareFootage,
          pricePerSqft: comp.pricePerSquareFoot.toString(),
          saleDate: new Date(comp.saleDate).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
        }));

        insertedComparables = await db
          .insert(comparableSales)
          .values(comparablesData)
          .returning();
      }

      // Handle market metrics
      let insertedMetrics = null;
      if (useRentcastData && rentcastMarketData) {
        const metricsData = {
          propertyId: property.id,
          avgDaysOnMarket: rentcastMarketData.averageDaysOnMarket,
          medianSalePrice: rentcastMarketData.medianSalePrice.toString(),
          avgPricePerSqft: (rentcastMarketData.medianSalePrice / (rentcastProperty?.squareFootage || 1)).toFixed(0),
          priceAppreciation: rentcastMarketData.priceAppreciation.toFixed(1),
        };

        [insertedMetrics] = await db
          .insert(marketMetrics)
          .values(metricsData)
          .returning();
      }

      return {
        ...property,
        comparables: insertedComparables,
        marketMetrics: insertedMetrics,
      };
    } catch (error) {
      console.error('Error creating property:', error);
      throw new Error('Failed to create property record. Please try again.');
    }
  }
}

export const storage = new DatabaseStorage();
