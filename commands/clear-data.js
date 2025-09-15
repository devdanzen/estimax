import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function clearAllData() {
  try {
    console.log('Clearing all data from materials table...');
    
    // Delete all records from materials table
    const result = await sql`DELETE FROM materials`;
    
    console.log(`✅ Deleted ${result.rowCount} records from materials table`);
    
    // Reset the sequence to start from 1
    await sql`ALTER SEQUENCE materials_id_seq RESTART WITH 1`;
    console.log('✅ Reset ID sequence to start from 1');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
}

clearAllData();