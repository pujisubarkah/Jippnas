import { pgTable, bigserial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const upp = pgTable('master_upp', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  id_instansi: varchar('id_instansi'),
  nama: text('nama'),
  keterangan: text('keterangan'),
  is_del: boolean('is_del').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});