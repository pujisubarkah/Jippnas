import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { wilayah } from '../../../drizzle/schema/wilayah';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const kode = getRouterParam(event, 'id');

  if (!kode) {
    return { error: 'Wilayah kode is required' };
  }

  if (method === 'GET') {
    try {
      const wilayahItem = await db.select().from(wilayah).where(eq(wilayah.kode, kode)).limit(1);

      if (!wilayahItem || wilayahItem.length === 0) {
        return { error: 'Wilayah not found' };
      }

      return { success: true, data: wilayahItem[0] };
    } catch (error) {
      console.error('Error fetching wilayah:', error);
      return { error: 'Failed to fetch wilayah' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { nama, ibukota, lat, lng, elv, tz, luas, penduduk, path, status } = body;

      const updateData: any = {};
      if (nama !== undefined) updateData.nama = nama;
      if (ibukota !== undefined) updateData.ibukota = ibukota;
      if (lat !== undefined) updateData.lat = lat;
      if (lng !== undefined) updateData.lng = lng;
      if (elv !== undefined) updateData.elv = elv;
      if (tz !== undefined) updateData.tz = tz;
      if (luas !== undefined) updateData.luas = luas;
      if (penduduk !== undefined) updateData.penduduk = penduduk;
      if (path !== undefined) updateData.path = path;
      if (status !== undefined) updateData.status = status;

      const updatedWilayah = await db.update(wilayah)
        .set(updateData)
        .where(eq(wilayah.kode, kode))
        .returning();

      if (!updatedWilayah || updatedWilayah.length === 0) {
        return { error: 'Wilayah not found' };
      }

      return { success: true, data: updatedWilayah[0] };
    } catch (error) {
      console.error('Error updating wilayah:', error);
      return { error: 'Failed to update wilayah' };
    }
  } else if (method === 'DELETE') {
    try {
      const deletedWilayah = await db.delete(wilayah).where(eq(wilayah.kode, kode)).returning({
        kode: wilayah.kode,
        nama: wilayah.nama
      });

      if (!deletedWilayah || deletedWilayah.length === 0) {
        return { error: 'Wilayah not found' };
      }

      return { success: true, data: deletedWilayah[0] };
    } catch (error) {
      console.error('Error deleting wilayah:', error);
      return { error: 'Failed to delete wilayah' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});