# PropAnalyzed - Property Search & Analysis Platform

## Overview

PropAnalyzed is a full-stack web application designed for real estate property search and analysis. The application provides comprehensive property information including comparable sales, market metrics, and export capabilities. Built with a modern tech stack including React, Express, and PostgreSQL with Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Data Storage**: DatabaseStorage class with persistent PostgreSQL storage

### Key Components

#### Database Schema
The application uses three main database tables:
- **Properties**: Core property information including address, specifications, pricing, and listing details
- **Comparable Sales**: Related property sales data for market analysis
- **Market Metrics**: Aggregated neighborhood statistics and trends

#### API Endpoints
- `POST /api/properties/search` - Search for properties by address/location
- `GET /api/properties/:id` - Retrieve detailed property information
- `GET /api/properties/:id/export` - Export property data as JSON

#### Frontend Components
- **Dashboard**: Main application interface with property search and display
- **Property Search Form**: Form for searching properties with validation
- **Property Dashboard**: Comprehensive property information display
- **Comparable Sales**: Table showing recent similar property sales
- **Market Analysis**: Visual representation of market trends and metrics
- **Export Actions**: Tools for exporting property reports
- **Analytics Dashboard**: Comprehensive wholesaling analysis with property basics, distress indicators, valuation analysis, and AI-powered insights
- **Market Intelligence**: Real-time market data, hot markets analysis, distressed properties tracking, and investor activity metrics
- **Lead Management**: Complete lead pipeline management with source tracking, activity monitoring, and conversion optimization

## Data Flow

1. **Property Search**: User enters property details in search form
2. **API Request**: Form data is validated and sent to backend search endpoint
3. **Database Query**: Backend queries property database using Drizzle ORM
4. **Data Aggregation**: System fetches related comparables and market metrics
5. **Response Assembly**: Complete property data package is assembled
6. **UI Rendering**: Frontend displays comprehensive property analysis
7. **Export Options**: Users can export data in various formats

## External Dependencies

### Frontend Libraries
- React ecosystem (React, React DOM, React Hook Form)
- TanStack Query for data fetching and caching
- Radix UI for accessible component primitives
- Lucide React for icons
- Wouter for routing
- Tailwind CSS and class-variance-authority for styling

### Backend Libraries
- Express.js for HTTP server
- Drizzle ORM and Drizzle Kit for database operations
- Neon Database serverless driver
- Zod for schema validation
- Connect-pg-simple for session management

### Development Tools
- TypeScript for type safety
- Vite for frontend build tooling
- ESBuild for backend bundling
- PostCSS and Autoprefixer for CSS processing

## Deployment Strategy

The application is configured for deployment on Replit with the following setup:

### Development Environment
- Node.js 20 runtime
- PostgreSQL 16 database
- Hot reload with Vite development server
- Port 5000 for local development

### Production Build
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles server code with external dependencies
- Database: Drizzle migrations for schema management
- Deployment: Autoscale deployment target on port 80

### Environment Configuration
- DATABASE_URL for PostgreSQL connection
- NODE_ENV for environment detection
- Build and start scripts for production deployment

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 19, 2025: Complete modern UI transformation with PostgreSQL database integration
  - Implemented glass morphism design with advanced backdrop blur effects
  - Added gradient text animations and floating elements
  - Enhanced color system with status indicators and improved visual hierarchy
  - Modernized all component cards with rounded corners and sophisticated shadows
  - Upgraded form inputs with improved focus states and modern styling
  - Enhanced loading states with animated progress indicators
  - Improved sidebar with modern navigation and premium upgrade section
  - Added hover animations and micro-interactions throughout the interface
  - Implemented responsive design improvements for better mobile experience
  - Integrated PostgreSQL database with Drizzle ORM for persistent data storage
  - Replaced in-memory storage with DatabaseStorage class
  - All property searches and data now persist between sessions

- June 19, 2025: Enhanced Analytics Dashboard with comprehensive wholesaling components
  - Added all essential wholesaling analysis sections as requested
  - Location & Property Basics: Full address, county, beds/baths, square footage, lot size, year built, property type
  - Motivation & Distress Indicators: Owner occupancy status, last sale data, mortgage balance, tax delinquency, foreclosure status, code violations, vacancy status with visual indicators
  - Valuation & Deal Analysis: AVM, ARV estimates, rental estimates, equity calculations, deal potential scoring
  - Market Data for Disposition: Days on market, price per square foot, appreciation trends, flood zone status
  - Recent Sold Comparables: Nearby sales with distance, DOM, and pricing analysis
  - Active Competition Analysis: Current listings comparison with market position assessment
  - Visual status indicators and color-coded alerts for quick decision making
  - Responsive grid layout optimized for comprehensive property analysis

- June 19, 2025: Implemented AI Analysis Feature with OpenAI Integration
  - Created comprehensive AI-powered property analysis system using GPT-4o
  - Property selection from all searched properties with dropdown interface
  - Investment grading system from F (worst) to A+ (best deal)
  - Detailed analysis including score (0-100), estimated profit, and confidence level
  - Executive summary with market position and urgency indicators
  - Key strengths and risk factors identification
  - Investment recommendations with actionable insights
  - Color-coded grade indicators and urgency badges for quick decision making
  - Error handling and loading states for optimal user experience
  - Full integration with existing property database and analytics dashboard

- June 19, 2025: Added Market Intelligence and Lead Management Pages
  - Created comprehensive Market Intelligence page with real-time market analysis
  - Hot markets tracking with hotness scoring, price trends, and investor activity metrics
  - Market segments analysis for different property types with volume and pricing data
  - Distressed properties dashboard showing foreclosures, pre-foreclosures, and bank-owned properties
  - Price range analysis with days on market metrics across different price segments
  - Investor activity tracking including cash buyers, flippers, and institutional purchasing
  - Created full-featured Lead Management system with pipeline visualization
  - Lead source performance tracking with cost analysis and conversion metrics
  - Recent activity feed with communication history and next action tracking
  - Notifications and alerts system for urgent follow-ups and opportunities
  - Comprehensive lead data including contact information, motivation, and equity calculations
  - Updated navigation to include new pages with proper routing and active states

## Changelog

- June 19, 2025: Major UI/UX enhancement - Modern glass morphism design system
- June 18, 2025: Initial setup and core functionality implementation