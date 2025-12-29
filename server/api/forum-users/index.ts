import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, desc, asc } from 'drizzle-orm'
import postgres from 'postgres'
import { forumUsers } from '~/drizzle/schema/forum'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all forum users with optional filtering
    try {
      const query = getQuery(event)
      const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc', isActive = true } = query

      const offset = (parseInt(page as string) - 1) * parseInt(limit as string)
      const sortColumn = sortBy === 'reputation' ? forumUsers.reputation :
                         sortBy === 'lastActive' ? forumUsers.lastActive :
                         forumUsers.createdAt
      const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn)

      const users = await db
        .select()
        .from(forumUsers)
        .where(eq(forumUsers.isActive, isActive === 'true'))
        .orderBy(orderBy)
        .limit(parseInt(limit as string))
        .offset(offset)

      // Get total count for pagination
      const totalCount = await db
        .select({ count: forumUsers.id })
        .from(forumUsers)
        .where(eq(forumUsers.isActive, isActive === 'true'))

      return {
        success: true,
        data: users,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount.length,
          totalPages: Math.ceil(totalCount.length / parseInt(limit as string))
        }
      }
    } catch (error) {
      console.error('Error fetching forum users:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum users'
      })
    }
  }

  if (method === 'POST') {
    // Create new forum user
    try {
      const body = await readBody(event)
      const { userId, username, email, displayName, avatarUrl, bio, role = 'member' } = body

      if (!userId || !username || !email || !displayName) {
        throw createError({
          statusCode: 400,
          statusMessage: 'User ID, username, email, and display name are required'
        })
      }

      const newUser = await db
        .insert(forumUsers)
        .values({
          userId,
          username,
          email,
          displayName,
          avatarUrl,
          bio,
          role,
          reputation: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastActive: new Date()
        })
        .returning()

      return { success: true, data: newUser[0] }
    } catch (error) {
      console.error('Error creating forum user:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create forum user'
      })
    }
  }
})