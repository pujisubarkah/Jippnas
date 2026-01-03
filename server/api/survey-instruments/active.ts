import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { surveyInstruments, instrumentAspects, instrumentQuestions, questionOptions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    // Get active survey instrument
    const activeInstruments = await db.select().from(surveyInstruments)
      .where(eq(surveyInstruments.isActive, true))
      .limit(1)
    
    if (activeInstruments.length === 0) {
      return {
        success: true,
        data: null,
        message: 'No active survey found'
      }
    }

    const instrument = activeInstruments[0]
    
    // Fetch aspects
    const aspects = await db.select().from(instrumentAspects)
      .where(eq(instrumentAspects.instrumentId, instrument.id))
      .orderBy(instrumentAspects.sortOrder)
    
    // Fetch questions and options for each aspect
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
        id: aspect.id,
        name: aspect.name,
        weight: aspect.weight,  // ✅ Tambahkan ini
        questions: questionsWithOptions
      }
    }))

    return {
      success: true,
      data: {
        id: instrument.id,
        title: instrument.title,
        description: instrument.description,
        aspects: aspectsWithQuestions
      }
    }
  } catch (error) {
    console.error('Error fetching active survey:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return {
      success: false,
      error: message
    }
  }
})