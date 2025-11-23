import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { masterProvinsi } from '~/drizzle/schema/master_provinsi'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id || '0')

  if (!id || isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid province ID'
    })
  }

  if (method === 'GET') {
    // Get province by ID
    try {
      const province = await db.select().from(masterProvinsi).where(eq(masterProvinsi.id, id)).limit(1)

      if (province.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Province not found'
        })
      }

      return { success: true, data: province[0] }
    } catch (error) {
      console.error('Error fetching province:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch province'
      })
    }
  }

  if (method === 'PUT') {
    // Update province by ID
    try {
      const body = await readBody(event)
      const { id_provinsi, nama_provinsi } = body

      if (!id_provinsi || !nama_provinsi) {
        throw createError({
          statusCode: 400,
          statusMessage: 'id_provinsi and nama_provinsi are required'
        })
      }

      const updatedProvince = await db.update(masterProvinsi)
        .set({
          id_provinsi,
          nama_provinsi
        })
        .where(eq(masterProvinsi.id, id))
        .returning()

      if (updatedProvince.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Province not found'
        })
      }

      return { success: true, data: updatedProvince[0] }
    } catch (error) {
      console.error('Error updating province:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update province'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete province by ID
    try {
      const deletedProvince = await db.delete(masterProvinsi)
        .where(eq(masterProvinsi.id, id))
        .returning()

      if (deletedProvince.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Province not found'
        })
      }

      return { success: true, data: deletedProvince[0] }
    } catch (error) {
      console.error('Error deleting province:', error)
      if (error && typeof error === 'object' && 'statusCode' in error) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete province'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})