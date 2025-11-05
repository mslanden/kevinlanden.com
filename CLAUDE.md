# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack real estate website for Kevin Landen Real Estate (also branded as Outrider Real Estate) serving Anza, Aguanga, Idyllwild, and Mountain Center. The project has:
- **Backend**: Express.js API with TypeScript using Supabase (PostgreSQL)
- **Frontend v1**: Next.js with TypeScript and Styled Components
- **Frontend v2**: React (Create React App) with JavaScript and Styled Components

## Essential Commands

### Backend Development
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Start development server with hot reload (port 3001)
npm run build        # Compile TypeScript to JavaScript
npm start            # Run production server
```

### Frontend v1 (Next.js) Development
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start Next.js development server
npm run build        # Build production bundle
npm start            # Start production server
npm run lint         # Run ESLint
```

### Frontend v2 (React) Development
```bash
cd frontendv2
npm install          # Install dependencies
npm start            # Start React development server
npm run build        # Build production bundle
npm test             # Run tests
```

## Architecture Overview

### Backend Architecture
- **Express.js** server with TypeScript running on port 3001
- **Supabase** for database (PostgreSQL with Row Level Security)
- **API Routes**:
  - `/api/properties` - Property listings CRUD operations
  - `/api/blog` - Blog posts and categories management
  - `/api/contact` - Contact form submissions
  - `/api/market-data` - Market data and pricing analytics
  - `/api/newsletter` - Newsletter generation and MLS data processing
- **Middleware**: CORS enabled for cross-origin requests
- **Database Tables**: properties, property_images, property_features, blog_posts, blog_categories, contact_submissions, price_per_sqft_data, days_on_market_data, newsletter_subscribers

### Frontend Architectures
Both frontends consume the same backend API but have different implementations:

**Frontend v1 (Next.js)**:
- Server-side rendering capable
- TypeScript for type safety
- Styled Components with Bootstrap for UI
- Custom scroll animations and smooth scrolling
- **Newsletter Generator** - Monthly market report generation with PDF export
- **Market Data Manager** - Upload and manage MLS market data

**Frontend v2 (React)**:
- Client-side rendered SPA
- JavaScript (no TypeScript)
- Styled Components with Framer Motion for animations
- React Router for navigation
- Western/country theme design

## Environment Setup

### Backend Environment Variables
Create `/backend/.env`:
```
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-anon-key
PORT=3001
NODE_ENV=development
```

### Frontend v1 Environment Variables
Create `/frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Database Setup
1. Create a Supabase project at https://supabase.com
2. Run the SQL schema from `/backend/src/db/schema.sql` in Supabase SQL editor
3. This creates all necessary tables with RLS policies and triggers

## Key Development Patterns

### Backend Patterns
- All routes use TypeScript with proper type definitions
- Supabase client is initialized in `/backend/src/utils/supabaseClient.ts`
- Error handling with try-catch blocks and appropriate HTTP status codes
- CORS configured to allow frontend requests

### Frontend Patterns
**Next.js Frontend**:
- Pages use `getServerSideProps` or `getStaticProps` for data fetching
- Components are in `/frontend/src/components/`
- Custom hooks for scroll behavior and section management
- Styled Components with theme provider

**React Frontend**:
- Components follow functional component pattern with hooks
- Pages are in `/frontendv2/src/pages/`
- Consistent western/country theme throughout
- Responsive design with mobile-first approach

## Testing
- Frontend v2 has test support via Create React App (`npm test`)
- No test commands configured for backend or frontend v1
- When adding tests, follow existing patterns in the respective framework

## Market Data Manager

### CSV Upload (Primary Method)
- **Fast & Free**: Upload MLS data via CSV exports - no AI processing required
- **Location**: `/frontend/src/components/MarketDataManager.js`
- **Process**: Upload CSV → PapaParse parses data → Calculates aggregates → Saves to database
- **Supported Fields**: List Price, Closed Price, Approx SqFt, Status, Days on Market, MLS#, Address, Beds, Baths
- **Aggregate Calculations**:
  - Median price per square foot
  - Average price
  - Total sales count
  - Average and median days on market
- **Database Tables**: Saves to `price_per_sqft_data` and `days_on_market_data`
- **Upsert Behavior**: Re-uploading same month/year updates existing data automatically

### Manual Entry
- Admin can manually enter monthly aggregate statistics
- Useful for quick data entry or adjustments
- Same database tables as CSV upload

## Newsletter Generator

### Key Features
- **Monthly Newsletter Creation**: Generate professional market reports for Anza, Aguanga, Idyllwild, and Mountain Center
- **Market Data Display**: Reads data from `price_per_sqft_data` and `days_on_market_data` tables
- **PDF Export**: Generate single-page continuous PDFs using html2canvas + jsPDF
- **Market Analytics**: Automated charts for price trends, days on market, and market summaries
- **Email Ready**: PDFs optimized for email attachments with proper formatting

### PDF Generation
- Uses **html2canvas** + **jsPDF** for reliable PDF creation
- Generates **single long page** format (not multiple pages)
- Custom page dimensions calculated from content height
- Optimized for email attachments and mobile viewing
- Located in `/frontend/src/components/NewsletterGenerator.js`

### Market Data Tables Displayed
- **Market Summary**: Active Listings, Price per Sq Ft, Closed Sales, Total Listings, Median List Price
- **Market Data - Last 6 Months**: Historical pricing and market trends
- **Property Listings**: Detailed MLS property information
- Data sourced from `price_per_sqft_data` and `days_on_market_data` tables
- Data is uploaded via **Market Data Manager**, not through the newsletter generator

## Important Notes
- Always check which frontend version you're working on (Next.js vs React)
- Backend API must be running for frontends to function properly
- Supabase credentials are required for database operations
- The project uses different styling approaches: frontend v1 uses Bootstrap + Styled Components, frontend v2 uses pure Styled Components
- When modifying database schema, update `/backend/src/db/schema.sql` to keep it in sync
- **Newsletter Generator** is only available in Frontend v1 (Next.js)
- PDF generation requires all charts to be rendered before capture