import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, sql } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentAspects, responseAnswers, instrumentQuestions, instrumentResponses } from '~/drizzle/schema/survey'

interface Aspect {
  aspectId: number
  aspectName: string
  aspectWeight: number
  sortOrder: number
  answers: Array<{
    answerId: number
    questionId: number
    originalScore: number | null
    verifiedScore: number | null
    evidence: string | null
    createdAt: Date
  }>
  totalScore: number
  questionCount: number
}

interface GroupedResponse {
  responseId: number
  instansi: string
  instrumentId: number
  totalScore: number
  submittedAt: Date
  aspects: Map<number, Aspect>
}

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all response answers grouped by aspect
    try {
      // Get all answers with aspect and response information
      const answers = await db
        .select({
          answerId: responseAnswers.id,
          responseId: responseAnswers.responseId,
          questionId: responseAnswers.questionId,
          originalScore: responseAnswers.originalScore,
          verifiedScore: responseAnswers.verifiedScore,
          evidence: responseAnswers.evidence,
          createdAt: responseAnswers.createdAt,
          aspectId: instrumentAspects.id,
          aspectName: instrumentAspects.name,
          aspectWeight: instrumentAspects.weight,
          sortOrder: instrumentAspects.sortOrder,
          instansi: instrumentResponses.instansi,
          instrumentId: instrumentResponses.instrumentId,
          totalScore: instrumentResponses.totalScore,
          submittedAt: instrumentResponses.submittedAt
        })
        .from(responseAnswers)
        .innerJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
        .innerJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
        .innerJoin(instrumentResponses, eq(responseAnswers.responseId, instrumentResponses.id))
        .orderBy(instrumentResponses.submittedAt, instrumentAspects.sortOrder)

      // Group by response and aspect
      const groupedData = new Map()

      answers.forEach(answer => {
        const responseKey = answer.responseId

        if (!groupedData.has(responseKey)) {
          groupedData.set(responseKey, {
            responseId: answer.responseId,
            instansi: answer.instansi,
            instrumentId: answer.instrumentId,
            totalScore: answer.totalScore,
            submittedAt: answer.submittedAt,
            aspects: new Map<number, Aspect>()
          })
        }

        const response = groupedData.get(responseKey)
        const aspectKey = answer.aspectId

        if (!response.aspects.has(aspectKey)) {
          response.aspects.set(aspectKey, {
            aspectId: answer.aspectId,
            aspectName: answer.aspectName,
            aspectWeight: parseFloat(String(answer.aspectWeight || '1.00')),
            sortOrder: answer.sortOrder,
            answers: [],
            totalScore: 0,
            questionCount: 0
          })
        }

        const aspect = response.aspects.get(aspectKey)
        const score = answer.verifiedScore !== null && answer.verifiedScore !== undefined 
          ? parseFloat(String(answer.verifiedScore))
          : parseFloat(String(answer.originalScore || 0))

        aspect.answers.push({
          answerId: answer.answerId,
          questionId: answer.questionId,
          originalScore: answer.originalScore,
          verifiedScore: answer.verifiedScore,
          evidence: answer.evidence,
          createdAt: answer.createdAt
        })

        aspect.totalScore += score
        aspect.questionCount += 1
      })

      // Convert to array and calculate final scores
      const result = Array.from(groupedData.values()).map(response => {
        const aspectsArray = Array.from(response.aspects.values()) as Aspect[]
        const aspectScores = aspectsArray.map((aspect) => {
          const finalScore = aspect.totalScore * aspect.aspectWeight
          return {
            aspectId: aspect.aspectId,
            aspectName: aspect.aspectName,
            aspectWeight: aspect.aspectWeight,
            sortOrder: aspect.sortOrder,
            totalScore: parseFloat(aspect.totalScore.toFixed(2)),
            questionCount: aspect.questionCount,
            finalScore: parseFloat(finalScore.toFixed(2)),
            answers: aspect.answers
          }
        }).sort((a, b) => a.sortOrder - b.sortOrder)

        const totalFinalScore = aspectScores.reduce((sum, aspect) => sum + aspect.finalScore, 0)

        return {
          responseId: response.responseId,
          instansi: response.instansi,
          instrumentId: response.instrumentId,
          totalScore: response.totalScore,
          submittedAt: response.submittedAt,
          aspectScores,
          totalFinalScore: parseFloat(totalFinalScore.toFixed(2))
        }
      })

      return { success: true, data: result }
    } catch (error) {
      console.error('Error fetching aspect responses:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch aspect responses'
      })
    }
  }
})