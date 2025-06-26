import { PropertySearch, PropertyWithDetails } from "@shared/schema";

// Rentcast API interfaces
interface RentcastPropertyDetails {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  yearBuilt: number;
  propertyType: string;
  lotSizeSquareFeet?: number;
  amenities?: string[];
  rent?: {
    estimate: number;
    low: number;
    high: number;
    pricePerSquareFoot: number;
  };
  avm?: {
    value: number;
    low: number;
    high: number;
    pricePerSquareFoot: number;
  };
  lastSale?: {
    date: string;
    price: number;
  };
}

interface RentcastComparable {
  id: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  squareFootage: number;
  saleDate: string;
  salePrice: number;
  pricePerSquareFoot: number;
  distanceMiles: number;
}

interface RentcastMarketData {
  city: string;
  state: string;
  zipCode: string;
  medianRent: number;
  medianSalePrice: number;
  averageDaysOnMarket: number;
  priceAppreciation: number;
  rentAppreciation: number;
}

class RentcastService {
  private apiKey: string;
  private baseUrl = 'https://api.rentcast.io/v1';

  constructor() {
    this.apiKey = process.env.RENTCAST_API_KEY!;
    if (!this.apiKey) {
      throw new Error('RENTCAST_API_KEY environment variable is required');
    }
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString(), {
      headers: {
        'X-Api-Key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Rentcast API error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
  }

  async getPropertyDetails(address: string, city: string, state: string, zipCode?: string): Promise<RentcastPropertyDetails> {
    const params: Record<string, string> = {
      address,
      city,
      state,
    };
    
    if (zipCode) {
      params.zipCode = zipCode;
    }

    return this.makeRequest<RentcastPropertyDetails>('/properties', params);
  }

  async getComparables(address: string, city: string, state: string, zipCode?: string): Promise<RentcastComparable[]> {
    const params: Record<string, string> = {
      address,
      city,
      state,
      limit: '10',
    };
    
    if (zipCode) {
      params.zipCode = zipCode;
    }

    const response = await this.makeRequest<{ comparables: RentcastComparable[] }>('/properties/comparables', params);
    return response.comparables || [];
  }

  async getMarketData(city: string, state: string, zipCode?: string): Promise<RentcastMarketData> {
    const params: Record<string, string> = {
      city,
      state,
    };
    
    if (zipCode) {
      params.zipCode = zipCode;
    }

    return this.makeRequest<RentcastMarketData>('/markets', params);
  }

  // Convert Rentcast data to our internal format
  convertToPropertyWithDetails(
    rentcastProperty: RentcastPropertyDetails, 
    comparables: RentcastComparable[], 
    marketData: RentcastMarketData,
    propertyId: number
  ): Omit<PropertyWithDetails, 'id'> {
    const lotSizeAcres = rentcastProperty.lotSizeSquareFeet 
      ? (rentcastProperty.lotSizeSquareFeet / 43560).toFixed(2) + ' acres'
      : 'N/A';

    const listPrice = rentcastProperty.avm?.value || 0;
    const rentEstimate = rentcastProperty.rent?.estimate || 0;

    return {
      address: rentcastProperty.address,
      city: rentcastProperty.city,
      state: rentcastProperty.state,
      zipCode: rentcastProperty.zipCode,
      beds: rentcastProperty.bedrooms,
      baths: rentcastProperty.bathrooms.toString(),
      sqft: rentcastProperty.squareFootage,
      yearBuilt: rentcastProperty.yearBuilt,
      propertyType: rentcastProperty.propertyType,
      lotSize: lotSizeAcres,
      parking: rentcastProperty.amenities?.includes('garage') ? '2-car garage' : 'Street parking',
      hasPool: rentcastProperty.amenities?.includes('pool') || false,
      hoaFees: '0.00', // Not available from Rentcast
      listPrice: listPrice.toString(),
      listingStatus: 'For Sale', // Default status
      daysOnMarket: marketData.averageDaysOnMarket,
      pricePerSqft: (rentcastProperty.avm?.pricePerSquareFoot || 0).toString(),
      lastSalePrice: (rentcastProperty.lastSale?.price || 0).toString(),
      lastSaleDate: rentcastProperty.lastSale?.date || 'N/A',
      createdAt: new Date(),
      comparables: comparables.map(comp => ({
        id: 0, // Will be set by database
        propertyId,
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
      })),
      marketMetrics: {
        id: 0, // Will be set by database
        propertyId,
        avgDaysOnMarket: marketData.averageDaysOnMarket,
        medianSalePrice: marketData.medianSalePrice.toString(),
        avgPricePerSqft: (marketData.medianSalePrice / rentcastProperty.squareFootage).toFixed(0),
        priceAppreciation: marketData.priceAppreciation.toFixed(1),
      }
    };
  }
}

export const rentcastService = new RentcastService();