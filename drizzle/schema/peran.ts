import { pgTable, bigint, varchar, timestamp } from 'drizzle-orm/pg-core';

export const masterPeran = pgTable('master_peran', {
  id: bigint('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama'),
  keterangan: varchar('keterangan'),
  created_at: timestamp('created_at', { withTimezone: true }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});
