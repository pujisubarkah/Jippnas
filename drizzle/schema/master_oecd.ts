import { pgSchema, bigserial, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const masterOecd = jippnasSchema.table('master_oecd', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  nama: varchar('nama', { length: 255 }).notNull(),
  keterangan: text('keterangan'),
  gambar: text('gambar'),
  isActive: boolean('is_active').default(true),
  isDel: boolean('is_del').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});