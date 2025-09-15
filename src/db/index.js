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

export async function searchByReference(reference) {
  return await db.select().from(schema.materials).where(
    eq(schema.materials.materialReference, reference)
  );
}

export async function createMaterial(materialData) {
  return await db.insert(schema.materials).values(materialData);
}