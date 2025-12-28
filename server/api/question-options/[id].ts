import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { questionOptions } from '~/drizzle/schema/survey'

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
    // Get question option by ID
    try {
      const option = await db.select().from(questionOptions).where(eq(questionOptions.id, id)).limit(1)
      if (option.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Question option not found'
        })
      }
      return { success: true, data: option[0] }
    } catch (error) {
      console.error('Error fetching question option:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch question option'
      })
    }
  }

  if (method === 'PUT') {
    // Update question option by ID
    try {
      const body = await readBody(event)
      const { questionId, optionText, score, optionValue, sortOrder } = body

      if (!questionId || !optionText) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Question ID and option text are required'
        })
      }

      const updatedOption = await db
        .update(questionOptions)
        .set({
          questionId,
          optionText,
          score,
          optionValue,
          sortOrder
        })
        .where(eq(questionOptions.id, id))
        .returning()

      if (updatedOption.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Question option not found'
        })
      }

      return { success: true, data: updatedOption[0] }
    } catch (error) {
      console.error('Error updating question option:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update question option'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete question option by ID
    try {
      const deletedOption = await db
        .delete(questionOptions)
        .where(eq(questionOptions.id, id))
        .returning()

      if (deletedOption.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Question option not found'
        })
      }

      return { success: true, message: 'Question option deleted successfully' }
    } catch (error) {
      console.error('Error deleting question option:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete question option'
      })
    }
  }
})