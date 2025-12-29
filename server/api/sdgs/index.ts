import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sdgs } from '../../../drizzle/schema/sdgs';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allSdgs = await db.select().from(sdgs);
      return { success: true, data: allSdgs };
    } catch (error) {
      console.error('Error fetching sdgs:', error);
      return { error: 'Failed to fetch sdgs' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { nama_id, nama_en, icon_base64, status } = body;

      if (!nama_id || !nama_en) {
        return { error: 'nama_id and nama_en are required.' };
      }

      const newSdgs = await db.insert(sdgs).values({
        nama_id,
        nama_en,
        icon_base64,
        status: status !== undefined ? status : true
      }).returning();

      return { success: true, data: newSdgs[0] };
    } catch (error) {
      console.error('Error creating sdgs:', error);
      return { error: 'Failed to create sdgs' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});