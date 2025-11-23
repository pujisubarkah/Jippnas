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
        username: users.username,
        email: users.email,
        role: users.role,
        is_verified: users.is_verified,
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
      const { username, email, password, role } = body;

      if (!username || !email || !password || !role) {
        return { error: 'Username, email, password, and role are required.' };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await db.insert(users).values({
        username,
        email,
        password: hashedPassword,
        role,
        is_verified: false
      }).returning({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        is_verified: users.is_verified,
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