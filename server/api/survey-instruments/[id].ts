import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { surveyInstruments, instrumentQuestions } from '~/drizzle/schema/survey'

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
    // Get survey instrument by ID
    try {
      const instrument = await db.select().from(surveyInstruments).where(eq(surveyInstruments.id, id)).limit(1)
      if (instrument.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Survey instrument not found'
        })
      }
      return { success: true, data: instrument[0] }
    } catch (error) {
      console.error('Error fetching survey instrument:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch survey instrument'
      })
    }
  }

  if (method === 'PUT') {
    // Update survey instrument by ID
    try {
      const body = await readBody(event)
      const { title, description, isActive } = body

      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title is required'
        })
      }

      const updatedInstrument = await db
        .update(surveyInstruments)
        .set({
          title,
          description,
          isActive,
          updatedAt: new Date()
        })
        .where(eq(surveyInstruments.id, id))
        .returning()

      if (updatedInstrument.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Survey instrument not found'
        })
      }

      return { success: true, data: updatedInstrument[0] }
    } catch (error) {
      console.error('Error updating survey instrument:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update survey instrument'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete survey instrument by ID
    try {
      const deletedInstrument = await db
        .delete(surveyInstruments)
        .where(eq(surveyInstruments.id, id))
        .returning()

      if (deletedInstrument.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Survey instrument not found'
        })
      }

      return { success: true, message: 'Survey instrument deleted successfully' }
    } catch (error) {
      console.error('Error deleting survey instrument:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete survey instrument'
      })
    }
  }

  if (method === 'POST') {
    // Create a new survey instrument
    try {
      const body = await readBody(event)
      const { title, description, isActive, questions } = body

      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title is required'
        })
      }

      const newInstrument = await db
        .insert(surveyInstruments)
        .values({
          title,
          description,
          isActive,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning()

      for (const [questionIndex, question] of questions.entries()) {
        const { aspectId } = question

        if (!aspectId) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Aspect ID is required for each question'
          })
        }

        // Insert each question into the instrumentQuestions table
        const newQuestion = await db.insert(instrumentQuestions).values({
          aspectId,
          questionText: question.text,
          questionType: question.type || 'single',
          isRequired: question.required ?? true,
          requireEvidence: question.requireEvidence ?? false,
          evidenceLabel: question.evidenceLabel,
          weight: question.weight || '1.00',
          sortOrder: questionIndex,
          createdAt: new Date()
        }).returning()
      }

      return { success: true, data: newInstrument[0] }
    } catch (error) {
      console.error('Error creating survey instrument:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create survey instrument'
      })
    }
  }
})