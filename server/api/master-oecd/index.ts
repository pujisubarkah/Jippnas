import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { masterOecd } from '~/drizzle/schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    try {
      const oecdData = await db.select().from(masterOecd).orderBy(masterOecd.createdAt)
      return {
        success: true,
        data: oecdData
      }
    } catch (error) {
      console.error('Error fetching master_oecd:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch data'
      })
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event)
      const { nama, keterangan, gambar, isActive, isDel } = body

      if (!nama) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Nama is required'
        })
      }

      const newOecd = await db.insert(masterOecd).values({
        nama,
        keterangan,
        gambar,
        isActive: isActive ?? true,
        isDel: isDel ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning()

      return {
        success: true,
        data: newOecd[0]
      }
    } catch (error) {
      console.error('Error creating master_oecd:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create data'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})