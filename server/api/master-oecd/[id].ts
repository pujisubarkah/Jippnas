import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { eq } from 'drizzle-orm'
import { masterOecd } from '~/drizzle/schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (!event.context.params || !event.context.params.id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  const id = parseInt(event.context.params.id)

  if (method === 'GET') {
    try {
      const oecdItem = await db.select().from(masterOecd).where(eq(masterOecd.id, id))
      if (oecdItem.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Item not found'
        })
      }
      return {
        success: true,
        data: oecdItem[0]
      }
    } catch (error) {
      console.error('Error fetching master_oecd:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch data'
      })
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      const { nama, keterangan, gambar, isActive, isDel } = body

      const updatedOecd = await db.update(masterOecd).set({
        nama,
        keterangan,
        gambar,
        isActive,
        isDel,
        updatedAt: new Date()
      }).where(eq(masterOecd.id, id)).returning()

      if (updatedOecd.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Item not found'
        })
      }

      return {
        success: true,
        data: updatedOecd[0]
      }
    } catch (error) {
      console.error('Error updating master_oecd:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update data'
      })
    }
  }

  if (method === 'DELETE') {
    try {
      const deletedOecd = await db.delete(masterOecd).where(eq(masterOecd.id, id)).returning()

      if (deletedOecd.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Item not found'
        })
      }

      return {
        success: true,
        data: deletedOecd[0]
      }
    } catch (error) {
      console.error('Error deleting master_oecd:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete data'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})