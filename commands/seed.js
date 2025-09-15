import { createMaterial } from '../src/db/index.js';
import { readFileSync } from 'fs';

async function seedDatabase() {
  try {
    console.log('Loading materials from JSON file...');
    
    // Read and parse the JSON file
    const rawData = readFileSync('./src/data/material.json', 'utf-8');
    const materialsData = JSON.parse(rawData);
    
    console.log(`Found ${materialsData.length} materials to seed...`);
    
    let count = 0;
    for (const material of materialsData) {
      // Convert snake_case to camelCase and clean price
      const cleanMaterial = {
        mpg: material.mpg,
        activity: material.activity,
        materialReference: material.material_reference,
        description: material.description,
        priceList: typeof material.price_list === 'string' 
          ? parseInt(material.price_list.replace(/,/g, ''))
          : material.price_list // Already a number
      };
      
      await createMaterial(cleanMaterial);
      count++;
      
      if (count % 100 === 0) {
        console.log(`✓ Seeded ${count} materials...`);
      }
    }
    
    console.log(`✅ Database seeded successfully with ${count} materials!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error(error.message);
    process.exit(1);
  }
}

seedDatabase();