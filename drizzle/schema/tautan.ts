import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const tautan = pgTable('tautan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }),
  tautan: text('tautan'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});