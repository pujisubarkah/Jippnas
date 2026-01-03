import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, inArray } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses, responseAnswers, instrumentQuestions, instrumentAspects, questionOptions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const responses = await db.select().from(instrumentResponses)
    let updatedCount = 0
    let errorCount = 0
    
    for (const response of responses) {
      try {
        const answers = await db
          .select({
            answerId: responseAnswers.id,
            selectedOptionId: responseAnswers.selectedOptionId,
            questionId: instrumentQuestions.id,
            questionWeight: instrumentQuestions.weight,
            aspectId: instrumentAspects.id,
            aspectWeight: instrumentAspects.weight
          })
          .from(responseAnswers)
          .innerJoin(instrumentQuestions, eq(responseAnswers.questionId, instrumentQuestions.id))
          .innerJoin(instrumentAspects, eq(instrumentQuestions.aspectId, instrumentAspects.id))
          .where(eq(responseAnswers.responseId, response.id))
        
        if (answers.length === 0) {
          continue
        }
        
        const optionIds = answers.map(a => a.selectedOptionId).filter(id => id !== null) as number[]
        if (optionIds.length === 0) {
          continue
        }
        
        const allOptions = await db
          .select()
          .from(questionOptions)
          .where(inArray(questionOptions.id, optionIds))
        
        const optionsMap = new Map(allOptions.map(opt => [opt.id, opt]))
        
        let newTotalScore = 0
        
        for (const answer of answers) {
          if (!answer.selectedOptionId) continue
          
          const selectedOption = optionsMap.get(answer.selectedOptionId)
          if (!selectedOption) continue
          
          const optionScore = selectedOption.score || 0
          const questionWeight = parseFloat(String(answer.questionWeight || '1'))
          const aspectWeight = parseFloat(String(answer.aspectWeight || '1'))
          const finalScore = optionScore * questionWeight * aspectWeight
          
          newTotalScore += finalScore
          
          await db
            .update(responseAnswers)
            .set({
              originalScore: finalScore.toString(),
              verifiedScore: finalScore.toString()
            })
            .where(eq(responseAnswers.id, answer.answerId))
        }
        
        await db
          .update(instrumentResponses)
          .set({ totalScore: newTotalScore.toString() })
          .where(eq(instrumentResponses.id, response.id))

        updatedCount++
        
      } catch (err) {
        errorCount++
      }
    }
    
    return {
      success: true,
      message: 'Recalculation complete',
      stats: {
        total: responses.length,
        updated: updatedCount,
        errors: errorCount
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to recalculate scores'
    })
  }
})
