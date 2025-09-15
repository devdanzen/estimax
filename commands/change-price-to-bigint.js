import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function changePriceToBigint() {
  try {
    console.log('Changing price_list column from integer to bigint...');
    
    // Alter the column type to bigint
    await sql`ALTER TABLE materials ALTER COLUMN price_list TYPE bigint USING price_list::bigint`;
    
    console.log('✅ Column changed to bigint successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error changing column type:', error);
    process.exit(1);
  }
}

changePriceToBigint();