import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function changePriceToInteger() {
  try {
    console.log('Changing price_list column from decimal to integer...');
    
    // Alter the column type to integer
    await sql`ALTER TABLE materials ALTER COLUMN price_list TYPE integer USING price_list::integer`;
    
    console.log('✅ Column changed to integer successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error changing column type:', error);
    process.exit(1);
  }
}

changePriceToInteger();