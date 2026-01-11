import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, desc } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all instrument responses (sorted by newest first) with aspect scores
    try {
      const responses = await db
        .select()
        .from(instrumentResponses)
        .orderBy(desc(instrumentResponses.submittedAt))
      
      // Fetch aspect scores for each response
      const { responseAnswers, instrumentQuestions, instrumentAspects } = await import('~/drizzle/schema/survey')
      
      const responsesWithAspects = await Promise.all(responses.map(async (response) => {
        // First, get all aspects for this instrument
        const allAspects = await db
          .select({
            aspectId: instrumentAspects.id,
            aspectName: instrumentAspects.name,
            aspectWeight: instrumentAspects.weight
          })
          .from(instrumentAspects)
          .where(eq(instrumentAspects.instrumentId, response.instrumentId!))
        
        // Get all answers with aspect info
        const answers = await db
          .select({
            answerId: responseAnswers.id,
            originalScore: responseAnswers.originalScore,
            verifiedScore: responseAnswers.verifiedScore,
            aspectId: instrumentAspects.id,
            aspectName: instrumentAspects.name,
            aspectWeight: instrumentAspects.weight
          })
          .from(responseAnswers)
          .innerJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
          .innerJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
          .where(eq(responseAnswers.responseId, response.id))
        
        // Initialize aspect scores map with all aspects
        const aspectScoresMap = new Map()
        
        allAspects.forEach(aspect => {
          aspectScoresMap.set(aspect.aspectId, {
            aspectId: aspect.aspectId,
            aspectName: aspect.aspectName,
            aspectWeight: parseFloat(String(aspect.aspectWeight || '1.00')),
            totalScore: 0,
            questionCount: 0
          })
        })
        
        // Populate with actual scores
        answers.forEach(answer => {
          const aspectId = answer.aspectId
          if (aspectScoresMap.has(aspectId)) {
            const aspectData = aspectScoresMap.get(aspectId)
            // Use verified score if available, otherwise original score
            const score = answer.verifiedScore !== null && answer.verifiedScore !== undefined 
              ? answer.verifiedScore 
              : answer.originalScore
            aspectData.totalScore += (score || 0)
            aspectData.questionCount += 1
          }
        })
        
        // Calculate final score (totalScore × aspectWeight) for each aspect
        const aspectScores = Array.from(aspectScoresMap.values()).map(aspect => {
          const weight = isNaN(aspect.aspectWeight) ? 1.0 : aspect.aspectWeight
          const finalScore = aspect.totalScore * weight
          return {
            aspectId: aspect.aspectId,
            aspectName: aspect.aspectName,
            finalScore: isNaN(finalScore) ? 0 : parseFloat(finalScore.toFixed(2))
          }
        })
        
        // Calculate total of all aspect final scores
        const totalFinalScore = aspectScores.reduce((sum, aspect) => sum + aspect.finalScore, 0)
        
        return {
          ...response,
          aspectScores,
          totalFinalScore: parseFloat(totalFinalScore.toFixed(2))
        }
      }))
      
      return { success: true, data: responsesWithAspects }
    } catch (error) {
      console.error('Error fetching instrument responses:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch instrument responses'
      })
    }
  }

  if (method === 'POST') {
    // Create new instrument response
    try {
      const body = await readBody(event)
      const { instrumentId, instansi, totalScore, verificationStatus } = body

      if (!instrumentId || !instansi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Instrument ID and instansi are required'
        })
      }

      const newResponse = await db.insert(instrumentResponses).values({
        instrumentId,
        instansi,
        totalScore: totalScore ?? 0,
        verificationStatus: verificationStatus ?? 'pending',
        submittedAt: new Date(),
        createdAt: new Date()
      }).returning()

      return { success: true, data: newResponse[0] }
    } catch (error) {
      console.error('Error creating instrument response:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create instrument response'
      })
    }
  }
})