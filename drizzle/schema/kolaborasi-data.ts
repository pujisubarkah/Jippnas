import { pgTable, serial, varchar, text, timestamp, integer } from 'drizzle-orm/pg-core';

// Tabel untuk menyimpan data dari Inoland
export const kolaborasiInoland = pgTable('kolaborasi_inoland', {
  id: serial('id').primaryKey(),
  external_id: integer('external_id'), // ID dari API eksternal
  judul_inovasi: text('judul_inovasi'),
  tahun: varchar('tahun', { length: 10 }),
  inovator: text('inovator'),
  unit_kerja: text('unit_kerja'),
  deskripsi: text('deskripsi'),
  id_kabkot: integer('id_kabkot'),
  id_sdgs: integer('id_sdgs'),
  sdgs_nama: varchar('sdgs_nama', { length: 255 }),
  agency_id_panrb: varchar('agency_id_panrb', { length: 50 }),
  instansi_nama: text('instansi_nama'),
  provinsi_nama: varchar('provinsi_nama', { length: 255 }),
  kabkot_nama: varchar('kabkot_nama', { length: 255 }),
  raw_data: text('raw_data'), // Simpan JSON lengkap dari API
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Tabel untuk menyimpan data dari Inovasi Proper Peserta
export const kolaborasiInovasiProper = pgTable('kolaborasi_inovasi_proper', {
  id: serial('id').primaryKey(),
  external_id: integer('external_id'), // ID dari API eksternal
  judul: text('judul'),
  tahun: integer('tahun'),
  angkatan: integer('angkatan'),
  nama: text('nama'),
  instansi_nama: text('instansi_nama'),
  kategori_nama: varchar('kategori_nama', { length: 255 }),
  deskripsi_singkat: text('deskripsi_singkat'),
  deskripsi_lengkap: text('deskripsi_lengkap'),
  link_youtube: varchar('link_youtube', { length: 500 }),
  raw_data: text('raw_data'), // Simpan JSON lengkap dari API
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
