import { properties, comparableSales, marketMetrics, type Property, type ComparableSale, type MarketMetrics, type PropertyWithDetails, type PropertySearch } from "@shared/schema";

export interface IStorage {
  searchProperty(searchData: PropertySearch): Promise<PropertyWithDetails | null>;
  getPropertyById(id: number): Promise<PropertyWithDetails | null>;
  createProperty(propertyData: PropertySearch): Promise<PropertyWithDetails>;
}

export class MemStorage implements IStorage {
  private properties: Map<number, Property>;
  private comparables: Map<number, ComparableSale[]>;
  private metrics: Map<number, MarketMetrics>;
  private currentId: number;

  constructor() {
    this.properties = new Map();
    this.comparables = new Map();
    this.metrics = new Map();
    this.currentId = 1;
    this.seedMockData();
  }

  private seedMockData() {
    // Mock property data
    const mockProperty: Property = {
      id: 1,
      address: "1847 Ocean Drive",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
      beds: 4,
      baths: "3.5",
      sqft: 2850,
      yearBuilt: 1998,
      propertyType: "Single Family",
      lotSize: "0.25 acres",
      parking: "2-car garage",
      hasPool: true,
      hoaFees: "125.00",
      listPrice: "1250000.00",
      listingStatus: "For Sale",
      daysOnMarket: 34,
      pricePerSqft: "438.60",
      lastSalePrice: "985000.00",
      lastSaleDate: "2019-08-15",
      createdAt: new Date(),
    };

    const mockComparables: ComparableSale[] = [
      {
        id: 1,
        propertyId: 1,
        address: "1823 Ocean Drive",
        salePrice: "1185000.00",
        beds: 4,
        baths: "3.0",
        sqft: 2650,
        pricePerSqft: "447.17",
        saleDate: "Oct 2023",
      },
      {
        id: 2,
        propertyId: 1,
        address: "1891 Palm Avenue",
        salePrice: "1295000.00",
        beds: 4,
        baths: "3.5",
        sqft: 2920,
        pricePerSqft: "443.84",
        saleDate: "Sep 2023",
      },
      {
        id: 3,
        propertyId: 1,
        address: "1756 Coastal Way",
        salePrice: "1125000.00",
        beds: 3,
        baths: "2.5",
        sqft: 2480,
        pricePerSqft: "453.23",
        saleDate: "Aug 2023",
      },
    ];

    const mockMetrics: MarketMetrics = {
      id: 1,
      propertyId: 1,
      avgDaysOnMarket: 42,
      medianSalePrice: "1200000.00",
      avgPricePerSqft: "445.00",
      priceAppreciation: "8.50",
    };

    this.properties.set(1, mockProperty);
    this.comparables.set(1, mockComparables);
    this.metrics.set(1, mockMetrics);
    this.currentId = 2;
  }

  async searchProperty(searchData: PropertySearch): Promise<PropertyWithDetails | null> {
    // In a real implementation, this would geocode and search external APIs
    // For now, return mock data if the address contains certain keywords
    const addressLower = searchData.address.toLowerCase();
    
    if (addressLower.includes("ocean") || addressLower.includes("1847") || 
        searchData.city.toLowerCase().includes("los angeles") || 
        searchData.zipCode === "90210") {
      
      const property = this.properties.get(1);
      if (property) {
        const comparables = this.comparables.get(1) || [];
        const marketMetrics = this.metrics.get(1) || null;
        
        return {
          ...property,
          comparables,
          marketMetrics,
        };
      }
    }

    // Create a new mock property for any other address
    return this.createProperty(searchData);
  }

  async getPropertyById(id: number): Promise<PropertyWithDetails | null> {
    const property = this.properties.get(id);
    if (!property) return null;

    const comparables = this.comparables.get(id) || [];
    const marketMetrics = this.metrics.get(id) || null;

    return {
      ...property,
      comparables,
      marketMetrics,
    };
  }

  async createProperty(propertyData: PropertySearch): Promise<PropertyWithDetails> {
    const id = this.currentId++;
    
    // Generate mock property details
    const property: Property = {
      id,
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
      createdAt: new Date(),
    };

    // Generate mock comparables
    const mockComparables: ComparableSale[] = [
      {
        id: id * 10 + 1,
        propertyId: id,
        address: `${Math.floor(Math.random() * 9999)} ${propertyData.city} Street`,
        salePrice: (Math.floor(Math.random() * 500000) + 750000).toString(),
        beds: Math.floor(Math.random() * 3) + 3,
        baths: (Math.floor(Math.random() * 2) + 2).toString(),
        sqft: Math.floor(Math.random() * 1000) + 2000,
        pricePerSqft: "425.00",
        saleDate: "Nov 2023",
      },
      {
        id: id * 10 + 2,
        propertyId: id,
        address: `${Math.floor(Math.random() * 9999)} ${propertyData.city} Avenue`,
        salePrice: (Math.floor(Math.random() * 500000) + 800000).toString(),
        beds: Math.floor(Math.random() * 3) + 3,
        baths: (Math.floor(Math.random() * 2) + 2.5).toString(),
        sqft: Math.floor(Math.random() * 1000) + 2200,
        pricePerSqft: "435.00",
        saleDate: "Oct 2023",
      },
    ];

    // Generate mock market metrics
    const mockMetrics: MarketMetrics = {
      id: id,
      propertyId: id,
      avgDaysOnMarket: Math.floor(Math.random() * 60) + 30,
      medianSalePrice: (Math.floor(Math.random() * 400000) + 900000).toString(),
      avgPricePerSqft: (Math.floor(Math.random() * 100) + 400).toString(),
      priceAppreciation: (Math.random() * 15 + 5).toFixed(1),
    };

    this.properties.set(id, property);
    this.comparables.set(id, mockComparables);
    this.metrics.set(id, mockMetrics);

    return {
      ...property,
      comparables: mockComparables,
      marketMetrics: mockMetrics,
    };
  }
}

export const storage = new MemStorage();
