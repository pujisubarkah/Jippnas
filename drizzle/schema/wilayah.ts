import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const wilayah = pgTable('wilayah', {
  id: text('id').primaryKey(), // String karena kode seperti '96', '92.71'
  nama: text('nama').notNull(),
  jenis: text('jenis'), // Nullable, e.g., 'Pemkab', 'Pemkot'
  ibukota: text('ibukota'), // Nullable
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});