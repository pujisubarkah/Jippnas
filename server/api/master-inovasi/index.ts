import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { masterInovasi } from '~/drizzle/schema/master_inovasi'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all inovasi
    try {
      const inovasi = await db.select().from(masterInovasi).orderBy(masterInovasi.judul)
      return { success: true, data: inovasi }
    } catch (error) {
      console.error('Error fetching inovasi:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch inovasi'
      })
    }
  }

  if (method === 'POST') {
    // Create new inovasi
    try {
      const body = await readBody(event)
      const { judul, gambar, file, keterangan } = body

      if (!judul || !keterangan) {
        throw createError({
          statusCode: 400,
          statusMessage: 'judul and keterangan are required'
        })
      }

      const newInovasi = await db.insert(masterInovasi).values({
        judul,
        gambar,
        file,
        keterangan,
        created_at: new Date(),
        updated_at: new Date()
      }).returning()

      return { success: true, data: newInovasi[0] }
    } catch (error) {
      console.error('Error creating inovasi:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create inovasi'
      })
    }
  }
})