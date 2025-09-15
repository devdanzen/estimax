import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function createSearchIndexes() {
  try {
    console.log('Creating search indexes...');
    
    // Index for material_reference (exact matches)
    await sql`CREATE INDEX IF NOT EXISTS idx_materials_reference ON materials(material_reference)`;
    console.log('✓ Created index on material_reference');
    
    // Index for description (text searches) 
    await sql`CREATE INDEX IF NOT EXISTS idx_materials_description ON materials USING gin(to_tsvector('english', description))`;
    console.log('✓ Created full-text search index on description');
    
    // Composite index for mpg + activity (common filtering)
    await sql`CREATE INDEX IF NOT EXISTS idx_materials_mpg_activity ON materials(mpg, activity)`;
    console.log('✓ Created composite index on mpg + activity');
    
    console.log('✅ All search indexes created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
    process.exit(1);
  }
}

createSearchIndexes();