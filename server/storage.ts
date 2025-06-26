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
      // Fetch real property data from Rentcast API
      const [rentcastProperty, rentcastComparables, rentcastMarketData] = await Promise.all([
        rentcastService.getPropertyDetails(propertyData.address, propertyData.city, propertyData.state, propertyData.zipCode),
        rentcastService.getComparables(propertyData.address, propertyData.city, propertyData.state, propertyData.zipCode),
        rentcastService.getMarketData(propertyData.city, propertyData.state, propertyData.zipCode)
      ]);

      // Insert property into database
      const [property] = await db
        .insert(properties)
        .values({
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
          daysOnMarket: rentcastMarketData.averageDaysOnMarket,
          pricePerSqft: (rentcastProperty.avm?.pricePerSquareFoot || 0).toString(),
          lastSalePrice: (rentcastProperty.lastSale?.price || 0).toString(),
          lastSaleDate: rentcastProperty.lastSale?.date || 'N/A',
        })
        .returning();

      // Insert comparable sales
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

      const insertedComparables = await db
        .insert(comparableSales)
        .values(comparablesData)
        .returning();

      // Insert market metrics
      const metricsData = {
        propertyId: property.id,
        avgDaysOnMarket: rentcastMarketData.averageDaysOnMarket,
        medianSalePrice: rentcastMarketData.medianSalePrice.toString(),
        avgPricePerSqft: (rentcastMarketData.medianSalePrice / rentcastProperty.squareFootage).toFixed(0),
        priceAppreciation: rentcastMarketData.priceAppreciation.toFixed(1),
      };

      const [insertedMetrics] = await db
        .insert(marketMetrics)
        .values(metricsData)
        .returning();

      return {
        ...property,
        comparables: insertedComparables,
        marketMetrics: insertedMetrics,
      };
    } catch (error) {
      console.error('Error fetching property data from Rentcast:', error);
      throw new Error('Failed to fetch property data. Please check the address and try again.');
    }
  }
}

export const storage = new DatabaseStorage();
