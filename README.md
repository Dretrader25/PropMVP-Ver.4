# PropAnalyzed - AI-Powered Real Estate Investment Platform

A cutting-edge real estate wholesaling platform that transforms property investment through intelligent data analysis and modern authentication systems.

## 🚀 Features

### Authentication & Security
- **Google OAuth Integration** - Seamless sign-in with Google accounts
- **Email/Password Authentication** - Traditional registration and login system
- **Secure Session Management** - PostgreSQL-backed session storage
- **Password Security** - bcrypt hashing with salt rounds

### Property Analysis
- **Advanced Property Search** - Comprehensive property lookup with real-time data
- **AI-Powered Investment Analysis** - Machine learning scoring for deal evaluation
- **Interactive Heatmaps** - Visual property potential mapping
- **Market Intelligence** - Real-time market trends and investor activity

### Investment Tools
- **Comparable Sales Analysis** - Recent sales data and market comparisons
- **ROI Calculations** - Automated return on investment analysis
- **Deal Pipeline Management** - Lead tracking and conversion optimization
- **Export Functionality** - Property reports in multiple formats

## 🛠 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for modern styling
- **Shadcn/UI** component library
- **TanStack Query** for data management
- **Wouter** for client-side routing
- **Framer Motion** for animations

### Backend
- **Node.js** with Express.js
- **TypeScript** for type safety
- **Passport.js** for authentication strategies
- **PostgreSQL** with Drizzle ORM
- **Session management** with connect-pg-simple

### Infrastructure
- **Replit** hosting platform
- **PostgreSQL** database
- **Vite** for development and builds
- **ESBuild** for production bundling

## 🔧 Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 16+
- Google OAuth credentials (optional)

### Environment Variables
```env
DATABASE_URL=postgresql://username:password@host:port/database
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
```

### Installation
```bash
# Install dependencies
npm install

# Set up database schema
npm run db:push

# Start development server
npm run dev
```

## 🏗 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express server
│   ├── auth.ts            # Authentication strategies
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Database operations
│   └── db.ts              # Database configuration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── migrations/            # Database migration files
```

## 🔐 Authentication Flow

### Google OAuth
1. User clicks "Continue with Google"
2. Redirects to Google OAuth consent screen
3. Google redirects back with authorization code
4. Server exchanges code for user profile
5. User session created and dashboard access granted

### Email/Password
1. User registers with email and password
2. Password hashed with bcrypt (12 salt rounds)
3. User record created in PostgreSQL
4. Login authenticates against stored hash
5. Session established for authenticated access

## 📊 Database Schema

### Users Table
- `id` - Unique identifier (local_* or google_*)
- `email` - User email address
- `firstName` - User's first name
- `lastName` - User's last name
- `passwordHash` - Encrypted password (local auth only)
- `authProvider` - Authentication method ('local', 'google')
- `profileImageUrl` - Profile picture URL

### Properties Table
- Property details, pricing, and market data
- Comparable sales information
- Market metrics and trends

## 🚀 Deployment

The application is configured for deployment on Replit with:
- Automatic dependency management
- Environment variable configuration
- PostgreSQL database provisioning
- SSL/TLS termination

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/register` - User registration
- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/user` - Get current user
- `GET /api/logout` - User logout

### Properties
- `POST /api/properties/search` - Property search
- `GET /api/properties/:id` - Get property details
- `GET /api/properties/:id/export` - Export property data
- `POST /api/properties/:id/analyze` - AI analysis

## 🎨 UI Components

Built with modern design principles:
- Glass morphism effects
- Gradient animations
- Responsive layouts
- Accessible form controls
- Loading states and error handling

## 🔒 Security Features

- CSRF protection
- Secure session cookies
- Password hashing
- SQL injection prevention
- XSS protection

## 📈 Performance

- Code splitting with Vite
- Optimized database queries
- Caching with TanStack Query
- Lazy loading components
- Compressed assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions, please contact the development team.

---

Built with ❤️ for real estate professionals