import { pgTable, serial, integer, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import { users } from './users'; // Asumsikan ada tabel users

export const chatMessages = pgTable('chat_messages', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }), // Nullable untuk guest
  username: varchar('username', { length: 255 }).notNull(), // Tetap wajib, bisa diisi guest
  instansi: varchar('instansi', { length: 255 }), // Cache nama instansi, nullable untuk guest
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});

export const chatRooms = pgTable('chat_rooms', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).default('Live Chat'), // Nama room, bisa default
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});