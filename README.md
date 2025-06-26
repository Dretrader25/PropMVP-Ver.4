# PropAnalyzed - AI-Powered Real Estate Investment Platform

A cutting-edge real estate wholesaling platform that transforms property investment through intelligent data analysis and modern authentication systems.

## 🚀 Features

### Authentication & Security
- **Google OAuth Integration** - Seamless sign-in with Google accounts
- **GitHub OAuth Integration** - Seamless sign-in with GitHub accounts
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
- GitHub OAuth credentials (optional)

### Environment Variables
Update your `.env` file or Replit Secrets with the following variables.
The `SESSION_SECRET` should be a long, random string for production.

```env
DATABASE_URL=postgresql://username:password@host:port/database
SESSION_SECRET=your_very_secure_session_secret

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth (Optional)
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# OpenAI API Key (Required for AI Analysis)
OPENAI_API_KEY=your_openai_api_key

# Rentcast API Key (Required for property data)
RENTCAST_API_KEY=your_rentcast_api_key
```

#### Setting up OAuth Credentials:

**For Google OAuth:**
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project or select an existing one.
3. Navigate to "APIs & Services" > "Credentials".
4. Click "Create Credentials" > "OAuth client ID".
5. Select "Web application" as the application type.
6. Add an "Authorized JavaScript origin" (e.g., `https://your-replit-slug.replit.dev` or `http://localhost:5173`).
7. Add an "Authorized redirect URI": `https://your-replit-slug.replit.dev/api/auth/google/callback` (or `http://localhost:5000/api/auth/google/callback` for local dev).
8. Copy the "Client ID" and "Client Secret".

**For GitHub OAuth:**
1. Go to your GitHub account settings > "Developer settings" > "OAuth Apps".
2. Click "New OAuth App".
3. **Application name:** e.g., "PropAnalyzed Dev"
4. **Homepage URL:** e.g., `https://your-replit-slug.replit.dev` or `http://localhost:5173`
5. **Authorization callback URL:** `https://your-replit-slug.replit.dev/api/auth/github/callback` (or `http://localhost:5000/api/auth/github/callback` for local dev).
6. Click "Register application".
7. Copy the "Client ID" and generate/copy the "Client Secret".


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
1. User clicks "Continue with Google".
2. Redirects to Google OAuth consent screen.
3. Google redirects back to `/api/auth/google/callback` with an authorization code.
4. Server exchanges code for user profile with Google.
5. User record is created or updated in the database.
6. User session created and dashboard access granted.

### GitHub OAuth
1. User clicks "Continue with GitHub".
2. Redirects to GitHub OAuth consent screen.
3. GitHub redirects back to `/api/auth/github/callback` with an authorization code.
4. Server exchanges code for user profile with GitHub.
5. User record is created or updated in the database.
6. User session created and dashboard access granted.

### Email/Password
1. User registers with email and password.
2. Password hashed with bcrypt (12 salt rounds)
3. User record created in PostgreSQL
4. Login authenticates against stored hash
5. Session established for authenticated access

## 📊 Database Schema

### Users Table
- `id` - Unique identifier (e.g., `local_*`, `google_*`, `github_*`)
- `email` - User email address (unique where available)
- `firstName` - User's first name
- `lastName` - User's last name
- `passwordHash` - Encrypted password (for local auth only)
- `authProvider` - Authentication method ('local', 'google', 'github', 'apple')
- `githubId` - GitHub user ID (unique, for GitHub OAuth)
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
- `POST /api/auth/login` - Email/password login.
- `POST /api/auth/register` - User registration.
- `GET /api/auth/google` - Initiates Google OAuth flow.
- `GET /api/auth/google/callback` - Handles Google OAuth callback.
- `GET /api/auth/github` - Initiates GitHub OAuth flow.
- `GET /api/auth/github/callback` - Handles GitHub OAuth callback.
- `GET /api/auth/apple` - Placeholder for Apple OAuth.
- `GET /api/auth/user` - Get current authenticated user's details.
- `GET /api/logout` - User logout (redirects).
- `POST /api/auth/logout` - User logout (JSON response).

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