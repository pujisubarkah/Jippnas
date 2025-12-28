import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { responseAnswers } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all response answers
    try {
      const answers = await db.select().from(responseAnswers).orderBy(responseAnswers.createdAt)
      return { success: true, data: answers }
    } catch (error) {
      console.error('Error fetching response answers:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch response answers'
      })
    }
  }

  if (method === 'POST') {
    // Create new response answer
    try {
      const body = await readBody(event)
      const { responseId, questionId, selectedOptionIds, selectedOptionId, evidence, originalScore, verifiedScore } = body

      if (!responseId || !questionId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Response ID and question ID are required'
        })
      }

      const newAnswer = await db.insert(responseAnswers).values({
        responseId,
        questionId,
        selectedOptionIds,
        selectedOptionId,
        evidence,
        originalScore: originalScore ?? 0,
        verifiedScore: verifiedScore ?? 0,
        createdAt: new Date()
      }).returning()

      return { success: true, data: newAnswer[0] }
    } catch (error) {
      console.error('Error creating response answer:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create response answer'
      })
    }
  }
})