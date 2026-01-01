import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { kategoriKompetisi } from '~/drizzle/schema/kategori_kompetisi';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    // Get all
    try {
      const data = await db.select().from(kategoriKompetisi).orderBy(kategoriKompetisi.created_at);
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching kategori_kompetisi:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch kategori_kompetisi',
      });
    }
  }

  if (method === 'POST') {
    // Create new
    try {
      const body = await readBody(event);
      const { id_instansi, nama, keterangan, gambar, is_active } = body;

      if (!nama) {
        throw createError({
          statusCode: 400,
          statusMessage: 'nama is required',
        });
      }

      const inserted = await db
        .insert(kategoriKompetisi)
        .values({
          id_instansi,
          nama,
          keterangan,
          gambar,
          is_active: is_active !== undefined ? is_active : false,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning();
      return { success: true, data: inserted[0] };
    } catch (error) {
      console.error('Error creating kategori_kompetisi:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create kategori_kompetisi',
      });
    }
  }

  // Method not allowed
  event.node.res.statusCode = 405;
  return { success: false, message: 'Method Not Allowed' };
});