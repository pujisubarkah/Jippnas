import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { 
  instrumentResponses, 
  responseAnswers, 
  instrumentQuestions,
  instrumentAspects,
  questionOptions,
  answerVerifications
} from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  try {
    // Get response basic info
    const response = await db
      .select()
      .from(instrumentResponses)
      .where(eq(instrumentResponses.id, id))
      .limit(1)

    if (response.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Response not found'
      })
    }

    const responseData = response[0]

    // Get all answers with question and aspect details
    const answers = await db
      .select({
        answerId: responseAnswers.id,
        questionId: instrumentQuestions.id,
        questionText: instrumentQuestions.questionText,
        questionType: instrumentQuestions.questionType,
        questionWeight: instrumentQuestions.weight,
        originalScore: responseAnswers.originalScore,
        verifiedScore: responseAnswers.verifiedScore,
        evidence: responseAnswers.evidence,
        selectedOptionId: responseAnswers.selectedOptionId,
        selectedOptionIds: responseAnswers.selectedOptionIds,
        verificationStatus: answerVerifications.verificationStatus,
        verificationNote: answerVerifications.verificationNote,
        verifiedOptionId: answerVerifications.verifiedOptionId,
        verifiedOptionIds: answerVerifications.verifiedOptionIds,
        aspectId: instrumentAspects.id,
        aspectName: instrumentAspects.name,
        aspectWeight: instrumentAspects.weight,
        aspectSortOrder: instrumentAspects.sortOrder
      })
      .from(responseAnswers)
      .innerJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
      .innerJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
      .leftJoin(answerVerifications, eq(answerVerifications.answerId, responseAnswers.id))
      .where(eq(responseAnswers.responseId, id))
      .orderBy(instrumentAspects.sortOrder, instrumentQuestions.id)

    // Group by aspects
    const aspectsMap = new Map()

    for (const answer of answers) {
      if (!aspectsMap.has(answer.aspectId)) {
        aspectsMap.set(answer.aspectId, {
          aspectId: answer.aspectId,
          aspectName: answer.aspectName,
          aspectWeight: parseFloat(String(answer.aspectWeight || '1.00')),
          sortOrder: answer.aspectSortOrder,
          questions: []
        })
      }

      const aspect = aspectsMap.get(answer.aspectId)

      // Get options for this specific question
      const questionOpts = await db
        .select()
        .from(questionOptions)
        .where(eq(questionOptions.questionId, answer.questionId))

      // Determine which options are selected
      let selectedOptionValues: number[] = []
      if (answer.questionType === 'single' && answer.selectedOptionId) {
        selectedOptionValues = [answer.selectedOptionId]
      } else if (answer.questionType === 'multiple' && answer.selectedOptionIds) {
        selectedOptionValues = answer.selectedOptionIds
      }

      // Determine which options are verified
      let verifiedOptionValues: number[] = []
      if (answer.verifiedOptionId) {
        verifiedOptionValues = [answer.verifiedOptionId]
      } else if (answer.verifiedOptionIds) {
        verifiedOptionValues = answer.verifiedOptionIds
      }

      aspect.questions.push({
        questionId: answer.questionId,
        questionText: answer.questionText,
        questionType: answer.questionType,
        questionWeight: parseFloat(String(answer.questionWeight || '1.00')),
        originalScore: parseFloat(String(answer.originalScore || '0')),
        verifiedScore: parseFloat(String(answer.verifiedScore || '0')),
        evidence: answer.evidence,
        verificationStatus: answer.verificationStatus || 'pending',
        verificationNote: answer.verificationNote,
        availableOptions: questionOpts.map(opt => ({
          id: opt.id,
          value: opt.id,  // ✅ Gunakan ID sebagai value
          text: opt.optionText,
          score: parseFloat(String(opt.score || '0'))
        })),
        selectedOptions: selectedOptionValues,
        verifiedOptions: verifiedOptionValues
      })
    }

    const aspectScores = Array.from(aspectsMap.values())

    return {
      success: true,
      data: {
        ...responseData,
        aspectScores
      }
    }
  } catch (error) {
    console.error('Error fetching response detail:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch response detail'
    })
  }
})