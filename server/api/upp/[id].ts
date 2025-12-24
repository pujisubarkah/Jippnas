import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
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
        nama: upp.nama,
        keterangan: upp.keterangan,
        created_at: upp.created_at,
        updated_at: upp.updated_at
      }).from(upp).where(eq(upp.id, parseInt(id))).limit(1);

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
      const { nama, keterangan } = body;

      const updateData: any = {};
      if (nama) updateData.nama = nama;
      if (keterangan) updateData.keterangan = keterangan;
      updateData.updated_at = new Date();

      const updatedUpp = await db.update(upp)
        .set(updateData)
        .where(eq(upp.id, parseInt(id)))
        .returning({
          id: upp.id,
          nama: upp.nama,
          keterangan: upp.keterangan,
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
      const deletedUpp = await db.delete(upp)
        .where(eq(upp.id, parseInt(id)))
        .returning({ id: upp.id });

      if (!deletedUpp || deletedUpp.length === 0) {
        return { error: 'UPP not found' };
      }

      return { success: true, message: 'UPP deleted successfully' };
    } catch (error) {
      console.error('Error deleting upp:', error);
      return { error: 'Failed to delete upp' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});