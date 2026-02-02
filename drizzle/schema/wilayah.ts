import { pgSchema, varchar, doublePrecision, real, smallint, text } from 'drizzle-orm/pg-core';

const jippnasSchema = pgSchema('jippnas_new');

export const wilayah = jippnasSchema.table('master_wilayah', {
  kode: varchar('kode').primaryKey(),
  nama: varchar('nama').notNull(),
  ibukota: varchar('ibukota'),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  elv: real('elv'),
  tz: smallint('tz'),
  luas: doublePrecision('luas'),
  penduduk: doublePrecision('penduduk'),
  path: text('path'),
  status: smallint('status'),
});