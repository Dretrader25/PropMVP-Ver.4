# PropAnalyzed - Property Search & Analysis Platform

PropAnalyzed is a comprehensive full-stack web application designed for real estate professionals. It enables advanced property search, in-depth analysis with AI-powered insights, market intelligence tracking, and lead management. User authentication is handled via Supabase.

## Features

*   **Property Search:** Search for properties using various criteria.
*   **Detailed Property Analysis:** View comprehensive property details, including data fetched from external APIs (Zillow, Rentcast) and AI-driven investment analysis.
*   **Dynamic Data & Imaging:** Property analysis features updated information and images from external real estate APIs.
*   **Market Intelligence:** Access real-time market data, heatmap visualizations, and trend analysis. (Partially implemented with mock data, heatmap components exist).
*   **Lead Management:** Tools for managing a real estate lead pipeline. (Partially implemented with mock data).
*   **User Authentication:** Secure sign-up, login, and session management using Supabase.
*   **Modern UI/UX:** Glass morphism design with responsive components.

## Tech Stack

*   **Frontend:**
    *   React 18 with TypeScript
    *   Vite (Build Tool)
    *   Wouter (Routing)
    *   TanStack Query (Server State Management)
    *   Tailwind CSS (Styling)
    *   Shadcn/ui (UI Components)
    *   Supabase.js (Authentication Client)
*   **Backend:**
    *   Node.js with Express.js
    *   TypeScript
    *   PostgreSQL (Database)
    *   Drizzle ORM (Database Interaction)
    *   Neon (Serverless PostgreSQL Provider)
    *   Axios (for calling external APIs)
    *   OpenAI API (for AI Analysis)
*   **Authentication:**
    *   Supabase (Auth, potentially database and storage in the future)

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
*   A PostgreSQL database. You can:
    *   Run one locally using Docker.
    *   Use a cloud provider like [Neon](https://neon.tech/) (which is configured in `drizzle.config.ts`).
*   A Supabase account and project. ([Supabase](https://supabase.com/))
*   An OpenAI API key. ([OpenAI Platform](https://platform.openai.com/))

## Getting Started

Follow these steps to get the PropAnalyzed application running locally:

**1. Clone the Repository:**

```bash
git clone <repository-url>
cd <repository-directory>
```

**2. Install Dependencies:**

The project is structured with a root `package.json` that can manage both client and server installations, or they might be separate. Assuming a root `package.json` that handles workspaces or uses concurrently (check `package.json` scripts):

*   **If using a root `package.json` to manage both:**
    ```bash
    npm install
    ```
*   **If client and server have separate `package.json` files (more likely based on current structure):**
    ```bash
    # Install backend dependencies (from root or server/ directory)
    npm install
    # or: cd server && npm install && cd ..

    # Install frontend dependencies
    cd client
    npm install
    cd ..
    ```
    *Note: The current project structure has a root `package.json` which seems to handle both client and server via Vite plugins and `npm run dev` script.*

**3. Set Up Environment Variables:**

Create a `.env` file in the root of the project (or in the `server/` directory if the backend runs from there, and a `.env.local` or `.env` in the `client/` directory for frontend vars).

*   **For the Backend (e.g., in root `.env` or `server/.env`):**
    ```env
    DATABASE_URL="your_postgresql_connection_string"
    OPENAI_API_KEY="your_openai_api_key"

    # Example DATABASE_URL for Neon:
    # DATABASE_URL="postgresql://user:password@project-id.cloud.neon.tech/dbname?sslmode=require"
    ```

*   **For the Frontend (in `client/.env` or `client/.env.local`):**
    ```env
    VITE_SUPABASE_URL="your_supabase_project_url"
    VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"

    # Example VITE_SUPABASE_URL: https://ctbyylprhvjcmhkgmptm.supabase.co
    # Example VITE_SUPABASE_ANON_KEY: eyJhbGciOi... (the long public anon key)
    ```

    *   **`DATABASE_URL`**: Your PostgreSQL connection string.
    *   **`OPENAI_API_KEY`**: Get this from your OpenAI dashboard.
    *   **`VITE_SUPABASE_URL`**: Found in your Supabase project dashboard (Settings > API > Project URL).
    *   **`VITE_SUPABASE_ANON_KEY`**: Found in your Supabase project dashboard (Settings > API > Project API keys > `anon` `public`).

**4. Run Database Migrations:**

Make sure your PostgreSQL database server is running and accessible with the `DATABASE_URL` you provided.

```bash
npx drizzle-kit generate:pg  # To generate migrations if you change schema.ts
npx drizzle-kit migrate:pg     # To apply pending migrations
```
(Or use `npm run db:generate` and `npm run db:migrate` if such scripts exist in `package.json`)

**5. Configure Supabase Authentication:**
    * Go to your Supabase project dashboard.
    * Navigate to "Authentication" -> "Providers" and ensure "Email" provider is enabled.
    * By default, Supabase requires email confirmation. For local development, you might want to disable "Confirm email" under Authentication -> Settings, or handle the email confirmation flow.
    * No specific database table setup is needed for Supabase Auth initially; it handles its own `auth.users` table.

**6. Start the Application:**

The `package.json` in the root directory likely has scripts to start both backend and frontend concurrently, or separately.

*   **To run both client and server concurrently (common setup for this Replit structure):**
    ```bash
    npm run dev
    ```
    (This script usually starts Vite for the frontend and Nodemon/ts-node-dev for the backend, as seen in `vite.config.ts` and `server/index.ts`)

*   **If you need to run them separately:**
    *   **Start Backend Server:**
        ```bash
        # From root directory, if script is configured for it
        npm run dev:server
        # Or: cd server && npm run dev (if server has its own package.json and dev script)
        ```
    *   **Start Frontend Development Server:**
        ```bash
        cd client
        npm run dev
        cd ..
        ```

**7. Access the Application:**

*   The frontend is typically available at `http://localhost:5173` (default Vite port).
*   The backend server API will be running on a port specified in its setup (e.g., `3000`, `3001`, check `server/index.ts` or `vite.config.ts` for proxy settings).

You should now be able to access PropAnalyzed in your browser, sign up for a new account, log in, and use the features.

## Project Structure

```
.
├── client/         # Frontend React application (Vite + TypeScript)
│   ├── public/
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── contexts/   # React contexts (e.g., AuthContext)
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions, Supabase client, Query client
│   │   ├── pages/      # Page components
│   │   ├── App.tsx     # Main application component with routing
│   │   └── main.tsx    # Entry point for the React app
│   ├── index.html
│   └── package.json    # Frontend dependencies
├── server/         # Backend Express application (Node.js + TypeScript)
│   ├── ai-analysis.ts
│   ├── db.ts           # Drizzle ORM setup
│   ├── external-property-apis.ts # Logic for Zillow/Rentcast APIs
│   ├── index.ts        # Backend server entry point
│   ├── routes.ts       # API route definitions
│   └── storage.ts      # Database interaction layer
├── shared/         # Code shared between frontend and backend
│   └── schema.ts     # Drizzle ORM schema, Zod schemas
├── drizzle.config.ts # Drizzle ORM configuration
├── package.json      # Root project configuration and scripts
├── README.md         # This file
└── vite.config.ts    # Vite configuration (handles frontend and backend dev server)
```

## Contributing

Details on contributing to the project will be added here. (Standard contribution guidelines: fork, branch, commit, PR).
