import { pgTable, serial, date, time, text, integer, varchar, char, timestamp } from 'drizzle-orm/pg-core';

export const acara = pgTable('acara', {
  id: serial('id').primaryKey(),
  tgl_acara: date('tgl_acara'),
  jam_acara: time('jam_acara'),
  start_date: date('start_date'),
  end_date: date('end_date'),
  title: text('title'),
  gambar: text('gambar'),
  keterangan: text('keterangan'),
  id_penyelenggara: integer('id_penyelenggara'),
  nm_penyelenggara: varchar('nm_penyelenggara'),
  is_active: char('is_active'),
  created_at: timestamp('created_at', { withTimezone: true }),
  updated_at: timestamp('updated_at', { withTimezone: true }),
});
