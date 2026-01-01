import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { wilayah } from '../../../drizzle/schema/wilayah';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allWilayah = await db.select().from(wilayah);
      return { success: true, data: allWilayah };
    } catch (error) {
      console.error('Error fetching wilayah:', error);
      return { error: 'Failed to fetch wilayah' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { kode, nama, ibukota, lat, lng, elv, tz, luas, penduduk, path, status } = body;

      if (!kode || !nama) {
        return { error: 'kode and nama are required.' };
      }

      const newWilayah = await db.insert(wilayah).values({
        kode,
        nama,
        ibukota,
        lat,
        lng,
        elv,
        tz,
        luas,
        penduduk,
        path,
        status
      }).returning();

      return { success: true, data: newWilayah[0] };
    } catch (error) {
      console.error('Error creating wilayah:', error);
      return { error: 'Failed to create wilayah' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});