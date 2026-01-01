import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { kategoriKompetisi } from '~/drizzle/schema/kategori_kompetisi'
import { eq } from 'drizzle-orm'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const id = Number(event.context.params?.id);
  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid or missing kategori_kompetisi id'
    });
  }
  const method = event.node.req.method;

  if (method === 'GET') {
    // Get by id
    try {
      const data = await db.select().from(kategoriKompetisi).where(eq(kategoriKompetisi.id, id));
      return { success: true, data: data[0] };
    } catch (error) {
      console.error('Error fetching kategori_kompetisi by id:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch kategori_kompetisi'
      });
    }
  }

  if (method === 'PUT') {
    // Update
    try {
      const body = await readBody(event);
      await db.update(kategoriKompetisi)
        .set({
          id_instansi: body.id_instansi,
          nama: body.nama,
          keterangan: body.keterangan,
          gambar: body.gambar,
          is_active: body.is_active,
          updated_at: new Date(),
        })
        .where(eq(kategoriKompetisi.id, id));
      return { success: true };
    } catch (error) {
      console.error('Error updating kategori_kompetisi:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update kategori_kompetisi'
      });
    }
  }

  if (method === 'DELETE') {
    // Delete
    try {
      await db.delete(kategoriKompetisi).where(eq(kategoriKompetisi.id, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting kategori_kompetisi:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete kategori_kompetisi'
      });
    }
  }

  // Method not allowed
  event.node.res.statusCode = 405;
  return { success: false, message: 'Method Not Allowed' };
});