import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { acara } from '~/drizzle/schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  if (method === 'GET') {
    // Get acara by ID
    try {
      const acaraItem = await db.select().from(acara).where(eq(acara.id, id)).limit(1)
      if (acaraItem.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Acara not found'
        })
      }
      return { success: true, data: acaraItem[0] }
    } catch (error) {
      console.error('Error fetching acara:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch acara'
      })
    }
  }

  if (method === 'PUT') {
    // Update acara by ID
    try {
      const body = await readBody(event)
      const { tgl_acara, jam_acara, start_date, end_date, title, gambar, keterangan, id_penyelenggara, nm_penyelenggara, is_active } = body

      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'title is required'
        })
      }

      const updatedAcara = await db
        .update(acara)
        .set({
          tgl_acara,
          jam_acara,
          start_date,
          end_date,
          title,
          gambar,
          keterangan,
          id_penyelenggara,
          nm_penyelenggara,
          is_active,
          updated_at: new Date()
        })
        .where(eq(acara.id, id))
        .returning()

      if (updatedAcara.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Acara not found'
        })
      }

      return { success: true, data: updatedAcara[0] }
    } catch (error) {
      console.error('Error updating acara:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update acara'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete acara by ID
    try {
      const deletedAcara = await db
        .delete(acara)
        .where(eq(acara.id, id))
        .returning()

      if (deletedAcara.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Acara not found'
        })
      }

      return { success: true, message: 'Acara deleted successfully' }
    } catch (error) {
      console.error('Error deleting acara:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete acara'
      })
    }
  }
})