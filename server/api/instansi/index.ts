import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { instansi } from '../../../drizzle/schema/instansi';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allInstansi = await db.select({
        id: instansi.id,
        nama: instansi.nama,
        singkatan: instansi.singkatan,
        alamat: instansi.alamat,
        telp: instansi.telp,
        status_hub: instansi.status_hub,
        created_at: instansi.created_at,
        updated_at: instansi.updated_at
      }).from(instansi);

      return { success: true, data: allInstansi };
    } catch (error) {
      console.error('Error fetching instansi:', error);
      return { error: 'Failed to fetch instansi' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { nama, singkatan, alamat, telp, status_hub } = body;

      if (!nama) {
        return { error: 'Nama is required.' };
      }

      const newInstansi = await db.insert(instansi).values({
        nama,
        singkatan,
        alamat,
        telp,
        status_hub: status_hub || false
      }).returning({
        id: instansi.id,
        nama: instansi.nama,
        singkatan: instansi.singkatan,
        alamat: instansi.alamat,
        telp: instansi.telp,
        status_hub: instansi.status_hub,
        created_at: instansi.created_at,
        updated_at: instansi.updated_at
      });

      return { success: true, data: newInstansi[0] };
    } catch (error) {
      console.error('Error creating instansi:', error);
      return { error: 'Failed to create instansi' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});