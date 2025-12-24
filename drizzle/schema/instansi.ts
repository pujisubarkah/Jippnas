import { pgTable, serial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const instansi = pgTable('instansi', {
  id: serial('id').primaryKey(),
  nama: varchar('nama', { length: 255 }),
  singkatan: varchar('singkatan', { length: 100 }),
  alamat: text('alamat'),
  telp: varchar('telp', { length: 20 }),
  status_hub: boolean('status_hub').default(false),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});