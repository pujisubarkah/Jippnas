import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { unduhan } from '~/drizzle/schema/unduhan'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id as string)

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  if (method === 'GET') {
    // Get unduhan by ID
    try {
      const unduhanItem = await db.select().from(unduhan).where(eq(unduhan.id, id)).limit(1)

      if (unduhanItem.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Unduhan not found'
        })
      }

      return { success: true, data: unduhanItem[0] }
    } catch (error) {
      console.error('Error fetching unduhan:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch unduhan'
      })
    }
  }

  if (method === 'PUT') {
    // Update unduhan by ID
    try {
      const body = await readBody(event)
      const { judul, gambar, deskripsi, file, status, pdf_url } = body

      if (!judul) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul is required'
        })
      }

      const updatedUnduhan = await db.update(unduhan)
        .set({
          judul,
          gambar,
          deskripsi,
          file,
          status,
          pdf_url,
          updated_at: new Date()
        })
        .where(eq(unduhan.id, id))
        .returning()

      if (updatedUnduhan.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Unduhan not found'
        })
      }

      return { success: true, data: updatedUnduhan[0] }
    } catch (error) {
      console.error('Error updating unduhan:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update unduhan'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete unduhan by ID
    try {
      const deletedUnduhan = await db.delete(unduhan)
        .where(eq(unduhan.id, id))
        .returning()

      if (deletedUnduhan.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Unduhan not found'
        })
      }

      return { success: true, message: 'Unduhan deleted successfully' }
    } catch (error) {
      console.error('Error deleting unduhan:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete unduhan'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})