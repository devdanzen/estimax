import { integer, pgTable, varchar, bigint } from 'drizzle-orm/pg-core';

export const materials = pgTable('materials', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  mpg: varchar({ length: 100 }).notNull(),
  activity: varchar({ length: 255 }).notNull(),
  materialReference: varchar('material_reference', { length: 255 }).notNull(),
  description: varchar({ length: 500 }).notNull(),
  priceList: bigint('price_list', { mode: 'number' }).notNull(),
});