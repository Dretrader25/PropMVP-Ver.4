#!/usr/bin/env python3
"""
RentCast Market Statistics Service

This module provides functionality to fetch market statistics from RentCast API
including price trends, days on market (DOM), and rental trends for specific
zip codes or geographic areas.
"""

import os
import requests
import json
from typing import Dict, List, Optional, Union
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RentCastMarketService:
    """
    Service class for interacting with RentCast Market Statistics API
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """
        Initialize the RentCast Market Service
        
        Args:
            api_key: RentCast API key. If None, will try to get from environment
        """
        self.api_key = api_key or os.getenv('RENTCAST_API_KEY')
        self.base_url = "https://api.rentcast.io/v1"
        self.session = requests.Session()
        
        if not self.api_key:
            raise ValueError("RENTCAST_API_KEY is required. Set it as environment variable or pass directly.")
        
        # Set default headers
        self.session.headers.update({
            'Accept': 'application/json',
            'X-Api-Key': self.api_key
        })
    
    def get_market_stats(self, 
                        zip_code: str, 
                        data_type: str = "All", 
                        history_range: int = 12) -> Dict:
        """
        Fetch market statistics for a specific zip code
        
        Args:
            zip_code: 5-digit US zip code
            data_type: Type of data to retrieve ("All", "Sale", "Rental")
            history_range: Number of months of historical data (default: 12)
            
        Returns:
            Dictionary containing market statistics data
            
        Raises:
            requests.RequestException: If API request fails
            ValueError: If invalid parameters provided
        """
        
        # Validate zip code
        if not zip_code or len(zip_code) != 5 or not zip_code.isdigit():
            raise ValueError("zip_code must be a valid 5-digit US zip code")
        
        # Validate data type
        valid_data_types = ["All", "Sale", "Rental"]
        if data_type not in valid_data_types:
            raise ValueError(f"data_type must be one of: {valid_data_types}")
        
        # Validate history range
        if not isinstance(history_range, int) or history_range < 1 or history_range > 60:
            raise ValueError("history_range must be an integer between 1 and 60")
        
        endpoint = f"{self.base_url}/markets"
        params = {
            'zipCode': zip_code,
            'dataType': data_type,
            'historyRange': history_range
        }
        
        try:
            response = self.session.get(endpoint, params=params)
            response.raise_for_status()
            return response.json()
            
        except requests.exceptions.HTTPError as e:
            if response.status_code == 401:
                raise requests.RequestException("Invalid API key or unauthorized access")
            elif response.status_code == 404:
                raise requests.RequestException(f"No market data found for zip code {zip_code}")
            elif response.status_code == 429:
                raise requests.RequestException("Rate limit exceeded. Please try again later.")
            else:
                raise requests.RequestException(f"API request failed: {e}")
                
        except requests.exceptions.RequestException as e:
            raise requests.RequestException(f"Network error occurred: {e}")
    
    def parse_price_trends(self, market_data: Dict) -> Dict:
        """
        Parse price trends from market data
        
        Args:
            market_data: Raw market data from API
            
        Returns:
            Dictionary with parsed price trend information
        """
        trends = {
            'sale_trends': {},
            'rental_trends': {}
        }
        
        # Parse sale price trends
        if 'saleData' in market_data:
            sale_data = market_data['saleData']
            trends['sale_trends'] = {
                'average_price': sale_data.get('averagePrice'),
                'median_price': sale_data.get('medianPrice'),
                'min_price': sale_data.get('minPrice'),
                'max_price': sale_data.get('maxPrice'),
                'price_per_sqft': {
                    'average': sale_data.get('averagePricePerSquareFoot'),
                    'median': sale_data.get('medianPricePerSquareFoot'),
                    'min': sale_data.get('minPricePerSquareFoot'),
                    'max': sale_data.get('maxPricePerSquareFoot')
                },
                'square_footage': {
                    'average': sale_data.get('averageSquareFootage'),
                    'median': sale_data.get('medianSquareFootage'),
                    'min': sale_data.get('minSquareFootage'),
                    'max': sale_data.get('maxSquareFootage')
                },
                'last_updated': sale_data.get('lastUpdatedDate')
            }
        
        # Parse rental price trends
        if 'rentalData' in market_data:
            rental_data = market_data['rentalData']
            trends['rental_trends'] = {
                'average_rent': rental_data.get('averageRent'),
                'median_rent': rental_data.get('medianRent'),
                'min_rent': rental_data.get('minRent'),
                'max_rent': rental_data.get('maxRent'),
                'rent_per_sqft': {
                    'average': rental_data.get('averageRentPerSquareFoot'),
                    'median': rental_data.get('medianRentPerSquareFoot'),
                    'min': rental_data.get('minRentPerSquareFoot'),
                    'max': rental_data.get('maxRentPerSquareFoot')
                },
                'square_footage': {
                    'average': rental_data.get('averageSquareFootage'),
                    'median': rental_data.get('medianSquareFootage'),
                    'min': rental_data.get('minSquareFootage'),
                    'max': rental_data.get('maxSquareFootage')
                },
                'last_updated': rental_data.get('lastUpdatedDate')
            }
        
        return trends
    
    def parse_dom_trends(self, market_data: Dict) -> Dict:
        """
        Parse Days on Market (DOM) trends from market data
        
        Args:
            market_data: Raw market data from API
            
        Returns:
            Dictionary with parsed DOM trend information
        """
        dom_trends = {
            'sale_dom': {},
            'rental_dom': {}
        }
        
        # Parse sale DOM trends
        if 'saleData' in market_data:
            sale_data = market_data['saleData']
            dom_trends['sale_dom'] = {
                'average_days': sale_data.get('averageDaysOnMarket'),
                'median_days': sale_data.get('medianDaysOnMarket'),
                'min_days': sale_data.get('minDaysOnMarket'),
                'max_days': sale_data.get('maxDaysOnMarket'),
                'new_listings': sale_data.get('newListings'),
                'total_listings': sale_data.get('totalListings'),
                'market_velocity': self._calculate_market_velocity(
                    sale_data.get('averageDaysOnMarket')
                )
            }
        
        # Parse rental DOM trends
        if 'rentalData' in market_data:
            rental_data = market_data['rentalData']
            dom_trends['rental_dom'] = {
                'average_days': rental_data.get('averageDaysOnMarket'),
                'median_days': rental_data.get('medianDaysOnMarket'),
                'min_days': rental_data.get('minDaysOnMarket'),
                'max_days': rental_data.get('maxDaysOnMarket'),
                'new_listings': rental_data.get('newListings'),
                'total_listings': rental_data.get('totalListings'),
                'market_velocity': self._calculate_market_velocity(
                    rental_data.get('averageDaysOnMarket')
                )
            }
        
        return dom_trends
    
    def parse_historical_trends(self, market_data: Dict) -> Dict:
        """
        Parse historical trends from market data
        
        Args:
            market_data: Raw market data from API
            
        Returns:
            Dictionary with historical trend analysis
        """
        historical = {
            'sale_history': [],
            'rental_history': []
        }
        
        # Parse sale historical data
        if 'saleData' in market_data and 'history' in market_data['saleData']:
            for record in market_data['saleData']['history']:
                historical['sale_history'].append({
                    'date': record.get('date'),
                    'average_price': record.get('averagePrice'),
                    'median_price': record.get('medianPrice'),
                    'price_per_sqft': record.get('averagePricePerSquareFoot'),
                    'days_on_market': record.get('averageDaysOnMarket'),
                    'new_listings': record.get('newListings'),
                    'total_listings': record.get('totalListings')
                })
        
        # Parse rental historical data
        if 'rentalData' in market_data and 'history' in market_data['rentalData']:
            for record in market_data['rentalData']['history']:
                historical['rental_history'].append({
                    'date': record.get('date'),
                    'average_rent': record.get('averageRent'),
                    'median_rent': record.get('medianRent'),
                    'rent_per_sqft': record.get('averageRentPerSquareFoot'),
                    'days_on_market': record.get('averageDaysOnMarket'),
                    'new_listings': record.get('newListings'),
                    'total_listings': record.get('totalListings')
                })
        
        return historical
    
    def analyze_market_trends(self, zip_code: str, history_range: int = 12) -> Dict:
        """
        Comprehensive market trend analysis for a zip code
        
        Args:
            zip_code: 5-digit US zip code
            history_range: Number of months of historical data
            
        Returns:
            Dictionary with comprehensive market analysis
        """
        try:
            # Fetch market data
            market_data = self.get_market_stats(zip_code, "All", history_range)
            
            # Parse different trend components
            price_trends = self.parse_price_trends(market_data)
            dom_trends = self.parse_dom_trends(market_data)
            historical_trends = self.parse_historical_trends(market_data)
            
            # Calculate market insights
            market_insights = self._calculate_market_insights(market_data)
            
            return {
                'zip_code': zip_code,
                'analysis_date': datetime.now().isoformat(),
                'price_trends': price_trends,
                'dom_trends': dom_trends,
                'historical_trends': historical_trends,
                'market_insights': market_insights,
                'raw_data': market_data
            }
            
        except Exception as e:
            return {
                'error': str(e),
                'zip_code': zip_code,
                'analysis_date': datetime.now().isoformat()
            }
    
    def _calculate_market_velocity(self, avg_dom: Optional[float]) -> str:
        """
        Calculate market velocity based on average days on market
        
        Args:
            avg_dom: Average days on market
            
        Returns:
            Market velocity classification
        """
        if avg_dom is None:
            return "Unknown"
        
        if avg_dom <= 30:
            return "Very Fast"
        elif avg_dom <= 60:
            return "Fast"
        elif avg_dom <= 90:
            return "Moderate"
        elif avg_dom <= 120:
            return "Slow"
        else:
            return "Very Slow"
    
    def _calculate_market_insights(self, market_data: Dict) -> Dict:
        """
        Calculate market insights and recommendations
        
        Args:
            market_data: Raw market data from API
            
        Returns:
            Dictionary with market insights
        """
        insights = {
            'market_temperature': 'Unknown',
            'investment_potential': 'Unknown',
            'recommendations': []
        }
        
        # Analyze sale market
        if 'saleData' in market_data:
            sale_data = market_data['saleData']
            avg_dom = sale_data.get('averageDaysOnMarket', 0)
            
            if avg_dom <= 45:
                insights['market_temperature'] = 'Hot'
                insights['recommendations'].append('Consider quick decision-making for purchases')
            elif avg_dom <= 90:
                insights['market_temperature'] = 'Warm'
                insights['recommendations'].append('Good market conditions for both buying and selling')
            else:
                insights['market_temperature'] = 'Cool'
                insights['recommendations'].append('Buyer-friendly market with more negotiation power')
        
        # Analyze rental market for investment potential
        if 'rentalData' in market_data and 'saleData' in market_data:
            rental_data = market_data['rentalData']
            sale_data = market_data['saleData']
            
            avg_rent = rental_data.get('averageRent', 0)
            avg_price = sale_data.get('averagePrice', 0)
            
            if avg_rent > 0 and avg_price > 0:
                # Calculate rental yield (monthly rent * 12 / purchase price)
                annual_rental_yield = (avg_rent * 12) / avg_price * 100
                
                if annual_rental_yield >= 8:
                    insights['investment_potential'] = 'High'
                    insights['recommendations'].append('Strong rental yield potential')
                elif annual_rental_yield >= 5:
                    insights['investment_potential'] = 'Moderate'
                    insights['recommendations'].append('Decent rental investment opportunity')
                else:
                    insights['investment_potential'] = 'Low'
                    insights['recommendations'].append('Consider other investment markets')
        
        return insights

def main():
    """
    Example usage of the RentCast Market Service
    """
    try:
        # Initialize service
        service = RentCastMarketService()
        
        # Example zip codes to analyze
        zip_codes = ['90210', '10001', '30309']  # Beverly Hills, NYC, Atlanta
        
        for zip_code in zip_codes:
            print(f"\n{'='*50}")
            print(f"Market Analysis for Zip Code: {zip_code}")
            print(f"{'='*50}")
            
            # Get comprehensive analysis
            analysis = service.analyze_market_trends(zip_code, history_range=6)
            
            if 'error' in analysis:
                print(f"Error analyzing {zip_code}: {analysis['error']}")
                continue
            
            # Display price trends
            if analysis['price_trends']['sale_trends']:
                sale_trends = analysis['price_trends']['sale_trends']
                print(f"\n📊 Sale Price Trends:")
                print(f"   Average Price: ${sale_trends['average_price']:,}" if sale_trends['average_price'] else "   Average Price: N/A")
                print(f"   Median Price: ${sale_trends['median_price']:,}" if sale_trends['median_price'] else "   Median Price: N/A")
                print(f"   Price/SqFt: ${sale_trends['price_per_sqft']['average']:.2f}" if sale_trends['price_per_sqft']['average'] else "   Price/SqFt: N/A")
            
            if analysis['price_trends']['rental_trends']:
                rental_trends = analysis['price_trends']['rental_trends']
                print(f"\n🏠 Rental Price Trends:")
                print(f"   Average Rent: ${rental_trends['average_rent']:,}" if rental_trends['average_rent'] else "   Average Rent: N/A")
                print(f"   Median Rent: ${rental_trends['median_rent']:,}" if rental_trends['median_rent'] else "   Median Rent: N/A")
                print(f"   Rent/SqFt: ${rental_trends['rent_per_sqft']['average']:.2f}" if rental_trends['rent_per_sqft']['average'] else "   Rent/SqFt: N/A")
            
            # Display DOM trends
            if analysis['dom_trends']['sale_dom']:
                sale_dom = analysis['dom_trends']['sale_dom']
                print(f"\n⏱️ Days on Market (Sales):")
                print(f"   Average DOM: {sale_dom['average_days']:.1f} days" if sale_dom['average_days'] else "   Average DOM: N/A")
                print(f"   Market Velocity: {sale_dom['market_velocity']}")
                print(f"   Active Listings: {sale_dom['total_listings']}" if sale_dom['total_listings'] else "   Active Listings: N/A")
            
            # Display market insights
            insights = analysis['market_insights']
            print(f"\n💡 Market Insights:")
            print(f"   Market Temperature: {insights['market_temperature']}")
            print(f"   Investment Potential: {insights['investment_potential']}")
            
            if insights['recommendations']:
                print(f"   Recommendations:")
                for rec in insights['recommendations']:
                    print(f"     • {rec}")
    
    except Exception as e:
        print(f"Error initializing service: {e}")
        print("Make sure RENTCAST_API_KEY is set in your environment variables")

if __name__ == "__main__":
    main()