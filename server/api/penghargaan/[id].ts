import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { penghargaan } from '../../../drizzle/schema/penghargaan';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = getRouterParam(event, 'id');

  if (!id) {
    return { error: 'Penghargaan ID is required' };
  }

  if (method === 'GET') {
    try {
      const penghargaanItem = await db.select().from(penghargaan).where(eq(penghargaan.id, parseInt(id))).limit(1);

      if (!penghargaanItem || penghargaanItem.length === 0) {
        return { error: 'Penghargaan not found' };
      }

      return { success: true, data: penghargaanItem[0] };
    } catch (error) {
      console.error('Error fetching penghargaan:', error);
      return { error: 'Failed to fetch penghargaan' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { nama, gambar, keterangan, status } = body;

      const updateData: any = {};
      if (nama !== undefined) updateData.nama = nama;
      if (gambar !== undefined) updateData.gambar = gambar;
      if (keterangan !== undefined) updateData.keterangan = keterangan;
      if (status !== undefined) updateData.status = status;
      updateData.updated_at = new Date();

      const updatedPenghargaan = await db.update(penghargaan)
        .set(updateData)
        .where(eq(penghargaan.id, parseInt(id)))
        .returning();

      if (!updatedPenghargaan || updatedPenghargaan.length === 0) {
        return { error: 'Penghargaan not found' };
      }

      return { success: true, data: updatedPenghargaan[0] };
    } catch (error) {
      console.error('Error updating penghargaan:', error);
      return { error: 'Failed to update penghargaan' };
    }
  } else if (method === 'DELETE') {
    try {
      const deletedPenghargaan = await db.delete(penghargaan).where(eq(penghargaan.id, parseInt(id))).returning({
        id: penghargaan.id,
        nama: penghargaan.nama
      });

      if (!deletedPenghargaan || deletedPenghargaan.length === 0) {
        return { error: 'Penghargaan not found' };
      }

      return { success: true, data: deletedPenghargaan[0] };
    } catch (error) {
      console.error('Error deleting penghargaan:', error);
      return { error: 'Failed to delete penghargaan' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});