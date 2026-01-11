import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { responseAnswers, questionOptions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all response answers with option details
    try {
      const answers = await db
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
        .orderBy(responseAnswers.id)
      
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