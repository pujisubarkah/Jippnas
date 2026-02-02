import { pgSchema, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const penghargaan = jippnasSchema.table('penghargaan', {
  id: serial('id').primaryKey(),
  nama: text('nama').notNull(),
  gambar: text('gambar'), // Bisa URL atau base64
  keterangan: text('keterangan'),
  status: boolean('status').default(true),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});