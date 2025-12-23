import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const masterInovasi = pgTable('master_inovasi', {
  id: serial('id').primaryKey(),
  judul: varchar('judul'),
  gambar: varchar('gambar'),
  file: varchar('file'),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});