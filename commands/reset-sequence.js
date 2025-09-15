import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function resetSequence() {
  try {
    // Reset the sequence to start from 1
    await sql`ALTER SEQUENCE materials_id_seq RESTART WITH 1`;
    console.log('✅ Sequence reset to 1');
  } catch (error) {
    console.error('❌ Error resetting sequence:', error);
  }
}

resetSequence();