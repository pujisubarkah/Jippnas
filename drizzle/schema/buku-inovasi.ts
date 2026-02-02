import { pgSchema, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const bukuInovasi = jippnasSchema.table('buku_inovasi', {
  id: serial('id').primaryKey(),
  judul: varchar('judul'),
  gambar: text('gambar'),
  sinopsis: text('sinopsis'),
  file: varchar('file'),
  uploaded_by: varchar('uploaded_by'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});