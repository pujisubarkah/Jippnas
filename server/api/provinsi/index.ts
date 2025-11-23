import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { provinsi } from '~/drizzle/schema/provinsi'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all provinces
    try {
      const provinces = await db.select().from(provinsi).orderBy(provinsi.nama)
      return { success: true, data: provinces }
    } catch (error) {
      console.error('Error fetching provinces:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch provinces'
      })
    }
  }

  if (method === 'POST') {
    // Create new province
    try {
      const body = await readBody(event)
      const { nama, svg_path, id_provinsi } = body

      if (!nama || !id_provinsi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'nama and id_provinsi are required'
        })
      }

      const newProvince = await db.insert(provinsi).values({
        nama,
        svg_path,
        id_provinsi,
        created_at: new Date()
      }).returning()

      return { success: true, data: newProvince[0] }
    } catch (error) {
      console.error('Error creating province:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create province'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})