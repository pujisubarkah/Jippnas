import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { bukuInovasi } from '~/drizzle/schema/buku-inovasi'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all buku inovasi
    try {
      const bukuList = await db.select().from(bukuInovasi).orderBy(bukuInovasi.created_at)
      return { success: true, data: bukuList }
    } catch (error) {
      console.error('Error fetching buku inovasi:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch buku inovasi'
      })
    }
  }

  if (method === 'POST') {
    // Create new buku inovasi
    try {
      const body = await readBody(event)
      const { judul, gambar, sinopsis, file, uploaded_by } = body

      if (!judul) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul is required'
        })
      }

      const newBuku = await db.insert(bukuInovasi).values({
        judul,
        gambar,
        sinopsis,
        file,
        uploaded_by,
        created_at: new Date(),
        updated_at: new Date()
      }).returning()

      return { success: true, data: newBuku[0] }
    } catch (error) {
      console.error('Error creating buku inovasi:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create buku inovasi'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})