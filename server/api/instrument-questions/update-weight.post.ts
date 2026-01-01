import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentQuestions, instrumentAspects } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { questionId, weight } = body

    if (!questionId || !weight) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Question ID and weight are required'
      })
    }

    // Validate weight format (should be decimal like 0.35, 0.4, etc)
    const weightFloat = parseFloat(weight)
    if (isNaN(weightFloat) || weightFloat < 0 || weightFloat > 1) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Weight must be a decimal number between 0 and 1'
      })
    }

    const [updated] = await db
      .update(instrumentQuestions)
      .set({ weight: weight })
      .where(eq(instrumentQuestions.id, questionId))
      .returning()

    return { 
      success: true, 
      data: updated,
      message: 'Question weight updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating question weight:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update question weight'
    })
  }
})
