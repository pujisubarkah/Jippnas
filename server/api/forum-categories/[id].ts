import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { forumCategories } from '~/drizzle/schema/forum'

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
    // Get forum category by ID
    try {
      const category = await db.select().from(forumCategories).where(eq(forumCategories.id, id)).limit(1)
      if (category.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum category not found'
        })
      }
      return { success: true, data: category[0] }
    } catch (error) {
      console.error('Error fetching forum category:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum category'
      })
    }
  }

  if (method === 'PUT') {
    // Update forum category by ID
    try {
      const body = await readBody(event)
      const { name, description, icon, color, sortOrder, isActive } = body

      if (!name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Category name is required'
        })
      }

      const updatedCategory = await db
        .update(forumCategories)
        .set({
          name,
          description,
          icon,
          color,
          sortOrder,
          isActive,
          updatedAt: new Date()
        })
        .where(eq(forumCategories.id, id))
        .returning()

      if (updatedCategory.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum category not found'
        })
      }

      return { success: true, data: updatedCategory[0] }
    } catch (error) {
      console.error('Error updating forum category:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update forum category'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete forum category by ID
    try {
      const deletedCategory = await db
        .delete(forumCategories)
        .where(eq(forumCategories.id, id))
        .returning()

      if (deletedCategory.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum category not found'
        })
      }

      return { success: true, message: 'Forum category deleted successfully' }
    } catch (error) {
      console.error('Error deleting forum category:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete forum category'
      })
    }
  }
})