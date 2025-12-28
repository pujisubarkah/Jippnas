import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { answerVerifications } from '~/drizzle/schema/survey'

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
    // Get answer verification by ID
    try {
      const verification = await db.select().from(answerVerifications).where(eq(answerVerifications.id, id)).limit(1)
      if (verification.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Answer verification not found'
        })
      }
      return { success: true, data: verification[0] }
    } catch (error) {
      console.error('Error fetching answer verification:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch answer verification'
      })
    }
  }

  if (method === 'PUT') {
    // Update answer verification by ID
    try {
      const body = await readBody(event)
      const { answerId, verifiedOptionIds, verifiedOptionId, verificationStatus, verificationNote, verifiedBy } = body

      if (!answerId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Answer ID is required'
        })
      }

      const updatedVerification = await db
        .update(answerVerifications)
        .set({
          answerId,
          verifiedOptionIds,
          verifiedOptionId,
          verificationStatus,
          verificationNote,
          verifiedBy,
          verifiedAt: new Date()
        })
        .where(eq(answerVerifications.id, id))
        .returning()

      if (updatedVerification.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Answer verification not found'
        })
      }

      return { success: true, data: updatedVerification[0] }
    } catch (error) {
      console.error('Error updating answer verification:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update answer verification'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete answer verification by ID
    try {
      const deletedVerification = await db
        .delete(answerVerifications)
        .where(eq(answerVerifications.id, id))
        .returning()

      if (deletedVerification.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Answer verification not found'
        })
      }

      return { success: true, message: 'Answer verification deleted successfully' }
    } catch (error) {
      console.error('Error deleting answer verification:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete answer verification'
      })
    }
  }
})