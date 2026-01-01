import { drizzle } from 'drizzle-orm/postgres-js';
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
      }).from(instansi);

      return { success: true, data: allInstansi };
    } catch (error) {
      console.error('Error fetching instansi:', error);
      return { error: 'Failed to fetch instansi' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { id, id_wilayah, nama, singkatan, jenis, logo, koordinator, alamat, telepon, lat, lng, stshub, is_active } = body;

      if (!id || !nama) {
        return { error: 'ID and Nama are required.' };
      }

      const newInstansi = await db.insert(instansi).values({
        id,
        id_wilayah,
        nama,
        singkatan,
        jenis,
        logo,
        koordinator,
        alamat,
        telepon,
        lat,
        lng,
        stshub: stshub || false,
        is_active: is_active !== undefined ? is_active : true
      }).returning({
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

      return { success: true, data: newInstansi[0] };
    } catch (error) {
      console.error('Error creating instansi:', error);
      return { error: 'Failed to create instansi' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});