import { pgTable, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

export const instansi = pgTable('master_instansi', {
  id: varchar('id', { length: 100 }).primaryKey(),
  id_wilayah: varchar('id_wilayah', { length: 100 }),
  nama: text('nama'),
  singkatan: varchar('singkatan', { length: 100 }),
  jenis: varchar('jenis', { length: 100 }),
  logo: text('logo'),
  koordinator: text('koordinator'),
  alamat: text('alamat'),
  telepon: varchar('telepon', { length: 20 }),
  lat: varchar('lat', { length: 50 }),
  lng: varchar('lng', { length: 50 }),
  stshub: boolean('stshub'),
  is_active: boolean('is_active'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});