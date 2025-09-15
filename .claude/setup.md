# Project Setup Instructions

This file contains complete setup instructions for creating a Next.js 15 project with JavaScript, Tailwind CSS, and Drizzle ORM. Execute these steps in order.

## Initial Setup

1. Initialize Next.js project with required options:
```bash
npx create-next-app@latest . --app --src-dir --eslint --tailwind --js
```

2. Install core dependencies:
```bash
pnpm add @vercel/postgres drizzle-orm dotenv dayjs framer-motion
```

3. Install dev dependencies:
```bash
pnpm add -D drizzle-kit
```

## Configuration Files

### Update package.json scripts section:
Replace the scripts section with:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "eslint \"src/**/*.{js,jsx}\" --fix"
  }
}
```

### Create drizzle.config.js:
```javascript
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL,
  },
});
```

### Update next.config.js:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
```

## Database Schema (JavaScript)

### Create src/db/schema/materials.js:
```javascript
import { integer, pgTable, varchar, decimal } from 'drizzle-orm/pg-core';

export const materials = pgTable('materials', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mpg: varchar({ length: 100 }).notNull(),
  activity: varchar({ length: 255 }).notNull(),
  materialReference: varchar('material_reference', { length: 255 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  priceList: decimal('price_list', { precision: 10, scale: 2 }).notNull(),
});
```

### Create src/db/schema/index.js:
```javascript
export * from './materials.js';
```

### Create src/db/index.js:
```javascript
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { eq, like } from 'drizzle-orm';
import * as schema from './schema/index.js';

export const db = drizzle(sql, { schema });

export async function getMaterials() {
  return await db.select().from(schema.materials);
}

export async function getMaterialById(id) {
  return await db.select().from(schema.materials).where(eq(schema.materials.id, id));
}

export async function searchMaterials(searchTerm) {
  return await db.select().from(schema.materials).where(
    like(schema.materials.description, `%${searchTerm}%`)
  );
}

export async function createMaterial(materialData) {
  return await db.insert(schema.materials).values(materialData);
}
```

### Create src/lib/date.js:
```javascript
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function formatRelativeTime(date) {
  return dayjs(date).fromNow();
}

export function formatDate(date, format = 'MMMM D, YYYY') {
  return dayjs(date).format(format);
}
```

## Environment Setup

### Create .env.example:
```env
POSTGRES_URL="postgresql://username:password@hostname:5432/database"
```

### Create .gitignore additions:
Add these lines if not already present:
```
# Database
drizzle/

# Environment variables
.env
.env.local
.env.production
.env.staging
```

## Final Steps

1. Create directories:
```bash
mkdir -p src/components src/screens
```

2. Create .env file from .env.example and add your database URL

3. Run initial development server to verify setup:
```bash
pnpm dev
```

Your basic project is now ready with Next.js 15, JavaScript, Tailwind CSS, and Drizzle ORM configured.