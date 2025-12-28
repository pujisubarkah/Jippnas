import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { forumCategories } from '~/drizzle/schema/forum'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all forum categories
    try {
      const categories = await db.select().from(forumCategories).where(eq(forumCategories.isActive, true)).orderBy(forumCategories.sortOrder)
      return { success: true, data: categories }
    } catch (error) {
      console.error('Error fetching forum categories:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum categories'
      })
    }
  }

  if (method === 'POST') {
    // Create new forum category
    try {
      const body = await readBody(event)
      const { name, description, icon, color, sortOrder } = body

      if (!name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Category name is required'
        })
      }

      const newCategory = await db.insert(forumCategories).values({
        name,
        description,
        icon,
        color: color || '#3B82F6',
        sortOrder: sortOrder || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning()

      return { success: true, data: newCategory[0] }
    } catch (error) {
      console.error('Error creating forum category:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create forum category'
      })
    }
  }
})