import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { sdgs } from '../../../drizzle/schema/sdgs';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = getRouterParam(event, 'id');

  if (!id) {
    return { error: 'SDGs ID is required' };
  }

  if (method === 'GET') {
    try {
      const sdg = await db.select().from(sdgs).where(eq(sdgs.id, parseInt(id))).limit(1);

      if (!sdg || sdg.length === 0) {
        return { error: 'SDGs not found' };
      }

      return { success: true, data: sdg[0] };
    } catch (error) {
      console.error('Error fetching sdgs:', error);
      return { error: 'Failed to fetch sdgs' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { nama_id, nama_en, icon_base64, status } = body;

      const updateData: any = {};
      if (nama_id !== undefined) updateData.nama_id = nama_id;
      if (nama_en !== undefined) updateData.nama_en = nama_en;
      if (icon_base64 !== undefined) updateData.icon_base64 = icon_base64;
      if (status !== undefined) updateData.status = status;

      const updatedSdgs = await db.update(sdgs)
        .set(updateData)
        .where(eq(sdgs.id, parseInt(id)))
        .returning();

      if (!updatedSdgs || updatedSdgs.length === 0) {
        return { error: 'SDGs not found' };
      }

      return { success: true, data: updatedSdgs[0] };
    } catch (error) {
      console.error('Error updating sdgs:', error);
      return { error: 'Failed to update sdgs' };
    }
  } else if (method === 'DELETE') {
    try {
      const deletedSdgs = await db.delete(sdgs).where(eq(sdgs.id, parseInt(id))).returning({
        id: sdgs.id,
        nama_id: sdgs.nama_id,
        nama_en: sdgs.nama_en
      });

      if (!deletedSdgs || deletedSdgs.length === 0) {
        return { error: 'SDGs not found' };
      }

      return { success: true, data: deletedSdgs[0] };
    } catch (error) {
      console.error('Error deleting sdgs:', error);
      return { error: 'Failed to delete sdgs' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});