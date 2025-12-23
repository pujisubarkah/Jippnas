import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { faq } from '~/drizzle/schema/faq'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all faq
    try {
      const faqList = await db.select().from(faq).orderBy(faq.created_at)
      return { success: true, data: faqList }
    } catch (error) {
      console.error('Error fetching faq:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch faq'
      })
    }
  }

  if (method === 'POST') {
    // Create new faq
    try {
      const body = await readBody(event)
      const { pertanyaan, jawaban, status } = body

      if (!pertanyaan || !jawaban) {
        throw createError({
          statusCode: 400,
          statusMessage: 'pertanyaan and jawaban are required'
        })
      }

      const newFaq = await db.insert(faq).values({
        pertanyaan,
        jawaban,
        status: status !== undefined ? status : true,
        created_at: new Date(),
        updated_at: new Date()
      }).returning()

      return { success: true, data: newFaq[0] }
    } catch (error) {
      console.error('Error creating faq:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create faq'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})