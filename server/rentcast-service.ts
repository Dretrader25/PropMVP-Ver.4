import { PropertySearch, PropertyWithDetails } from "@shared/schema";

// Rentcast API interfaces - Updated to match actual API response
interface RentcastPropertyDetails {
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFootage?: number;
  yearBuilt?: number;
  propertyType?: string;
  lotSizeSquareFeet?: number;
  rent?: number;
  rentHigh?: number;
  rentLow?: number;
  avm?: number;
  avmHigh?: number;
  avmLow?: number;
  lastSaleDate?: string;
  lastSalePrice?: number;
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
      address: `${address}, ${city}, ${state}${zipCode ? ' ' + zipCode : ''}`,
    };

    return this.makeRequest<RentcastPropertyDetails>('/avm/rent/long-term', params);
  }

  async getComparables(address: string, city: string, state: string, zipCode?: string): Promise<RentcastComparable[]> {
    const params: Record<string, string> = {
      address: `${address}, ${city}, ${state}${zipCode ? ' ' + zipCode : ''}`,
      compCount: '10',
    };

    try {
      const response = await this.makeRequest<RentcastComparable[]>('/avm/rent/long-term/comparables', params);
      return Array.isArray(response) ? response : [];
    } catch (error) {
      console.warn('Comparables not found, returning empty array');
      return [];
    }
  }

  async getMarketData(city: string, state: string, zipCode?: string): Promise<RentcastMarketData> {
    const params: Record<string, string> = {
      city,
      state,
    };
    
    if (zipCode) {
      params.zipCode = zipCode;
    }

    try {
      return await this.makeRequest<RentcastMarketData>('/markets/rent', params);
    } catch (error) {
      // Return default market data if API call fails
      return {
        city,
        state,
        zipCode: zipCode || '',
        medianRent: 2500,
        medianSalePrice: 650000,
        averageDaysOnMarket: 30,
        priceAppreciation: 5.5,
        rentAppreciation: 3.2,
      };
    }
  }

  // Convert Rentcast data to our internal format with proper error handling
  convertToPropertyWithDetails(
    rentcastProperty: RentcastPropertyDetails, 
    comparables: RentcastComparable[], 
    marketData: RentcastMarketData,
    propertyId: number
  ): Omit<PropertyWithDetails, 'id'> {
    const lotSizeAcres = rentcastProperty.lotSizeSquareFeet 
      ? (rentcastProperty.lotSizeSquareFeet / 43560).toFixed(2) + ' acres'
      : 'N/A';

    const listPrice = rentcastProperty.avm || 0;
    const sqft = rentcastProperty.squareFootage || 1500;

    return {
      address: rentcastProperty.address || 'Unknown Address',
      city: rentcastProperty.city || 'Unknown City',
      state: rentcastProperty.state || 'CA',
      zipCode: rentcastProperty.zipCode || '00000',
      beds: rentcastProperty.bedrooms || 3,
      baths: (rentcastProperty.bathrooms || 2).toString(),
      sqft: sqft,
      yearBuilt: rentcastProperty.yearBuilt || 1990,
      propertyType: rentcastProperty.propertyType || 'Single Family',
      lotSize: lotSizeAcres,
      parking: '2-car garage',
      hasPool: false,
      hoaFees: '0.00',
      listPrice: listPrice.toString(),
      listingStatus: 'For Sale',
      daysOnMarket: marketData.averageDaysOnMarket,
      pricePerSqft: sqft > 0 ? (listPrice / sqft).toFixed(0) : '400',
      lastSalePrice: (rentcastProperty.lastSalePrice || 0).toString(),
      lastSaleDate: rentcastProperty.lastSaleDate || 'N/A',
      createdAt: new Date(),
      comparables: comparables.map(comp => ({
        id: 0,
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
        id: 0,
        propertyId,
        avgDaysOnMarket: marketData.averageDaysOnMarket,
        medianSalePrice: marketData.medianSalePrice.toString(),
        avgPricePerSqft: sqft > 0 ? (marketData.medianSalePrice / sqft).toFixed(0) : '400',
        priceAppreciation: marketData.priceAppreciation.toFixed(1),
      }
    };
  }
}

export const rentcastService = new RentcastService();