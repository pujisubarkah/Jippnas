import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { questionOptions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all question options
    try {
      const options = await db.select().from(questionOptions).orderBy(questionOptions.createdAt)
      return { success: true, data: options }
    } catch (error) {
      console.error('Error fetching question options:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch question options'
      })
    }
  }

  if (method === 'POST') {
    // Create new question option
    try {
      const body = await readBody(event)
      const { questionId, optionText, score, optionValue, sortOrder } = body

      if (!questionId || !optionText) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Question ID and option text are required'
        })
      }

      const newOption = await db.insert(questionOptions).values({
        questionId,
        optionText,
        score: score ?? 0,
        optionValue,
        sortOrder: sortOrder ?? 0,
        createdAt: new Date()
      }).returning()

      return { success: true, data: newOption[0] }
    } catch (error) {
      console.error('Error creating question option:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create question option'
      })
    }
  }
})