import { properties, comparableSales, marketMetrics, type Property, type ComparableSale, type MarketMetrics, type PropertyWithDetails, type PropertySearch } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  searchProperty(searchData: PropertySearch): Promise<PropertyWithDetails | null>;
  getPropertyById(id: number): Promise<PropertyWithDetails | null>;
  createProperty(propertyData: PropertySearch): Promise<PropertyWithDetails>;
}

export class DatabaseStorage implements IStorage {
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

  async createProperty(propertyData: PropertySearch): Promise<PropertyWithDetails> {
    // Generate property details with realistic data
    const propertyDetails = {
      address: propertyData.address,
      city: propertyData.city,
      state: propertyData.state,
      zipCode: propertyData.zipCode,
      beds: Math.floor(Math.random() * 4) + 2, // 2-5 beds
      baths: (Math.floor(Math.random() * 3) + 1.5).toString(), // 1.5-4.5 baths
      sqft: Math.floor(Math.random() * 2000) + 1500, // 1500-3500 sqft
      yearBuilt: Math.floor(Math.random() * 50) + 1970, // 1970-2020
      propertyType: "Single Family",
      lotSize: "0.2 acres",
      parking: "2-car garage",
      hasPool: Math.random() > 0.5,
      hoaFees: Math.random() > 0.7 ? (Math.floor(Math.random() * 200) + 50).toString() : "0.00",
      listPrice: (Math.floor(Math.random() * 1000000) + 500000).toString(),
      listingStatus: Math.random() > 0.3 ? "For Sale" : "Not Listed",
      daysOnMarket: Math.floor(Math.random() * 90) + 1,
      pricePerSqft: "400.00",
      lastSalePrice: (Math.floor(Math.random() * 800000) + 400000).toString(),
      lastSaleDate: "2020-06-15",
    };

    // Insert property into database
    const [property] = await db
      .insert(properties)
      .values(propertyDetails)
      .returning();

    // Generate and insert comparable sales
    const comparablesData = [
      {
        propertyId: property.id,
        address: `${Math.floor(Math.random() * 9999)} ${propertyData.city} Street`,
        salePrice: (Math.floor(Math.random() * 500000) + 750000).toString(),
        beds: Math.floor(Math.random() * 3) + 3,
        baths: (Math.floor(Math.random() * 2) + 2).toString(),
        sqft: Math.floor(Math.random() * 1000) + 2000,
        pricePerSqft: "425.00",
        saleDate: "Nov 2023",
      },
      {
        propertyId: property.id,
        address: `${Math.floor(Math.random() * 9999)} ${propertyData.city} Avenue`,
        salePrice: (Math.floor(Math.random() * 500000) + 800000).toString(),
        beds: Math.floor(Math.random() * 3) + 3,
        baths: (Math.floor(Math.random() * 2) + 2.5).toString(),
        sqft: Math.floor(Math.random() * 1000) + 2200,
        pricePerSqft: "435.00",
        saleDate: "Oct 2023",
      },
    ];

    const insertedComparables = await db
      .insert(comparableSales)
      .values(comparablesData)
      .returning();

    // Generate and insert market metrics
    const metricsData = {
      propertyId: property.id,
      avgDaysOnMarket: Math.floor(Math.random() * 60) + 30,
      medianSalePrice: (Math.floor(Math.random() * 400000) + 900000).toString(),
      avgPricePerSqft: (Math.floor(Math.random() * 100) + 400).toString(),
      priceAppreciation: (Math.random() * 15 + 5).toFixed(1),
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
  }
}

export const storage = new DatabaseStorage();
