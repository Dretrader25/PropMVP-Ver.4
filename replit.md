# PropAnalyzed - Property Search & Analysis Platform

## Overview
PropAnalyzed is a full-stack web application for real estate property search and analysis. It provides comprehensive property information, comparable sales data, market metrics, and export capabilities. The platform aims to be a go-to resource for real estate professionals and investors seeking detailed insights and analytics for property valuation and market understanding.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, incorporating glass morphism design, gradient text animations, and floating elements.
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API with JSON responses
- **Data Storage**: DatabaseStorage class for persistent PostgreSQL storage

### Key Features & Components
- **Database Schema**: Properties, Comparable Sales, and Market Metrics tables.
- **API Endpoints**: For property search, retrieval, and data export.
- **Frontend Components**: Market Intelligence (real-time data, hot markets, distressed properties, investor activity), Property Search Form, Property Dashboard, Comparable Sales, Market Analysis, Analytics Dashboard (including wholesaling analysis, distress indicators, valuation, AI insights), Lead Management, and Export Actions.
- **AI Analysis Feature**: GPT-4o integration for property investment grading (A+ to F), detailed analysis, estimated profit, and recommendations.
- **Market Heatmaps**: Interactive visualizations of deal activity and property investment potential with color-coded scoring.
- **Authentication System**: Comprehensive user authentication using Replit Auth (OpenID Connect), Google OAuth, and email/password, with secure session management via PostgreSQL.
- **Global Navigation Bar**: Sticky, responsive navigation across all pages.
- **Workflow Organization**: Market Intelligence → Property Search → Analytics → Lead Management workflow with collapsible sections for improved UX.

## External Dependencies

### Frontend Libraries
- React ecosystem (React, React DOM, React Hook Form)
- TanStack Query
- Radix UI
- Lucide React
- Wouter
- Tailwind CSS and class-variance-authority

### Backend Libraries
- Express.js
- Drizzle ORM and Drizzle Kit
- Neon Database serverless driver
- Zod
- Connect-pg-simple
- bcrypt

### APIs and Services
- OpenAI (GPT-4o) for AI analysis
- Rentcast API for authentic property data, valuations, comparable sales, and market metrics.

### Development Tools
- TypeScript
- Vite
- ESBuild
- PostCSS and Autoprefixer