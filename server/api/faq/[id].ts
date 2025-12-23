import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { faq } from '~/drizzle/schema/faq'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(getRouterParam(event, 'id')!)

  if (method === 'GET') {
    // Get faq by ID
    try {
      const faqItem = await db.select().from(faq).where(eq(faq.id, id))
      if (faqItem.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'FAQ not found'
        })
      }
      return { success: true, data: faqItem[0] }
    } catch (error) {
      console.error('Error fetching faq:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch faq'
      })
    }
  }

  if (method === 'PUT') {
    // Update faq by ID
    try {
      const body = await readBody(event)
      const { pertanyaan, jawaban, status } = body

      const updatedFaq = await db.update(faq).set({
        pertanyaan,
        jawaban,
        status,
        updated_at: new Date()
      }).where(eq(faq.id, id)).returning()

      if (updatedFaq.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'FAQ not found'
        })
      }

      return { success: true, data: updatedFaq[0] }
    } catch (error) {
      console.error('Error updating faq:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update faq'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete faq by ID
    try {
      const deletedFaq = await db.delete(faq).where(eq(faq.id, id)).returning()

      if (deletedFaq.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'FAQ not found'
        })
      }

      return { success: true, message: 'FAQ deleted successfully' }
    } catch (error) {
      console.error('Error deleting faq:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete faq'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})