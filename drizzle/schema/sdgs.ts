import { pgTable, serial, text, boolean } from 'drizzle-orm/pg-core';

export const sdgs = pgTable('sdgs', {
  id: serial('id').primaryKey(),
  nama_id: text('nama_id'),
  nama_en: text('nama_en'),
  icon_base64: text('icon_base64'),
  status: boolean('status').default(true),
});