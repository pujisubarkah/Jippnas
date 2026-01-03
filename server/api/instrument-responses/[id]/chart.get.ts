import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, and } from 'drizzle-orm'
import postgres from 'postgres'
import {
  instrumentResponses,
  responseAnswers,
  instrumentQuestions,
  instrumentAspects
} from '~/drizzle/schema/survey'

export default defineEventHandler(async (event) => {
  const db = drizzle(postgres(process.env.DATABASE_URL!))

  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  try {
    // Get instrument response
    const response = await db
      .select()
      .from(instrumentResponses)
      .where(eq(instrumentResponses.id, id))
      .limit(1)

    if (response.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Instrument response not found'
      })
    }

    const instrumentResponse = response[0]

    // Get all answers with question and aspect details
    const answers = await db
      .select({
        answerId: responseAnswers.id,
        questionId: responseAnswers.questionId,
        questionText: instrumentQuestions.questionText,
        aspectId: instrumentQuestions.aspectId,
        aspectName: instrumentAspects.name,
        aspectWeight: instrumentAspects.weight,
        originalScore: responseAnswers.originalScore,
        verifiedScore: responseAnswers.verifiedScore
      })
      .from(responseAnswers)
      .leftJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
      .leftJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
      .where(eq(responseAnswers.responseId, id))

    // Group answers by aspect and calculate total scores per aspect
    const aspectMap = new Map()
    let originalTotalScore = 0
    let verifiedTotalScore = 0

    answers.forEach(answer => {
      const aspectId = answer.aspectId
      const aspectName = answer.aspectName || 'Unknown'
      const score = parseFloat(answer.originalScore?.toString() || '0')
      const verifiedScore = parseFloat(answer.verifiedScore?.toString() || '0')

      originalTotalScore += score
      verifiedTotalScore += verifiedScore

      if (!aspectMap.has(aspectId)) {
        aspectMap.set(aspectId, {
          aspectId,
          aspectName,
          totalScore: 0,
          questionCount: 0
        })
      }

      const aspect = aspectMap.get(aspectId)
      aspect.totalScore += score
      aspect.questionCount += 1
    })

    // Convert to array and format for chart
    const aspectScores = Array.from(aspectMap.values()).map(aspect => ({
      aspectName: aspect.aspectName,
      score: Math.round(aspect.totalScore * 100) / 100,
      questionCount: aspect.questionCount,
      averageScore: aspect.questionCount > 0
        ? Math.round((aspect.totalScore / aspect.questionCount) * 100) / 100
        : 0
    }))

    return {
      success: true,
      data: {
        id: instrumentResponse.id,
        instansi: instrumentResponse.instansi,
        originalTotalScore: Math.round(originalTotalScore * 100) / 100,
        verifiedTotalScore: Math.round(verifiedTotalScore * 100) / 100,
        verificationStatus: instrumentResponse.verificationStatus,
        submittedAt: instrumentResponse.submittedAt,
        verifiedAt: instrumentResponse.verifiedAt,
        aspectScores
      }
    }
  } catch (error) {
    console.error('Error fetching chart data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch chart data'
    })
  }
})
