import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses } from '~/drizzle/schema/survey'

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
    // Get instrument response by ID
    try {
      const response = await db.select().from(instrumentResponses).where(eq(instrumentResponses.id, id)).limit(1)
      if (response.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument response not found'
        })
      }
      return { success: true, data: response[0] }
    } catch (error) {
      console.error('Error fetching instrument response:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch instrument response'
      })
    }
  }

  if (method === 'PUT') {
    // Update instrument response by ID
    try {
      const body = await readBody(event)
      const { instrumentId, instansi, totalScore, verificationStatus, verifiedAt } = body

      if (!instrumentId || !instansi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Instrument ID and instansi are required'
        })
      }

      const updatedResponse = await db
        .update(instrumentResponses)
        .set({
          instrumentId,
          instansi,
          totalScore,
          verificationStatus,
          verifiedAt
        })
        .where(eq(instrumentResponses.id, id))
        .returning()

      if (updatedResponse.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument response not found'
        })
      }

      return { success: true, data: updatedResponse[0] }
    } catch (error) {
      console.error('Error updating instrument response:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update instrument response'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete instrument response by ID
    try {
      const deletedResponse = await db
        .delete(instrumentResponses)
        .where(eq(instrumentResponses.id, id))
        .returning()

      if (deletedResponse.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument response not found'
        })
      }

      return { success: true, message: 'Instrument response deleted successfully' }
    } catch (error) {
      console.error('Error deleting instrument response:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete instrument response'
      })
    }
  }
})