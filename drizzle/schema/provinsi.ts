import { pgSchema, serial, integer, varchar, text, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const provinsi = jippnasSchema.table('provinsi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama'),
  svg_path: text('svg_path'),
  id_provinsi: integer('id_provinsi'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
});