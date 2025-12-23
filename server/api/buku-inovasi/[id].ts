import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { bukuInovasi } from '~/drizzle/schema/buku-inovasi'

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
    // Get buku inovasi by ID
    try {
      const buku = await db.select().from(bukuInovasi).where(eq(bukuInovasi.id, id)).limit(1)

      if (buku.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Buku inovasi not found'
        })
      }

      return { success: true, data: buku[0] }
    } catch (error) {
      console.error('Error fetching buku inovasi:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch buku inovasi'
      })
    }
  }

  if (method === 'PUT') {
    // Update buku inovasi by ID
    try {
      const body = await readBody(event)
      const { judul, gambar, sinopsis, file, uploaded_by } = body

      if (!judul) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul is required'
        })
      }

      const updatedBuku = await db.update(bukuInovasi)
        .set({
          judul,
          gambar,
          sinopsis,
          file,
          uploaded_by,
          updated_at: new Date()
        })
        .where(eq(bukuInovasi.id, id))
        .returning()

      if (updatedBuku.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Buku inovasi not found'
        })
      }

      return { success: true, data: updatedBuku[0] }
    } catch (error) {
      console.error('Error updating buku inovasi:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update buku inovasi'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete buku inovasi by ID
    try {
      const deletedBuku = await db.delete(bukuInovasi)
        .where(eq(bukuInovasi.id, id))
        .returning()

      if (deletedBuku.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Buku inovasi not found'
        })
      }

      return { success: true, message: 'Buku inovasi deleted successfully' }
    } catch (error) {
      console.error('Error deleting buku inovasi:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete buku inovasi'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})