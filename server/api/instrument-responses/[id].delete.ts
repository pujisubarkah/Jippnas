import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentResponses, responseAnswers } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  try {
    const id = parseInt(event.context.params?.id || '0')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID response tidak valid'
      })
    }

    console.log('🗑️ [DELETE] Deleting response:', id)

    // Hapus jawaban terkait (cascade seharusnya otomatis, tapi kita pastikan)
    await db
      .delete(responseAnswers)
      .where(eq(responseAnswers.responseId, id))

    console.log('✅ [DELETE] Deleted answers for response:', id)

    // Hapus response
    const deleted = await db
      .delete(instrumentResponses)
      .where(eq(instrumentResponses.id, id))
      .returning()

    if (deleted.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Response tidak ditemukan'
      })
    }

    console.log('✅ [DELETE] Deleted response:', id)

    return {
      success: true,
      message: 'Response berhasil dihapus'
    }
  } catch (error: any) {
    console.error('❌ [DELETE] Error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Gagal menghapus response'
    })
  }
})
