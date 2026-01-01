import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { instrumentResponses, responseAnswers } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { instrumentId, instansi, answers, evidences } = body

    console.log('📝 Survey submission received:', {
      instrumentId,
      instansi,
      answerCount: Object.keys(answers || {}).length
    })

    // Validasi input
    if (!instrumentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Instrument ID diperlukan'
      })
    }

    if (!instansi) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Instansi diperlukan'
      })
    }

    if (!answers || Object.keys(answers).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tidak ada jawaban yang dikirim'
      })
    }

    // Hitung total score dari semua jawaban
    let totalScore = 0
    const answersToInsert = []

    // Process setiap jawaban
    for (const [key, answerData] of Object.entries(answers)) {
      const { questionId, optionId, score, weight, finalScore } = answerData as any
      
      // Gunakan finalScore yang sudah dihitung di frontend
      totalScore += finalScore || 0
      
      answersToInsert.push({
        questionId,
        optionId,
        score: finalScore || 0, // Simpan final score setelah dikali bobot
        evidence: evidences?.[key] || null // Simpan link bukti jika ada
      })
    }

    // Buat response record
    const [newResponse] = await db.insert(instrumentResponses).values({
      instrumentId,
      instansi,
      totalScore,
      verificationStatus: 'pending',
      submittedAt: new Date(),
      createdAt: new Date()
    }).returning()

    // Insert semua jawaban ke response_answers
    const insertedAnswers = []
    for (const answer of answersToInsert) {
      const [insertedAnswer] = await db.insert(responseAnswers).values({
        responseId: newResponse.id,
        questionId: answer.questionId,
        selectedOptionId: answer.optionId,
        evidence: answer.evidence,
        originalScore: answer.score,
        verifiedScore: answer.score, // Default sama dengan original
        createdAt: new Date()
      }).returning()
      
      insertedAnswers.push(insertedAnswer)
    }

    console.log('✅ Survey submitted successfully:', {
      responseId: newResponse.id,
      totalScore,
      answersCount: insertedAnswers.length
    })
    
    return { 
      success: true, 
      data: {
        response: newResponse,
        answers: insertedAnswers,
        totalScore,
        message: 'Survey berhasil dikirim'
      }
    }
  } catch (error: any) {
    console.error('Error submitting survey:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal mengirim survey'
    })
  }
})
