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
      
      console.log(`📋 Fetched ${responses.length} responses`)
      
      // Fetch aspect scores for each response
      const { responseAnswers, instrumentQuestions, instrumentAspects } = await import('~/drizzle/schema/survey')
      
      const responsesWithAspects = await Promise.all(responses.map(async (response) => {
        // Get all answers with aspect info
        const answers = await db
          .select({
            answerId: responseAnswers.id,
            score: responseAnswers.originalScore,
            aspectId: instrumentAspects.id,
            aspectName: instrumentAspects.name,
            aspectWeight: instrumentAspects.weight
          })
          .from(responseAnswers)
          .innerJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
          .innerJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
          .where(eq(responseAnswers.responseId, response.id))
        
        // Group scores by aspect
        const aspectScoresMap = new Map()
        
        answers.forEach(answer => {
          const aspectId = answer.aspectId
          if (!aspectScoresMap.has(aspectId)) {
            aspectScoresMap.set(aspectId, {
              aspectId: aspectId,
              aspectName: answer.aspectName,
              aspectWeight: parseFloat(String(answer.aspectWeight || '1')),
              totalScore: 0,
              questionCount: 0
            })
          }
          
          const aspectData = aspectScoresMap.get(aspectId)
          aspectData.totalScore += (answer.score || 0)
          aspectData.questionCount += 1
        })
        
        // Calculate final score (totalScore × aspectWeight) for each aspect
        const aspectScores = Array.from(aspectScoresMap.values()).map(aspect => ({
          aspectId: aspect.aspectId,
          aspectName: aspect.aspectName,
          finalScore: parseFloat((aspect.totalScore * aspect.aspectWeight).toFixed(2))
        }))
        
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