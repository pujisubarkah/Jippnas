import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { surveyInstruments } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all survey instruments
    try {
      const instruments = await db.select().from(surveyInstruments).orderBy(surveyInstruments.createdAt)
      return { success: true, data: instruments }
    } catch (error) {
      console.error('Error fetching survey instruments:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch survey instruments'
      })
    }
  }

  if (method === 'POST') {
    // Create new survey instrument
    try {
      const body = await readBody(event)
      const { title, description, isActive } = body

      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title is required'
        })
      }

      const newInstrument = await db.insert(surveyInstruments).values({
        title,
        description,
        isActive: isActive ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning()

      return { success: true, data: newInstrument[0] }
    } catch (error) {
      console.error('Error creating survey instrument:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create survey instrument'
      })
    }
  }
})