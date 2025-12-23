import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const unduhan = pgTable('unduhan', {
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