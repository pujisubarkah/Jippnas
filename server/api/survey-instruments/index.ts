import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { surveyInstruments, instrumentAspects, instrumentQuestions, questionOptions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all survey instruments with their aspects, questions, and options
    try {
      const instruments = await db.select().from(surveyInstruments).orderBy(surveyInstruments.createdAt)
      
      // Fetch aspects, questions, and options for each instrument
      const instrumentsWithDetails = await Promise.all(instruments.map(async (instrument) => {
        const aspects = await db.select().from(instrumentAspects)
          .where(eq(instrumentAspects.instrumentId, instrument.id))
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
              id: question.id,  // ✅ Include question ID
              text: question.questionText,
              type: question.questionType,
              required: question.isRequired,
              requireEvidence: question.requireEvidence,
              evidenceLabel: question.evidenceLabel,
              weight: question.weight,
              options: options.map(opt => ({
                id: opt.id,  // ✅ Include option ID
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
        
        return {
          ...instrument,
          aspects: aspectsWithQuestions
        }
      }))
      
      return { success: true, data: instrumentsWithDetails }
    } catch (error) {
      console.error('Error fetching survey instruments:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch survey instruments'
      })
    }
  }

  if (method === 'POST') {
    // Create new survey instrument with aspects, questions, and options
    try {
      const body = await readBody(event)
      const { title, description, isActive, aspects } = body

      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title is required'
        })
      }

      // Insert survey instrument
      const newInstrument = await db.insert(surveyInstruments).values({
        title,
        description,
        isActive: isActive ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning()

      const instrumentId = newInstrument[0].id

      // Insert aspects, questions, and options
      if (aspects && aspects.length > 0) {
        for (let aspectIndex = 0; aspectIndex < aspects.length; aspectIndex++) {
          const aspect = aspects[aspectIndex]
          
          const newAspect = await db.insert(instrumentAspects).values({
            instrumentId,
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