import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { penghargaan } from '../../../drizzle/schema/penghargaan';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allPenghargaan = await db.select().from(penghargaan);
      return { success: true, data: allPenghargaan };
    } catch (error) {
      console.error('Error fetching penghargaan:', error);
      return { error: 'Failed to fetch penghargaan' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { nama, gambar, keterangan, status } = body;

      if (!nama) {
        return { error: 'nama is required.' };
      }

      const newPenghargaan = await db.insert(penghargaan).values({
        nama,
        gambar,
        keterangan,
        status: status !== undefined ? status : true
      }).returning();

      return { success: true, data: newPenghargaan[0] };
    } catch (error) {
      console.error('Error creating penghargaan:', error);
      return { error: 'Failed to create penghargaan' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});