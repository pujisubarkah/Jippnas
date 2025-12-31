import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { masterPeran } from '../../../drizzle/schema/peran';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allPeran = await db.select({
        id: masterPeran.id,
        nama: masterPeran.nama,
        keterangan: masterPeran.keterangan,
        created_at: masterPeran.created_at,
        updated_at: masterPeran.updated_at
      }).from(masterPeran);

      return { success: true, data: allPeran };
    } catch (error) {
      console.error('Error fetching peran:', error);
      return { error: 'Failed to fetch peran' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { id, nama, keterangan } = body;

      if (!id || !nama) {
        return { error: 'ID and nama peran are required.' };
      }

      const newPeran = await db.insert(masterPeran).values({
        id,
        nama,
        keterangan,
        created_at: new Date(),
        updated_at: new Date()
      }).returning({
        id: masterPeran.id,
        nama: masterPeran.nama,
        keterangan: masterPeran.keterangan,
        created_at: masterPeran.created_at,
        updated_at: masterPeran.updated_at
      });

      return { success: true, data: newPeran[0] };
    } catch (error) {
      console.error('Error creating peran:', error);
      return { error: 'Failed to create peran' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { id, nama, keterangan } = body;

      if (!id || !nama) {
        return { error: 'ID and nama peran are required.' };
      }

      const updatedPeran = await db.update(masterPeran)
        .set({
          nama,
          keterangan,
          updated_at: new Date()
        })
        .where(eq(masterPeran.id, id))
        .returning({
          id: masterPeran.id,
          nama: masterPeran.nama,
          keterangan: masterPeran.keterangan,
          created_at: masterPeran.created_at,
          updated_at: masterPeran.updated_at
        });

      if (updatedPeran.length === 0) {
        return { error: 'Peran not found' };
      }

      return { success: true, data: updatedPeran[0] };
    } catch (error) {
      console.error('Error updating peran:', error);
      return { error: 'Failed to update peran' };
    }
  } else if (method === 'DELETE') {
    try {
      const body = await readBody(event);
      const { id } = body;

      if (!id) {
        return { error: 'ID is required.' };
      }

      const deletedPeran = await db.delete(masterPeran)
        .where(eq(masterPeran.id, id))
        .returning({
          id: masterPeran.id,
          nama: masterPeran.nama,
          keterangan: masterPeran.keterangan
        });

      if (deletedPeran.length === 0) {
        return { error: 'Peran not found' };
      }

      return { success: true, data: deletedPeran[0] };
    } catch (error) {
      console.error('Error deleting peran:', error);
      return { error: 'Failed to delete peran' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});