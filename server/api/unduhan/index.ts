import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { unduhan } from '~/drizzle/schema/unduhan'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all unduhan
    try {
      const unduhanList = await db.select().from(unduhan).orderBy(unduhan.created_at)
      return { success: true, data: unduhanList }
    } catch (error) {
      console.error('Error fetching unduhan:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch unduhan'
      })
    }
  }

  if (method === 'POST') {
    // Create new unduhan
    try {
      const body = await readBody(event)
      const { judul, gambar, deskripsi, file, status, pdf_url } = body

      if (!judul) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul is required'
        })
      }

      const newUnduhan = await db.insert(unduhan).values({
        judul,
        gambar,
        deskripsi,
        file,
        status,
        pdf_url,
        created_at: new Date(),
        updated_at: new Date()
      }).returning()

      return { success: true, data: newUnduhan[0] }
    } catch (error) {
      console.error('Error creating unduhan:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create unduhan'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})