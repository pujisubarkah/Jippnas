import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentAspects } from '~/drizzle/schema/survey'

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
    // Get instrument aspect by ID
    try {
      const aspect = await db.select().from(instrumentAspects).where(eq(instrumentAspects.id, id)).limit(1)
      if (aspect.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument aspect not found'
        })
      }
      return { success: true, data: aspect[0] }
    } catch (error) {
      console.error('Error fetching instrument aspect:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch instrument aspect'
      })
    }
  }

  if (method === 'PUT') {
    // Update instrument aspect by ID
    try {
      const body = await readBody(event)
      const { instrumentId, name, sortOrder } = body

      if (!instrumentId || !name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Instrument ID and name are required'
        })
      }

      const updatedAspect = await db
        .update(instrumentAspects)
        .set({
          instrumentId,
          name,
          sortOrder
        })
        .where(eq(instrumentAspects.id, id))
        .returning()

      if (updatedAspect.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument aspect not found'
        })
      }

      return { success: true, data: updatedAspect[0] }
    } catch (error) {
      console.error('Error updating instrument aspect:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update instrument aspect'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete instrument aspect by ID
    try {
      const deletedAspect = await db
        .delete(instrumentAspects)
        .where(eq(instrumentAspects.id, id))
        .returning()

      if (deletedAspect.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Instrument aspect not found'
        })
      }

      return { success: true, message: 'Instrument aspect deleted successfully' }
    } catch (error) {
      console.error('Error deleting instrument aspect:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete instrument aspect'
      })
    }
  }
})