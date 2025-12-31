import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
// Update the import path to the correct location of your users schema
// Update the import path below to the correct location of your users schema file
import { users } from '../../../drizzle/schema/users'; // Example: if your schema is exported from 'schema.ts' as 'users'
import bcrypt from 'bcrypt';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const allUsers = await db.select({
        id: users.id,
        id_pengguna: users.id_pengguna,
        id_peran: users.id_peran,
        id_instansi: users.id_instansi,
        id_wilayah: users.id_wilayah,
        id_upp: users.id_upp,
        name: users.name,
        username: users.username,
        email: users.email,
        telp: users.telp,
        nm_peran: users.nm_peran,
        nm_instansi: users.nm_instansi,
        nm_upp: users.nm_upp,
        nm_wilayah: users.nm_wilayah,
        is_active: users.is_active,
        is_del: users.is_del,
        last_login: users.last_login,
        created_at: users.created_at,
        updated_at: users.updated_at
      }).from(users);

      return { success: true, data: allUsers };
    } catch (error) {
      console.error('Error fetching users:', error);
      return { error: 'Failed to fetch users' };
    }
  } else if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { username, email, password, name, id_peran, id_instansi, id_wilayah, telp } = body;

      if (!username || !email || !password) {
        return { error: 'Username, email, and password are required.' };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        name,
        id_peran,
        id_instansi,
        id_wilayah,
        telp,
        is_active: '1',
        is_del: '0',
        is_changepass: '0',
        created_at: new Date(),
        updated_at: new Date()
      } as any).returning({
        id: users.id,
        id_pengguna: users.id_pengguna,
        id_peran: users.id_peran,
        id_instansi: users.id_instansi,
        name: users.name,
        username: users.username,
        email: users.email,
        telp: users.telp,
        nm_peran: users.nm_peran,
        nm_instansi: users.nm_instansi,
        is_active: users.is_active,
        created_at: users.created_at,
        updated_at: users.updated_at
      });

      return { success: true, data: newUser[0] };
    } catch (error) {
      console.error('Error creating user:', error);
      return { error: 'Failed to create user' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});