import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { responseAnswers, questionOptions } from '~/drizzle/schema/survey'

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
    // Get response answer by ID with option details
    try {
      const answer = await db
        .select({
          id: responseAnswers.id,
          responseId: responseAnswers.responseId,
          questionId: responseAnswers.questionId,
          selectedOptionIds: responseAnswers.selectedOptionIds,
          selectedOptionId: responseAnswers.selectedOptionId,
          evidence: responseAnswers.evidence,
          originalScore: responseAnswers.originalScore,
          verifiedScore: responseAnswers.verifiedScore,
          createdAt: responseAnswers.createdAt,
          // Option details for single selection
          optionValue: questionOptions.optionValue,
          optionScore: questionOptions.score
        })
        .from(responseAnswers)
        .leftJoin(questionOptions, eq(responseAnswers.selectedOptionId, questionOptions.id))
        .where(eq(responseAnswers.id, id))
        .limit(1)
      
      if (answer.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Response answer not found'
        })
      }
      return { success: true, data: answer[0] }
    } catch (error) {
      console.error('Error fetching response answer:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch response answer'
      })
    }
  }

  if (method === 'PUT') {
    // Update response answer by ID
    try {
      const body = await readBody(event)
      const { responseId, questionId, selectedOptionIds, selectedOptionId, evidence, originalScore, verifiedScore } = body

      if (!responseId || !questionId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Response ID and question ID are required'
        })
      }

      const updatedAnswer = await db
        .update(responseAnswers)
        .set({
          responseId,
          questionId,
          selectedOptionIds,
          selectedOptionId,
          evidence,
          originalScore,
          verifiedScore
        })
        .where(eq(responseAnswers.id, id))
        .returning()

      if (updatedAnswer.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Response answer not found'
        })
      }

      return { success: true, data: updatedAnswer[0] }
    } catch (error) {
      console.error('Error updating response answer:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update response answer'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete response answer by ID
    try {
      const deletedAnswer = await db
        .delete(responseAnswers)
        .where(eq(responseAnswers.id, id))
        .returning()

      if (deletedAnswer.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Response answer not found'
        })
      }

      return { success: true, message: 'Response answer deleted successfully' }
    } catch (error) {
      console.error('Error deleting response answer:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete response answer'
      })
    }
  }
})