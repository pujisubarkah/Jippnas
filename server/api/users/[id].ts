import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { users } from '../../../drizzle/schema/users';
import bcrypt from 'bcrypt';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const id = getRouterParam(event, 'id');

  if (!id) {
    return { error: 'User ID is required' };
  }

  if (method === 'GET') {
    try {
      const user = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        is_verified: users.is_verified,
        created_at: users.created_at,
        updated_at: users.updated_at
      }).from(users).where(eq(users.id, parseInt(id))).limit(1);

      if (!user || user.length === 0) {
        return { error: 'User not found' };
      }

      return { success: true, data: user[0] };
    } catch (error) {
      console.error('Error fetching user:', error);
      return { error: 'Failed to fetch user' };
    }
  } else if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { username, email, password, role, is_verified } = body;

      const updateData: any = {};
      if (username) updateData.username = username;
      if (email) updateData.email = email;
      if (password) updateData.password = await bcrypt.hash(password, 10);
      if (role) updateData.role = role;
      if (is_verified !== undefined) updateData.is_verified = is_verified;
      updateData.updated_at = new Date();

      const updatedUser = await db.update(users)
        .set(updateData)
        .where(eq(users.id, parseInt(id)))
        .returning({
          id: users.id,
          username: users.username,
          email: users.email,
          role: users.role,
          is_verified: users.is_verified,
          created_at: users.created_at,
          updated_at: users.updated_at
        });

      if (!updatedUser || updatedUser.length === 0) {
        return { error: 'User not found' };
      }

      return { success: true, data: updatedUser[0] };
    } catch (error) {
      console.error('Error updating user:', error);
      return { error: 'Failed to update user' };
    }
  } else if (method === 'DELETE') {
    try {
      const deletedUser = await db.delete(users).where(eq(users.id, parseInt(id))).returning({
        id: users.id,
        username: users.username,
        email: users.email
      });

      if (!deletedUser || deletedUser.length === 0) {
        return { error: 'User not found' };
      }

      return { success: true, data: deletedUser[0] };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { error: 'Failed to delete user' };
    }
  } else {
    return { error: 'Method not allowed' };
  }
});