import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function alterPriceColumn() {
  try {
    console.log('Altering price_list column to support larger values...');
    
    // Alter the column to increase precision
    await sql`ALTER TABLE materials ALTER COLUMN price_list TYPE numeric(15,2)`;
    
    console.log('✅ Column altered successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error altering column:', error);
    process.exit(1);
  }
}

alterPriceColumn();