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

  // Verify the token with Google (simplified, in production use Google's API)
  // For now, assume token is valid and extract user info
  // In real implementation, verify with https://oauth2.googleapis.com/tokeninfo?id_token=${token}

  // Mock user data from Google
  const googleUser = {
    id: 'google_id',
    email: 'user@gmail.com',
    name: 'Google User',
    picture: 'https://...'
  };

  // Check if user exists by email or google_id
  let user = await db.select().from(users).where(eq(users.google_id, googleUser.id)).limit(1);
  
  if (!user || !user.length) {
    user = await db.select().from(users).where(eq(users.email, googleUser.email)).limit(1);
  }

  if (!user || !user.length) {
    // Create new user
    const newUser = await db.insert(users).values({
      email: googleUser.email,
      username: googleUser.name,
      name: googleUser.name,
      google_id: googleUser.id,
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
        google_id: foundUser.google_id || googleUser.id,
        updated_at: new Date()
      })
      .where(eq(users.id, foundUser.id));
  }

  const foundUser = user[0];
  
  // Check if user is deleted or inactive
  if (foundUser.is_del === '1' || foundUser.is_active === '0') {
    return { error: 'Account is not active.' };
  }
  
  const { password: _, ...userData } = foundUser;
  return { success: true, user: userData };
});