import { serial, varchar, text, timestamp, pgSchema } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const course = jippnasSchema.table('course', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description').notNull(),
  mentor: varchar('mentor', { length: 255 }).notNull(),
  img: varchar('img', { length: 500 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});