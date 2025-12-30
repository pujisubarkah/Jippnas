import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const course = pgTable('course', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description').notNull(),
  mentor: varchar('mentor', { length: 255 }).notNull(),
  img: varchar('img', { length: 500 }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});