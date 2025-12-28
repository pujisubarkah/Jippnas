import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { forumUsers } from '~/drizzle/schema/forum'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  if (method === 'GET') {
    // Get forum user by ID
    try {
      const user = await db.select().from(forumUsers).where(eq(forumUsers.id, id)).limit(1)
      if (user.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum user not found'
        })
      }
      return { success: true, data: user[0] }
    } catch (error) {
      console.error('Error fetching forum user:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum user'
      })
    }
  }

  if (method === 'PUT') {
    // Update forum user by ID
    try {
      const body = await readBody(event)
      const { displayName, avatarUrl, bio, reputation, isActive, role } = body

      const updatedUser = await db
        .update(forumUsers)
        .set({
          displayName,
          avatarUrl,
          bio,
          reputation,
          isActive,
          role,
          lastActive: new Date(),
          updatedAt: new Date()
        })
        .where(eq(forumUsers.id, id))
        .returning()

      if (updatedUser.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum user not found'
        })
      }

      return { success: true, data: updatedUser[0] }
    } catch (error) {
      console.error('Error updating forum user:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update forum user'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete forum user by ID (soft delete by setting is_active to false)
    try {
      const updatedUser = await db
        .update(forumUsers)
        .set({
          isActive: false,
          updatedAt: new Date()
        })
        .where(eq(forumUsers.id, id))
        .returning()

      if (updatedUser.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum user not found'
        })
      }

      return { success: true, message: 'Forum user deactivated successfully' }
    } catch (error) {
      console.error('Error deactivating forum user:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to deactivate forum user'
      })
    }
  }
})