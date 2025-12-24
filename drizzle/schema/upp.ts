import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const upp = pgTable('upp', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});