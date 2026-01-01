import { drizzle } from 'drizzle-orm/postgres-js';
import { eq, and } from 'drizzle-orm';
import postgres from 'postgres';
import { upp } from '../../../drizzle/schema/upp';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = getRouterParam(event, 'id');

  if (!id) {
    return { error: 'UPP ID is required' };
  }

  if (method === 'GET') {
    try {
      const uppData = await db.select({
        id: upp.id,
        id_instansi: upp.id_instansi,
        nama: upp.nama,
        keterangan: upp.keterangan,
        is_del: upp.is_del,
        created_at: upp.created_at,
        updated_at: upp.updated_at
      }).from(upp).where(and(eq(upp.id, parseInt(id)), eq(upp.is_del, false))).limit(1);

      if (!uppData || uppData.length === 0) {
        return { error: 'UPP not found' };
      }

      return { success: true, data: uppData[0] };
    } catch (error) {
      console.error('Error fetching upp:', error);
      return { error: 'Failed to fetch upp' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { id_instansi, nama, keterangan, is_del } = body;

      const updateData: any = {};
      if (id_instansi !== undefined) updateData.id_instansi = id_instansi;
      if (nama !== undefined) updateData.nama = nama;
      if (keterangan !== undefined) updateData.keterangan = keterangan;
      if (is_del !== undefined) updateData.is_del = is_del;
      updateData.updated_at = new Date();

      const updatedUpp = await db.update(upp)
        .set(updateData)
        .where(eq(upp.id, parseInt(id)))
        .returning({
          id: upp.id,
          id_instansi: upp.id_instansi,
          nama: upp.nama,
          keterangan: upp.keterangan,
          is_del: upp.is_del,
          created_at: upp.created_at,
          updated_at: upp.updated_at
        });

      if (!updatedUpp || updatedUpp.length === 0) {
        return { error: 'UPP not found' };
      }

      return { success: true, data: updatedUpp[0] };
    } catch (error) {
      console.error('Error updating upp:', error);
      return { error: 'Failed to update upp' };
    }
  } else if (method === 'DELETE') {
    try {
      const deletedUpp = await db.update(upp)
        .set({ is_del: true, updated_at: new Date() })
        .where(eq(upp.id, parseInt(id)))
        .returning({ id: upp.id });

      if (!deletedUpp || deletedUpp.length === 0) {
        return { error: 'UPP not found' };
      }

      return { success: true, message: 'UPP soft deleted successfully' };
    } catch (error) {
      console.error('Error soft deleting upp:', error);
      return { error: 'Failed to soft delete upp' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});