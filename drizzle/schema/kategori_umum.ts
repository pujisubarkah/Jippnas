import { pgTable, bigserial, bigint, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const kategoriUmum = pgTable('master_kategori', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  id_jenis: bigint('id_jenis', { mode: 'number' }),
  nm_jenis: varchar('nm_jenis'),
  nama: text('nama'),
  keterangan: text('keterangan'),
  tahun: varchar('tahun'),
  is_active: text('is_active'),
  is_del: text('is_del'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});