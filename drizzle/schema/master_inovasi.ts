import { pgSchema, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const masterInovasi = jippnasSchema.table('master_inovasi', {
  id: serial('id').primaryKey(),
  judul: varchar('judul'),
  gambar: varchar('gambar'),
  file: varchar('file'),
  keterangan: text('keterangan'),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});