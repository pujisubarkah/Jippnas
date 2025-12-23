import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { berita } from '~/drizzle/schema/berita'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all berita
    try {
      const beritaList = await db.select().from(berita).orderBy(berita.created_at)
      return { success: true, data: beritaList }
    } catch (error) {
      console.error('Error fetching berita:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch berita'
      })
    }
  }

  if (method === 'POST') {
    // Create new berita
    try {
      const body = await readBody(event)
      const { judul, deskripsi, tag, img } = body

      if (!judul || !deskripsi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul and deskripsi are required'
        })
      }

      const newBerita = await db.insert(berita).values({
        judul,
        deskripsi,
        tag,
        img,
        created_at: new Date(),
        updated_at: new Date()
      }).returning()

      return { success: true, data: newBerita[0] }
    } catch (error) {
      console.error('Error creating berita:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create berita'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})