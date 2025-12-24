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
        nama: upp.nama,
        keterangan: upp.keterangan,
        created_at: upp.created_at,
        updated_at: upp.updated_at
      }).from(upp);

      return { success: true, data: allUpp };
    } catch (error) {
      console.error('Error fetching upp:', error);
      return { error: 'Failed to fetch upp' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { nama, keterangan } = body;

      if (!nama) {
        return { error: 'Nama is required.' };
      }

      const newUpp = await db.insert(upp).values({
        nama,
        keterangan
      }).returning({
        id: upp.id,
        nama: upp.nama,
        keterangan: upp.keterangan,
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