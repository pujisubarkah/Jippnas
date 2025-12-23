import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { berita } from '~/drizzle/schema/berita'

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
    // Get berita by ID
    try {
      const beritaItem = await db.select().from(berita).where(eq(berita.id, id)).limit(1)
      if (beritaItem.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Berita not found'
        })
      }
      return { success: true, data: beritaItem[0] }
    } catch (error) {
      console.error('Error fetching berita:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch berita'
      })
    }
  }

  if (method === 'PUT') {
    // Update berita by ID
    try {
      const body = await readBody(event)
      const { judul, deskripsi, tag, img } = body

      if (!judul || !deskripsi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul and deskripsi are required'
        })
      }

      const updatedBerita = await db.update(berita)
        .set({
          judul,
          deskripsi,
          tag,
          img,
          updated_at: new Date()
        })
        .where(eq(berita.id, id))
        .returning()

      if (updatedBerita.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Berita not found'
        })
      }

      return { success: true, data: updatedBerita[0] }
    } catch (error) {
      console.error('Error updating berita:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update berita'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete berita by ID
    try {
      const deletedBerita = await db.delete(berita).where(eq(berita.id, id)).returning()

      if (deletedBerita.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Berita not found'
        })
      }

      return { success: true, message: 'Berita deleted successfully' }
    } catch (error) {
      console.error('Error deleting berita:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete berita'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})