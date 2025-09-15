# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Estimax is a Next.js 15 application for electrical estimation and material takeoff services. It uses:
- Next.js 15 with App Router
- React 19 with Tailwind CSS 4
- PostgreSQL with Drizzle ORM
- Vercel Postgres for database hosting
- PDF processing capabilities with react-dropzone and pdf-parse

## Development Commands

```bash
# Development
pnpm dev              # Start development server on localhost:3000
pnpm build           # Build for production
pnpm start           # Start production server
pnpm lint            # Run ESLint
pnpm lint:fix        # Fix ESLint issues

# Database Operations
node seed.js         # Seed database with materials data
node clear-data.js   # Clear all data from materials table
```

## Project Architecture

### Database Layer (`/src/db`)
- **schema/materials.js**: Drizzle schema for materials table (id, mpg, activity, materialReference, description, priceList)
- **index.js**: Database connection and query functions (getMaterials, searchMaterials, createMaterial, etc.)
- Uses Vercel Postgres with Drizzle ORM for type-safe database operations

### API Routes (`/src/app/api`)
- **materials/**: REST API for materials CRUD operations
  - GET with pagination and search
  - POST for creating new materials
- **materials/search/**: Dedicated search endpoint for materials by description or reference
- **pdf/parse/**: PDF processing endpoint that extracts text from uploaded PDFs

### Frontend Components (`/src/components`)
All components follow consistent styling patterns:
- **Button.js**: Reusable button with primary/secondary/outline variants
- **Card.js**: Container component with hover effects
- **Header/Footer.js**: Site navigation and footer
- Marketing components: Hero, Features, Roadmap, TargetAudience, FinalCTA

### Pages
- **/** : Landing page with marketing content
- **/estimator**: PDF upload and processing page with drag-and-drop functionality

## Key Design Patterns

### Styling Conventions
- Use Tailwind CSS classes consistently
- Primary color: blue-600 (#2563eb)
- Gradient text class: `gradient-text`
- Section padding: `section-padding` class
- Container: `container` class for max-width and padding

### Component Structure
- Functional components with hooks
- Props destructuring with default values
- Consistent prop naming (variant, size, className)

### API Response Format
```javascript
// Success
{ data: {...}, message: "...", total: n }

// Error
{ error: "...", details: "..." }
```

## Environment Variables
Required in `.env` or `.env.local`:
```
POSTGRES_URL=your_vercel_postgres_url
```

## Database Schema
Materials table structure:
- id: auto-incrementing primary key
- mpg: varchar(100)
- activity: varchar(255)
- materialReference: varchar(255)
- description: varchar(500)
- priceList: bigint (stored as number)

## Development Tips
- Always use `pnpm` as the package manager (v10.14.0)
- Run `pnpm lint:fix` before committing
- Test API endpoints with proper error handling
- Maintain consistent styling with existing components
- Use existing Button, Card, and layout components when possible