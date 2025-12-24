import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { instansi } from '../../../drizzle/schema/instansi';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = getRouterParam(event, 'id');

  if (!id) {
    return { error: 'Instansi ID is required' };
  }

  if (method === 'GET') {
    try {
      const instansiData = await db.select({
        id: instansi.id,
        nama: instansi.nama,
        singkatan: instansi.singkatan,
        alamat: instansi.alamat,
        telp: instansi.telp,
        status_hub: instansi.status_hub,
        created_at: instansi.created_at,
        updated_at: instansi.updated_at
      }).from(instansi).where(eq(instansi.id, parseInt(id))).limit(1);

      if (!instansiData || instansiData.length === 0) {
        return { error: 'Instansi not found' };
      }

      return { success: true, data: instansiData[0] };
    } catch (error) {
      console.error('Error fetching instansi:', error);
      return { error: 'Failed to fetch instansi' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { nama, singkatan, alamat, telp, status_hub } = body;

      const updateData: any = {};
      if (nama) updateData.nama = nama;
      if (singkatan) updateData.singkatan = singkatan;
      if (alamat) updateData.alamat = alamat;
      if (telp) updateData.telp = telp;
      if (status_hub !== undefined) updateData.status_hub = status_hub;
      updateData.updated_at = new Date();

      const updatedInstansi = await db.update(instansi)
        .set(updateData)
        .where(eq(instansi.id, parseInt(id)))
        .returning({
          id: instansi.id,
          nama: instansi.nama,
          singkatan: instansi.singkatan,
          alamat: instansi.alamat,
          telp: instansi.telp,
          status_hub: instansi.status_hub,
          created_at: instansi.created_at,
          updated_at: instansi.updated_at
        });

      if (!updatedInstansi || updatedInstansi.length === 0) {
        return { error: 'Instansi not found' };
      }

      return { success: true, data: updatedInstansi[0] };
    } catch (error) {
      console.error('Error updating instansi:', error);
      return { error: 'Failed to update instansi' };
    }
  } else if (method === 'DELETE') {
    try {
      const deletedInstansi = await db.delete(instansi)
        .where(eq(instansi.id, parseInt(id)))
        .returning({ id: instansi.id });

      if (!deletedInstansi || deletedInstansi.length === 0) {
        return { error: 'Instansi not found' };
      }

      return { success: true, message: 'Instansi deleted successfully' };
    } catch (error) {
      console.error('Error deleting instansi:', error);
      return { error: 'Failed to delete instansi' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});