import { pgSchema, serial, integer, varchar, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const masterProvinsi = jippnasSchema.table('master_provinsi', {
  id: serial('id').primaryKey(),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  id_provinsi: integer('id_provinsi'),
  nama_provinsi: varchar('nama_provinsi'),
});