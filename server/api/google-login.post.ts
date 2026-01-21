import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import postgres from 'postgres';
import { users } from '../../drizzle/schema/users';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { token } = body; // Google ID token

  if (!token) {
    return { error: 'Token is required.' };
  }

  // Verify the token with Google
  let googleUser;
  try {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`);
    if (!response.ok) {
      throw new Error('Invalid token');
    }
    googleUser = await response.json();
  } catch (error) {
    console.error('Token verification failed:', error);
    return { error: 'Invalid Google token.' };
  }

  // Check if user exists by email or google_id
  let user = await db.select().from(users).where(eq(users.google_id, googleUser.sub)).limit(1);
  
  if (!user || !user.length) {
    user = await db.select().from(users).where(eq(users.email, googleUser.email)).limit(1);
  }

  if (!user || !user.length) {
    // Create new user
    const newUser = await db.insert(users).values({
      email: googleUser.email,
      username: googleUser.name || googleUser.email.split('@')[0],
      name: googleUser.name || googleUser.email,
      google_id: googleUser.sub,
      id_peran: 1, // Default role, adjust as needed
      is_active: '1',
      is_del: '0',
      created_at: new Date(),
      updated_at: new Date(),
      last_login: new Date(),
    } as any).returning();
    user = newUser;
  } else {
    // Update last login and google_id if not set
    const foundUser = user[0];
    await db.update(users)
      .set({ 
        last_login: new Date(),
        google_id: foundUser.google_id || googleUser.sub,
        updated_at: new Date()
      })
      .where(eq(users.id, foundUser.id));
  }

  const foundUser = user[0];
  
  // Check if user is deleted or inactive
  if (foundUser.is_del === '1' || foundUser.is_active === '0') {
    return { error: 'Account is not active.' };
  }

  // Determine role and redirect path
  let role = 'user';
  let redirectPath = '/';
  
  if (foundUser.id_peran === 2) {
    role = 'admin';
    redirectPath = '/admin/dashboard';
  } else if (foundUser.id_peran === 1) {
    redirectPath = '/';
  } else {
    // For other roles, redirect to /[role]/dashboard
    redirectPath = `/${role}/dashboard`;
  }
  
  const { password: _, ...userData } = foundUser;
  return { success: true, user: userData, role: role, redirectPath: redirectPath };
});