import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { masterInovasi } from '~/drizzle/schema/master_inovasi'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id || '0')

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid inovasi ID'
    })
  }

  if (method === 'GET') {
    // Get inovasi by ID
    try {
      const inovasi = await db.select().from(masterInovasi).where(eq(masterInovasi.id, id)).limit(1)

      if (inovasi.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Inovasi not found'
        })
      }

      return { success: true, data: inovasi[0] }
    } catch (error) {
      console.error('Error fetching inovasi:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch inovasi'
      })
    }
  }

  if (method === 'PUT') {
    // Update inovasi by ID
    try {
      const body = await readBody(event)
      const { judul, gambar, file, keterangan } = body

      if (!judul || !keterangan) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul and keterangan are required'
        })
      }

      const updatedInovasi = await db.update(masterInovasi)
        .set({
          judul,
          gambar,
          file,
          keterangan,
          updated_at: new Date()
        })
        .where(eq(masterInovasi.id, id))
        .returning()

      if (updatedInovasi.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Inovasi not found'
        })
      }

      return { success: true, data: updatedInovasi[0] }
    } catch (error) {
      console.error('Error updating inovasi:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update inovasi'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete inovasi by ID
    try {
      const deletedInovasi = await db.delete(masterInovasi)
        .where(eq(masterInovasi.id, id))
        .returning()

      if (deletedInovasi.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Inovasi not found'
        })
      }

      return { success: true, data: deletedInovasi[0] }
    } catch (error) {
      console.error('Error deleting inovasi:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete inovasi'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})