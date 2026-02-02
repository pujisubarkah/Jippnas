import { pgSchema, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const kategoriSdgs = jippnasSchema.table('kategori_sdgs', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  gambar: text('gambar'),
  keterangan: text('keterangan'),
  tahun: text('tahun'),
  jenis: text('jenis'),
  status: boolean('status').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});