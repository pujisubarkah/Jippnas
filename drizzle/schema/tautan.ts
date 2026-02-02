import { pgSchema, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const tautan = jippnasSchema.table('tautan', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }),
  tautan: text('tautan'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});