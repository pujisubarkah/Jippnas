import { pgSchema, serial, text, boolean, timestamp } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const faq = jippnasSchema.table('faq', {
  id: serial('id').primaryKey(),
  pertanyaan: text('pertanyaan'),
  jawaban: text('jawaban'),
  status: boolean('status').default(true),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});