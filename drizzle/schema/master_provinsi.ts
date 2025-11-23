import { pgTable, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

export const masterProvinsi = pgTable('master_provinsi', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  id_provinsi: integer('id_provinsi'),
  nama_provinsi: varchar('nama_provinsi'),
});