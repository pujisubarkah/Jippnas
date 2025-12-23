import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const bukuInovasi = pgTable('buku_inovasi', {
  id: serial('id').primaryKey(),
  judul: varchar('judul'),
  gambar: text('gambar'),
  sinopsis: text('sinopsis'),
  file: varchar('file'),
  uploaded_by: varchar('uploaded_by'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});