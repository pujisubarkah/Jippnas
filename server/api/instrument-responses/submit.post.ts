import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { instrumentResponses, responseAnswers } from '~/drizzle/schema/survey'
import { eq, and } from 'drizzle-orm'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { instrumentId, instansi, answers, evidences, isUpdate, responseId } = body

    // Validasi input
    if (!instrumentId || !instansi) {
      throw createError({
        statusCode: 400,
        statusMessage: 'instrumentId dan instansi wajib diisi'
      })
    }

    if (!answers || Object.keys(answers).length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tidak ada jawaban yang dikirim'
      })
    }

    console.log('📊 Received answers:', Object.keys(answers).length, 'questions')
    
    // Hitung total score dari semua jawaban (sudah termasuk bobot aspek dan pertanyaan dari frontend)
    let totalScore = 0
    const answersArray = Object.entries(answers).map(([key, answer]: [string, any]) => {
      // Validasi data
      if (!answer.questionId || !answer.optionId) {
        throw new Error(`Invalid answer data: questionId and optionId are required for answer [${key}]`)
      }
      
      // Gunakan finalScore yang sudah dikalikan bobot pertanyaan
      const finalScore = answer.finalScore || (answer.score || 0)
      console.log(`  Question ${key}: option score=${answer.score}, weight=${answer.weight}, finalScore=${finalScore}`)
      totalScore += finalScore
      
      // Handle evidence - bisa array atau string atau undefined
      let evidenceText = null
      const evidence = evidences?.[key]
      if (evidence) {
        if (Array.isArray(evidence)) {
          evidenceText = evidence.map((e: any) => e.name || e).join(', ')
        } else if (typeof evidence === 'string') {
          evidenceText = evidence
        }
      }
      
      return {
        questionId: parseInt(String(answer.questionId)),
        selectedOptionId: parseInt(String(answer.optionId)),
        evidence: evidenceText,
        originalScore: finalScore,  // Simpan skor yang sudah dikalikan bobot
        verifiedScore: finalScore   // Simpan skor yang sudah dikalikan bobot
      }
    })

    console.log('💰 Total Score:', totalScore.toFixed(2))

    let newResponse

    if (isUpdate && responseId) {
      // MODE UPDATE: Cari response yang sudah ada
      const [existingResponse] = await db
        .select()
        .from(instrumentResponses)
        .where(
          and(
            eq(instrumentResponses.id, responseId),
            eq(instrumentResponses.instansi, instansi)
          )
        )

      if (!existingResponse) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Response tidak ditemukan'
        })
      }

      // Update response
      const [updatedResponse] = await db
        .update(instrumentResponses)
        .set({
          totalScore: totalScore.toString(),
          verificationStatus: 'pending',
          submittedAt: new Date()
        })
        .where(eq(instrumentResponses.id, responseId))
        .returning()

      // Hapus jawaban lama
      await db
        .delete(responseAnswers)
        .where(eq(responseAnswers.responseId, responseId))

      // Insert jawaban baru
      const insertedAnswers = await db
        .insert(responseAnswers)
        .values(
          answersArray.map(answer => ({
            ...answer,
            responseId: updatedResponse.id
          }))
        )
        .returning()

      newResponse = updatedResponse

    } else {
      // MODE CREATE: Buat response baru
      const [createdResponse] = await db
        .insert(instrumentResponses)
        .values({
          instrumentId,
          instansi,
          totalScore: totalScore.toString(),
          verificationStatus: 'pending',
          submittedAt: new Date()
        })
        .returning()

      // Insert all answers
      const valuesToInsert = answersArray.map(answer => ({
        ...answer,
        responseId: createdResponse.id
      }))
      
      const insertedAnswers = await db
        .insert(responseAnswers)
        .values(valuesToInsert)
        .returning()

      newResponse = createdResponse
    }

    return {
      success: true,
      data: {
        response: newResponse,
        totalScore,
        message: isUpdate ? 'Survey berhasil diperbarui' : 'Survey berhasil dikirim'
      }
    }
  } catch (error: any) {
    console.error('Error submitting survey response:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal mengirim survey'
    })
  }
})
