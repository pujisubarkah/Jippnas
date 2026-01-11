import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { instrumentAspects } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all instrument aspects from instrument_aspects table
    try {
      const aspects = await db
        .select()
        .from(instrumentAspects)
        .orderBy(instrumentAspects.sortOrder, instrumentAspects.createdAt)

      return { success: true, data: aspects }
    } catch (error) {
      console.error('Error fetching instrument aspects:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch instrument aspects'
      })
    }
  }

  if (method === 'POST') {
    // Create new instrument aspect
    try {
      const body = await readBody(event)
      const { instrumentId, name, weight, sortOrder } = body

      if (!instrumentId || !name) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Instrument ID and name are required'
        })
      }

      const newAspect = await db.insert(instrumentAspects).values({
        instrumentId,
        name,
        weight: weight || '1.00',
        sortOrder: sortOrder ?? 0,
        createdAt: new Date()
      }).returning()

      return { success: true, data: newAspect[0] }
    } catch (error) {
      console.error('Error creating instrument aspect:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create instrument aspect'
      })
    }
  }
})