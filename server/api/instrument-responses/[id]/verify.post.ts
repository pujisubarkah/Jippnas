import { db } from '~/drizzle/db'
import { instrumentResponses, responseAnswers } from '~/drizzle/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const responseId = parseInt(getRouterParam(event, 'id') || '0')
    const body = await readBody(event)

    if (!responseId || isNaN(responseId)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid response ID'
      })
    }

    const { verifiedTotalScore, verificationStatus, answers } = body

    if (!verifiedTotalScore || !verificationStatus || !answers || !Array.isArray(answers)) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields'
      })
    }

    // Start transaction to update response and answers
    await db.transaction(async (tx) => {
      // Update main response with verified total score and status
      await tx
        .update(instrumentResponses)
        .set({
          totalScore: verifiedTotalScore,
          verificationStatus: verificationStatus,
          verifiedAt: new Date()
        })
        .where(eq(instrumentResponses.id, responseId))

      // Update each answer with verified score
      for (const answer of answers) {
        if (answer.answerId) {
          await tx
            .update(responseAnswers)
            .set({
              verifiedScore: answer.verifiedScore
            })
            .where(eq(responseAnswers.id, answer.answerId))
        }
      }
    })

    return {
      success: true,
      message: 'Verification saved successfully',
      data: {
        responseId,
        verifiedTotalScore,
        verificationStatus,
        updatedAnswers: answers.length
      }
    }
  } catch (error: any) {
    console.error('❌ Error saving verification:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to save verification'
    })
  }
})
