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
  let user: any[] = [];
  if (username) {
    user = await db.select().from(users).where(eq(users.username, username)).limit(1);
  } else if (email) {
    user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  }

  if (!user || !user.length) {
    return { error: 'Invalid credentials.' };
  }

  const foundUser = user[0];
  
  // Check if user is deleted or inactive
  if (foundUser.is_del === '1' || foundUser.is_active === '0') {
    return { error: 'Account is not active.' };
  }
  
  const passwordMatch = await bcrypt.compare(password, String(foundUser.password));
  
  if (!passwordMatch) {
    return { error: 'Invalid credentials.' };
  }

  // Update last login
  await db.update(users)
    .set({ last_login: new Date() })
    .where(eq(users.id, foundUser.id));

  // Determine role and redirect path
  let role = 'user';
  let redirectPath = '/';
  
  if (foundUser.id_peran === 2) {
    role = 'admin';
    redirectPath = '/user/dashboard';
  } else if (foundUser.id_peran === 1) {
    redirectPath = '/';
  } else {
    // For other roles, redirect to /[role]/dashboard
    redirectPath = `/${role}/dashboard`;
  }

  // Return user info (without password)
  const { password: _, ...userData } = foundUser;
  return { 
    success: true, 
    user: userData,
    role: role,
    redirectPath: redirectPath
  };
});
