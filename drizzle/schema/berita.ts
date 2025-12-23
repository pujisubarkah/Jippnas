import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const berita = pgTable('berita', {
  id: serial('id').primaryKey(),
  judul: varchar('judul'),
  deskripsi: text('deskripsi'),
  tag: varchar('tag'),
  img: varchar('img'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});