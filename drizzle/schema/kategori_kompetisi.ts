import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const kategoriKompetisi = pgTable('kategori_kompetisi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull(),
  keterangan: text('keterangan'),
  gambar: text('gambar'),
  status: varchar('status', { length: 50 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: false }).defaultNow(),
});