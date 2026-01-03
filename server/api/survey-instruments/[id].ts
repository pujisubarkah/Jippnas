import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { surveyInstruments, instrumentAspects, instrumentQuestions, questionOptions } from '~/drizzle/schema/survey'

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
    // Get survey instrument by ID with aspects, questions, and options
    try {
      const instrument = await db.select().from(surveyInstruments).where(eq(surveyInstruments.id, id)).limit(1)
      if (instrument.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Survey instrument not found'
        })
      }

      // Fetch aspects, questions, and options for the instrument
      const aspects = await db.select().from(instrumentAspects)
        .where(eq(instrumentAspects.instrumentId, id))
        .orderBy(instrumentAspects.sortOrder)
      
      const aspectsWithQuestions = await Promise.all(aspects.map(async (aspect) => {
        const questions = await db.select().from(instrumentQuestions)
          .where(eq(instrumentQuestions.aspectId, aspect.id))
          .orderBy(instrumentQuestions.sortOrder)
        
        const questionsWithOptions = await Promise.all(questions.map(async (question) => {
          const options = await db.select().from(questionOptions)
            .where(eq(questionOptions.questionId, question.id))
            .orderBy(questionOptions.sortOrder)
          
          return {
            id: question.id,
            text: question.questionText,
            type: question.questionType,
            required: question.isRequired,
            requireEvidence: question.requireEvidence,
            evidenceLabel: question.evidenceLabel,
            weight: question.weight,
            options: options.map(opt => ({
              id: opt.id,
              text: opt.optionText,
              score: opt.score
            }))
          }
        }))
        
        return {
          name: aspect.name,
          questions: questionsWithOptions
        }
      }))
      
      return { success: true, data: {
        ...instrument[0],
        aspects: aspectsWithQuestions
      }}
    } catch (error) {
      console.error('Error fetching survey instrument:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch survey instrument'
      })
    }
  }

  if (method === 'PUT') {
    // Update survey instrument by ID with aspects, questions, and options
    try {
      const body = await readBody(event)
      const { title, description, isActive, aspects } = body

      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title is required'
        })
      }

      // Update survey instrument
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

      // Delete existing aspects, questions, and options
      const existingAspects = await db.select().from(instrumentAspects).where(eq(instrumentAspects.instrumentId, id))
      for (const aspect of existingAspects) {
        const existingQuestions = await db.select().from(instrumentQuestions).where(eq(instrumentQuestions.aspectId, aspect.id))
        for (const question of existingQuestions) {
          await db.delete(questionOptions).where(eq(questionOptions.questionId, question.id))
        }
        await db.delete(instrumentQuestions).where(eq(instrumentQuestions.aspectId, aspect.id))
      }
      await db.delete(instrumentAspects).where(eq(instrumentAspects.instrumentId, id))

      // Insert new aspects, questions, and options
      if (aspects && aspects.length > 0) {
        for (let aspectIndex = 0; aspectIndex < aspects.length; aspectIndex++) {
          const aspect = aspects[aspectIndex]
          
          const newAspect = await db.insert(instrumentAspects).values({
            instrumentId: id,
            name: aspect.name,
            sortOrder: aspectIndex,
            createdAt: new Date()
          }).returning()

          const aspectId = newAspect[0].id

          if (aspect.questions && aspect.questions.length > 0) {
            for (let questionIndex = 0; questionIndex < aspect.questions.length; questionIndex++) {
              const question = aspect.questions[questionIndex]
              
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

              const questionId = newQuestion[0].id

              if (question.options && question.options.length > 0) {
                for (let optionIndex = 0; optionIndex < question.options.length; optionIndex++) {
                  const option = question.options[optionIndex]
                  
                  await db.insert(questionOptions).values({
                    questionId,
                    optionText: option.text,
                    score: option.score || 0,
                    sortOrder: optionIndex,
                    createdAt: new Date()
                  })
                }
              }
            }
          }
        }
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
})