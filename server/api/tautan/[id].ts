import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { tautan } from '../../../drizzle/schema/tautan';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = getRouterParam(event, 'id');

  if (!id) {
    return { error: 'Tautan ID is required' };
  }

  if (method === 'GET') {
    try {
      const tautanData = await db.select({
        id: tautan.id,
        nama: tautan.nama,
        tautan: tautan.tautan,
        created_at: tautan.created_at,
        updated_at: tautan.updated_at
      }).from(tautan).where(eq(tautan.id, parseInt(id))).limit(1);

      if (!tautanData || tautanData.length === 0) {
        return { error: 'Tautan not found' };
      }

      return { success: true, data: tautanData[0] };
    } catch (error) {
      console.error('Error fetching tautan:', error);
      return { error: 'Failed to fetch tautan' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { nama, tautan: tautanUrl } = body;

      const updateData: any = {};
      if (nama) updateData.nama = nama;
      if (tautanUrl) updateData.tautan = tautanUrl;
      updateData.updated_at = new Date();

      const updatedTautan = await db.update(tautan)
        .set(updateData)
        .where(eq(tautan.id, parseInt(id)))
        .returning({
          id: tautan.id,
          nama: tautan.nama,
          tautan: tautan.tautan,
          created_at: tautan.created_at,
          updated_at: tautan.updated_at
        });

      if (!updatedTautan || updatedTautan.length === 0) {
        return { error: 'Tautan not found' };
      }

      return { success: true, data: updatedTautan[0] };
    } catch (error) {
      console.error('Error updating tautan:', error);
      return { error: 'Failed to update tautan' };
    }
  } else if (method === 'DELETE') {
    try {
      const deletedTautan = await db.delete(tautan)
        .where(eq(tautan.id, parseInt(id)))
        .returning({ id: tautan.id });

      if (!deletedTautan || deletedTautan.length === 0) {
        return { error: 'Tautan not found' };
      }

      return { success: true, message: 'Tautan deleted successfully' };
    } catch (error) {
      console.error('Error deleting tautan:', error);
      return { error: 'Failed to delete tautan' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});