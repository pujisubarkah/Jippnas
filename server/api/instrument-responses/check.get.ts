import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, and } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses, responseAnswers, instrumentQuestions, instrumentAspects, questionOptions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { instrumentId, instansi } = query

    if (!instrumentId || !instansi) {
      throw createError({
        statusCode: 400,
        statusMessage: 'instrumentId dan instansi wajib diisi'
      })
    }

    console.log('🔍 [CHECK] Checking response for:', { instrumentId, instansi })

    // Cari response yang sudah ada
    const [existingResponse] = await db
      .select()
      .from(instrumentResponses)
      .where(
        and(
          eq(instrumentResponses.instrumentId, parseInt(String(instrumentId))),
          eq(instrumentResponses.instansi, String(instansi))
        )
      )
      .limit(1)

    if (!existingResponse) {
      console.log('✅ [CHECK] No existing response found')
      return {
        success: true,
        exists: false,
        data: null
      }
    }

    console.log('✅ [CHECK] Found existing response:', existingResponse.id)

    // Ambil semua jawaban dengan join ke questions, aspects, dan options
    const answers = await db
      .select({
        answerId: responseAnswers.id,
        questionId: instrumentQuestions.id,
        questionText: instrumentQuestions.questionText,
        questionWeight: instrumentQuestions.weight,
        aspectId: instrumentAspects.id,
        aspectName: instrumentAspects.name,
        selectedOptionId: responseAnswers.selectedOptionId,
        optionText: questionOptions.optionText,
        optionScore: questionOptions.score,
        evidence: responseAnswers.evidence,
        originalScore: responseAnswers.originalScore,
        verifiedScore: responseAnswers.verifiedScore
      })
      .from(responseAnswers)
      .leftJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
      .leftJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
      .leftJoin(questionOptions, eq(responseAnswers.selectedOptionId, questionOptions.id))
      .where(eq(responseAnswers.responseId, existingResponse.id))

    console.log('✅ [CHECK] Found', answers.length, 'answers')

    return {
      success: true,
      exists: true,
      data: {
        response: existingResponse,
        answers: answers
      }
    }
  } catch (error: any) {
    console.error('❌ [CHECK] Error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal mengecek response'
    })
  }
})