import { db } from '~/drizzle/db'
import { kolaborasiTuxedovation } from '~/drizzle/schema/kolaborasi-tuxedovation'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { items } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No items provided'
      })
    }

    const results = []

    for (const item of items) {
      // Check if data already exists by id
      const existing = await db
        .select()
        .from(kolaborasiTuxedovation)
        .where(eq(kolaborasiTuxedovation.id, item.id))
        .limit(1)

      if (existing.length > 0) {
        // Update existing data
        await db
          .update(kolaborasiTuxedovation)
          .set({
            title: item.title,
            image: item.image,
            pemda: item.pemda,
            date: item.date ? new Date(item.date) : null
          })
          .where(eq(kolaborasiTuxedovation.id, item.id))

        results.push({ id: existing[0].id, status: 'updated' })
      } else {
        // Insert new data
        const inserted = await db
          .insert(kolaborasiTuxedovation)
          .values({
            title: item.title,
            image: item.image,
            pemda: item.pemda,
            date: item.date ? new Date(item.date) : null
          })
          .returning()

        results.push({ id: inserted[0].id, status: 'created' })
      }
    }

    return {
      success: true,
      message: `Successfully saved ${results.length} items`,
      data: results
    }
  } catch (error) {
    console.error('Error saving Tuxedovation data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save data to database'
    })
  }
})
