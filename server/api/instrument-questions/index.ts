import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentQuestions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all instrument questions
    try {
      const questions = await db.select().from(instrumentQuestions).orderBy(instrumentQuestions.createdAt)
      return { success: true, data: questions }
    } catch (error) {
      console.error('Error fetching instrument questions:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch instrument questions'
      })
    }
  }

  if (method === 'POST') {
    // Create new instrument question
    try {
      const body = await readBody(event)
      const { aspectId, questionText, questionType, isRequired, requireEvidence, evidenceLabel, sortOrder } = body

      if (!aspectId || !questionText) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Aspect ID and question text are required'
        })
      }

      const newQuestion = await db.insert(instrumentQuestions).values({
        aspectId,
        questionText,
        questionType: questionType ?? 'single',
        isRequired: isRequired ?? true,
        requireEvidence: requireEvidence ?? false,
        evidenceLabel,
        sortOrder: sortOrder ?? 0,
        createdAt: new Date()
      }).returning()

      return { success: true, data: newQuestion[0] }
    } catch (error) {
      console.error('Error creating instrument question:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create instrument question'
      })
    }
  }
})