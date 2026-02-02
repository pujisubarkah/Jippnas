import { pgSchema, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const kolaborasiTuxedovation = jippnasSchema.table('kolaborasi_tuxedovation', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  image: varchar('image', { length: 255 }),
  pemda: varchar('pemda', { length: 255 }),
  date: timestamp('date'),
});
