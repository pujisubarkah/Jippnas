import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentQuestions } from '~/drizzle/schema/survey'

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
    // Get instrument question by ID
    try {
      const question = await db.select().from(instrumentQuestions).where(eq(instrumentQuestions.id, id)).limit(1)
      if (question.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument question not found'
        })
      }
      return { success: true, data: question[0] }
    } catch (error) {
      console.error('Error fetching instrument question:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch instrument question'
      })
    }
  }

  if (method === 'PUT') {
    // Update instrument question by ID
    try {
      const body = await readBody(event)
      const { aspectId, questionText, questionType, isRequired, requireEvidence, evidenceLabel, sortOrder } = body

      if (!aspectId || !questionText) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Aspect ID and question text are required'
        })
      }

      const updatedQuestion = await db
        .update(instrumentQuestions)
        .set({
          aspectId,
          questionText,
          questionType,
          isRequired,
          requireEvidence,
          evidenceLabel,
          sortOrder
        })
        .where(eq(instrumentQuestions.id, id))
        .returning()

      if (updatedQuestion.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument question not found'
        })
      }

      return { success: true, data: updatedQuestion[0] }
    } catch (error) {
      console.error('Error updating instrument question:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update instrument question'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete instrument question by ID
    try {
      const deletedQuestion = await db
        .delete(instrumentQuestions)
        .where(eq(instrumentQuestions.id, id))
        .returning()

      if (deletedQuestion.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument question not found'
        })
      }

      return { success: true, message: 'Instrument question deleted successfully' }
    } catch (error) {
      console.error('Error deleting instrument question:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete instrument question'
      })
    }
  }
})