import { pgTable, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const penghargaan = pgTable('penghargaan', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  gambar: text('gambar'), // Bisa URL atau base64
  keterangan: text('keterangan'),
  status: boolean('status').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});