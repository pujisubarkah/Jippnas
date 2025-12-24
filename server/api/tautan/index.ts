import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { tautan } from '../../../drizzle/schema/tautan';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allTautan = await db.select({
        id: tautan.id,
        nama: tautan.nama,
        tautan: tautan.tautan,
        created_at: tautan.created_at,
        updated_at: tautan.updated_at
      }).from(tautan);

      return { success: true, data: allTautan };
    } catch (error) {
      console.error('Error fetching tautan:', error);
      return { error: 'Failed to fetch tautan' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { nama, tautan: tautanUrl } = body;

      if (!nama || !tautanUrl) {
        return { error: 'Nama and tautan are required.' };
      }

      const newTautan = await db.insert(tautan).values({
        nama,
        tautan: tautanUrl
      }).returning({
        id: tautan.id,
        nama: tautan.nama,
        tautan: tautan.tautan,
        created_at: tautan.created_at,
        updated_at: tautan.updated_at
      });

      return { success: true, data: newTautan[0] };
    } catch (error) {
      console.error('Error creating tautan:', error);
      return { error: 'Failed to create tautan' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});