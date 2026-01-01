import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { acara } from '~/drizzle/schema'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all acara
    try {
      const acaraList = await db.select().from(acara).orderBy(acara.created_at)
      return { success: true, data: acaraList }
    } catch (error) {
      console.error('Error fetching acara:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch acara'
      })
    }
  }

  if (method === 'POST') {
    // Create new acara
    try {
      const body = await readBody(event)
      const { tgl_acara, jam_acara, start_date, end_date, title, gambar, keterangan, id_penyelenggara, nm_penyelenggara, is_active } = body

      if (!title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'title is required'
        })
      }

      const newAcara = await db.insert(acara).values({
        tgl_acara,
        jam_acara,
        start_date,
        end_date,
        title,
        gambar,
        keterangan,
        id_penyelenggara,
        nm_penyelenggara,
        is_active,
        created_at: new Date(),
        updated_at: new Date()
      }).returning()

      return { success: true, data: newAcara[0] }
    } catch (error) {
      console.error('Error creating acara:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create acara'
      })
    }
  }
})