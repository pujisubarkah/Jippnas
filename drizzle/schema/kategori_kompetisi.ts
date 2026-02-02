import { pgSchema, bigserial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const kategoriKompetisi = jippnasSchema.table('master_kompetisi', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  id_instansi: varchar('id_instansi'),
  nama: varchar('nama'),
  keterangan: varchar('keterangan'),
  gambar: text('gambar'),
  is_active: boolean('is_active'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});