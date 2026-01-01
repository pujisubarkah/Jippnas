import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses, responseAnswers } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid response ID'
      })
    }

    // Get response
    const [response] = await db
      .select()
      .from(instrumentResponses)
      .where(eq(instrumentResponses.id, id))

    if (!response) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Response not found'
      })
    }

    // Get all answers for this response
    const answers = await db
      .select()
      .from(responseAnswers)
      .where(eq(responseAnswers.responseId, id))

    return {
      success: true,
      data: {
        ...response,
        answers
      }
    }
  } catch (error: any) {
    console.error('Error fetching response with answers:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch response details'
    })
  }
})
