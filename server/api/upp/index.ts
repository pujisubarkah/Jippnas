import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { upp } from '../../../drizzle/schema/upp';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allUpp = await db.select({
        id: upp.id,
        id_instansi: upp.id_instansi,
        nama: upp.nama,
        keterangan: upp.keterangan,
        is_del: upp.is_del,
        created_at: upp.created_at,
        updated_at: upp.updated_at
      }).from(upp).where(eq(upp.is_del, false));

      return { success: true, data: allUpp };
    } catch (error) {
      console.error('Error fetching upp:', error);
      return { error: 'Failed to fetch upp' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { id_instansi, nama, keterangan } = body;

      if (!id_instansi || !nama) {
        return { error: 'id_instansi and nama are required.' };
      }

      const newUpp = await db.insert(upp).values({
        id_instansi,
        nama,
        keterangan,
        is_del: false
      }).returning({
        id: upp.id,
        id_instansi: upp.id_instansi,
        nama: upp.nama,
        keterangan: upp.keterangan,
        is_del: upp.is_del,
        created_at: upp.created_at,
        updated_at: upp.updated_at
      });

      return { success: true, data: newUpp[0] };
    } catch (error) {
      console.error('Error creating upp:', error);
      return { error: 'Failed to create upp' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});