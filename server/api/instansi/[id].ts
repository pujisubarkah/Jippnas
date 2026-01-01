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
        id_wilayah: instansi.id_wilayah,
        nama: instansi.nama,
        singkatan: instansi.singkatan,
        jenis: instansi.jenis,
        logo: instansi.logo,
        koordinator: instansi.koordinator,
        alamat: instansi.alamat,
        telepon: instansi.telepon,
        lat: instansi.lat,
        lng: instansi.lng,
        stshub: instansi.stshub,
        is_active: instansi.is_active,
        created_at: instansi.created_at,
        updated_at: instansi.updated_at
      }).from(instansi).where(eq(instansi.id, id)).limit(1);

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
      const { id_wilayah, nama, singkatan, jenis, logo, koordinator, alamat, telepon, lat, lng, stshub, is_active } = body;

      const updateData: any = {};
      if (id_wilayah !== undefined) updateData.id_wilayah = id_wilayah;
      if (nama !== undefined) updateData.nama = nama;
      if (singkatan !== undefined) updateData.singkatan = singkatan;
      if (jenis !== undefined) updateData.jenis = jenis;
      if (logo !== undefined) updateData.logo = logo;
      if (koordinator !== undefined) updateData.koordinator = koordinator;
      if (alamat !== undefined) updateData.alamat = alamat;
      if (telepon !== undefined) updateData.telepon = telepon;
      if (lat !== undefined) updateData.lat = lat;
      if (lng !== undefined) updateData.lng = lng;
      if (stshub !== undefined) updateData.stshub = stshub;
      if (is_active !== undefined) updateData.is_active = is_active;
      updateData.updated_at = new Date();

      const updatedInstansi = await db.update(instansi)
        .set(updateData)
        .where(eq(instansi.id, id))
        .returning({
          id: instansi.id,
          id_wilayah: instansi.id_wilayah,
          nama: instansi.nama,
          singkatan: instansi.singkatan,
          jenis: instansi.jenis,
          logo: instansi.logo,
          koordinator: instansi.koordinator,
          alamat: instansi.alamat,
          telepon: instansi.telepon,
          lat: instansi.lat,
          lng: instansi.lng,
          stshub: instansi.stshub,
          is_active: instansi.is_active,
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
      const deletedInstansi = await db.update(instansi)
        .set({ is_active: false, updated_at: new Date() })
        .where(eq(instansi.id, id))
        .returning({ id: instansi.id });

      if (!deletedInstansi || deletedInstansi.length === 0) {
        return { error: 'Instansi not found' };
      }

      return { success: true, message: 'Instansi deactivated successfully' };
    } catch (error) {
      console.error('Error deactivating instansi:', error);
      return { error: 'Failed to deactivate instansi' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});