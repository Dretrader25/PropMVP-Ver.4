import { Property } from "@shared/schema";
import axios from "axios";

// Define a simple structure for the data we want to extract
export interface ExternalPropertyData {
  externalImageURL?: string;
  fullAddress?: string;
  propertyType?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  lotSize?: string; // Or a more structured type if available
  yearBuilt?: number;
  source: "zillow" | "rentcast" | "none";
}

const ZILLOW_BRIDGE_API_TOKEN = "6baca547742c6f96a6ff71b138424f21"; // Provided in problem
const RENTCAST_API_KEY = "ffd58db854ff4d3199fc9a848ac606b0"; // Provided in problem

/**
 * Fetches property data from the Zillow Bridge API.
 * Note: Specific query parameters for address are assumed based on common practices.
 * The provided test URL is a generic listing dump.
 */
export async function fetchZillowData(property: Property): Promise<ExternalPropertyData | null> {
  const { address, city, state, zipCode } = property;
  // Assuming query parameter names. These might need adjustment based on actual Zillow API docs.
  // The base URL might also be different for specific property lookups vs. general listings.
  const zillowApiUrl = `https://api.bridgedataoutput.com/api/v2/listings`;

  try {
    console.log(`Fetching Zillow data for: ${address}, ${city}, ${state} ${zipCode}`);
    const response = await axios.get(zillowApiUrl, {
      params: {
        access_token: ZILLOW_BRIDGE_API_TOKEN,
        // Assuming address components can be used as query params.
        // Exact names like 'address', 'city', 'state', 'postalcode' are educated guesses.
        // The API might require a single 'query' param or specific fields.
        // For the test API, it just dumps listings, so we'd have to filter client-side or find a better endpoint.
        // For now, let's simulate a lookup by trying to find a match in the first few results of the test API.
        // This is NOT how a production system would work but is a way to use the provided test URL.
        // A real system would use specific lookup parameters.
        limit: 20 // Fetch a few records to try and find a match.
      }
    });

    if (response.data && response.data.success && Array.isArray(response.data.bundle)) {
      // Try to find a property that loosely matches the address. This is highly speculative with the test API.
      const listings = response.data.bundle;
      const targetAddressLower = address.toLowerCase();
      const targetZip = zipCode;

      const foundListing = listings.find((item: any) => {
        const itemAddress = item.UnparsedAddress || `${item.StreetNumber || ''} ${item.StreetName || ''}`.trim();
        return (itemAddress && itemAddress.toLowerCase().includes(targetAddressLower) && item.PostalCode === targetZip) ||
               (item.StreetName && address.toLowerCase().includes(item.StreetName.toLowerCase()) && item.PostalCode === targetZip);
      });

      if (foundListing) {
        console.log("Zillow data found:", foundListing.ListingKey);
        const imageURL = foundListing.Media?.find((m: any) => m.MediaCategory === "Photo")?.MediaURL;

        let beds = foundListing.BedroomsTotal !== null ? Number(foundListing.BedroomsTotal) : undefined;
        let baths = foundListing.BathroomsTotalDecimal !== null ? Number(foundListing.BathroomsTotalDecimal) : undefined;
        let sqft = foundListing.LivingArea !== null ? Number(foundListing.LivingArea) : undefined;
        if (foundListing.LivingAreaUnits && foundListing.LivingAreaUnits !== 'SquareFeet' && sqft) {
            // Basic conversion attempt if not in SqFt, highly simplified
            if (foundListing.LivingAreaUnits === 'SquareMeters') sqft = Math.round(sqft * 10.7639);
            else console.warn(`Unrecognized LivingAreaUnits: ${foundListing.LivingAreaUnits}`);
        }


        return {
          externalImageURL: imageURL,
          fullAddress: foundListing.UnparsedAddress || `${foundListing.StreetNumber || ''} ${foundListing.StreetName || ''}, ${foundListing.City || ''}, ${foundListing.StateOrProvince || ''} ${foundListing.PostalCode || ''}`.trim(),
          propertyType: foundListing.PropertySubType || foundListing.PropertyType,
          beds: beds,
          baths: baths,
          sqft: sqft,
          lotSize: typeof foundListing.LotSizeAcres === 'number' ? `${foundListing.LotSizeAcres} acres` : foundListing.LotSizeAcres,
          yearBuilt: foundListing.YearBuilt !== null ? Number(foundListing.YearBuilt) : undefined,
          source: "zillow",
        };
      } else {
        console.log("No matching Zillow listing found in the sample data for:", address);
      }
    } else {
      console.warn("Zillow API response not successful or bundle missing:", response.data);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching Zillow data:", error.response?.status, error.response?.data);
    } else {
      console.error("Error fetching Zillow data:", error);
    }
  }
  return null;
}

/**
 * Fetches property data from the Rentcast API.
 * Placeholder: Actual implementation depends on Rentcast API documentation, which was inaccessible.
 */
export async function fetchRentcastData(property: Property): Promise<ExternalPropertyData | null> {
  const { address, city, state, zipCode } = property;
  // const rentcastApiUrl = `https://api.rentcast.io/v1/properties`; // Hypothetical
  console.log(`Attempting to fetch Rentcast data for: ${address}, ${city}, ${state} ${zipCode}`);
  console.warn("Rentcast API integration is a placeholder due to inaccessible documentation.");

  // Example of how it *might* be called:
  /*
  try {
    const response = await axios.get(rentcastApiUrl, {
      headers: { "X-Api-Key": RENTCAST_API_KEY },
      params: {
        address: `${address}, ${city}, ${state} ${zipCode}`
        // Or separate params: street: address, city: city, state: state, zip: zipCode
      }
    });

    if (response.data && response.data.length > 0) { // Assuming it returns an array of properties
      const propertyData = response.data[0]; // Take the first match
      console.log("Rentcast data found for:", address);
      return {
        externalImageURL: propertyData.images?.[0]?.url, // Highly speculative field names
        fullAddress: propertyData.formattedAddress,
        propertyType: propertyData.propertyType,
        beds: propertyData.bedrooms,
        baths: propertyData.bathrooms,
        sqft: propertyData.squareFootage,
        lotSize: propertyData.lotSize,
        yearBuilt: propertyData.yearBuilt,
        source: "rentcast",
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching Rentcast data:", error.response?.status, error.response?.data);
    } else {
      console.error("Error fetching Rentcast data:", error);
    }
  }
  */
  return null;
}
