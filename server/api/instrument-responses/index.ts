import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all instrument responses
    try {
      const responses = await db.select().from(instrumentResponses).orderBy(instrumentResponses.createdAt)
      return { success: true, data: responses }
    } catch (error) {
      console.error('Error fetching instrument responses:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch instrument responses'
      })
    }
  }

  if (method === 'POST') {
    // Create new instrument response
    try {
      const body = await readBody(event)
      const { instrumentId, instansi, totalScore, verificationStatus } = body

      if (!instrumentId || !instansi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Instrument ID and instansi are required'
        })
      }

      const newResponse = await db.insert(instrumentResponses).values({
        instrumentId,
        instansi,
        totalScore: totalScore ?? 0,
        verificationStatus: verificationStatus ?? 'pending',
        submittedAt: new Date(),
        createdAt: new Date()
      }).returning()

      return { success: true, data: newResponse[0] }
    } catch (error) {
      console.error('Error creating instrument response:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create instrument response'
      })
    }
  }
})