import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, inArray } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses, responseAnswers, instrumentQuestions, instrumentAspects, questionOptions } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    console.log('🔄 Starting recalculation of all response scores...')
    
    const responses = await db.select().from(instrumentResponses)
    let updatedCount = 0
    let errorCount = 0
    
    for (const response of responses) {
      try {
        console.log(`\n📊 Response ID: ${response.id} (${response.instansi})`)
        
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
          console.log(`  ⚠️ No answers found`)
          continue
        }

        console.log(`  Found ${answers.length} answers`)
        
        const optionIds = answers.map(a => a.selectedOptionId).filter(id => id !== null) as number[]
        if (optionIds.length === 0) {
          console.log(`  ⚠️ No valid options`)
          continue
        }
        
        const allOptions = await db
          .select()
          .from(questionOptions)
          .where(inArray(questionOptions.id, optionIds))
        
        const optionsMap = new Map(allOptions.map(opt => [opt.id, opt]))
        console.log(`  Fetched ${allOptions.length} options`)
        
        let newTotalScore = 0
        
        for (const answer of answers) {
          if (!answer.selectedOptionId) continue
          
          const selectedOption = optionsMap.get(answer.selectedOptionId)
          if (!selectedOption) continue
          
          const optionScore = selectedOption.score || 0
          const questionWeight = parseFloat(String(answer.questionWeight || '1'))
          const aspectWeight = parseFloat(String(answer.aspectWeight || '1'))
          const finalScore = optionScore * questionWeight * aspectWeight
          
          console.log(`  Q${answer.questionId}: ${optionScore} × ${questionWeight.toFixed(2)} × ${aspectWeight.toFixed(2)} = ${finalScore.toFixed(2)}`)
          
          newTotalScore += finalScore
          
          await db
            .update(responseAnswers)
            .set({
              originalScore: finalScore.toString(),
              verifiedScore: finalScore.toString()
            })
            .where(eq(responseAnswers.id, answer.answerId))
        }
        
        console.log(`  Old: ${response.totalScore}, New: ${newTotalScore.toFixed(2)}`)

        await db
          .update(instrumentResponses)
          .set({ totalScore: newTotalScore.toString() })
          .where(eq(instrumentResponses.id, response.id))

        updatedCount++
        console.log(`  ✅ Updated`)
        
      } catch (err) {
        console.error(`  ❌ Error:`, err)
        errorCount++
      }
    }
    
    console.log(`\n✅ Complete! Updated: ${updatedCount}, Errors: ${errorCount}`)
    
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
    console.error('❌ Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Failed to recalculate scores'
    })
  }
})
