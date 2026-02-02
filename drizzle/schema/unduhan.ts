import { pgSchema, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const unduhan = jippnasSchema.table('unduhan', {
  id: serial('id').primaryKey(),
  judul: varchar('judul'),
  gambar: text('gambar'),
  deskripsi: text('deskripsi'),
  file: varchar('file'),
  status: varchar('status'),
  pdf_url: text('pdf_url'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});