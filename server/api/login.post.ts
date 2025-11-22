import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { users } from '../../drizzle/schema/users';
import bcrypt from 'bcrypt';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, email, password } = body;

  if ((!username && !email) || !password) {
    return { error: 'Username/email and password are required.' };
  }

  // Find user by username or email
  let user;
  if (username) {
    user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  } else if (email) {
    user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  }

  if (!user || !user.length) {
    return { error: 'Invalid credentials.' };
  }

  const foundUser = user[0];
  const passwordMatch = await bcrypt.compare(password, String(foundUser.password));
  if (!passwordMatch) {
    return { error: 'Invalid credentials.' };
  }

  // Optionally, return user info (without password)
  const { password: _, ...userData } = foundUser;
  return { success: true, user: userData };
});
