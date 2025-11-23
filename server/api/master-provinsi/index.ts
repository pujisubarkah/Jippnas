import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { masterProvinsi } from '~/drizzle/schema/master_provinsi'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all provinces
    try {
      const provinces = await db.select().from(masterProvinsi).orderBy(masterProvinsi.nama_provinsi)
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
      const { id_provinsi, nama_provinsi } = body

      if (!id_provinsi || !nama_provinsi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'id_provinsi and nama_provinsi are required'
        })
      }

      const newProvince = await db.insert(masterProvinsi).values({
        id_provinsi,
        nama_provinsi,
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