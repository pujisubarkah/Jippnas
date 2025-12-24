import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { kategoriSdgs } from '~/drizzle/schema/kategori-sdgs'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all kategori_sdgs
    try {
      const kategoriList = await db.select().from(kategoriSdgs).orderBy(kategoriSdgs.created_at)
      return { success: true, data: kategoriList }
    } catch (error) {
      console.error('Error fetching kategori_sdgs:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch kategori_sdgs'
      })
    }
  }

  if (method === 'POST') {
    // Create new kategori_sdgs
    try {
      const body = await readBody(event)
      const { nama, gambar, keterangan, tahun, jenis, status } = body

      if (!nama) {
        throw createError({
          statusCode: 400,
          statusMessage: 'nama is required'
        })
      }

      const newKategori = await db.insert(kategoriSdgs).values({
        nama,
        gambar,
        keterangan,
        tahun,
        jenis,
        status: status !== undefined ? status : true,
        created_at: new Date(),
        updated_at: new Date()
      }).returning()

      return { success: true, data: newKategori[0] }
    } catch (error) {
      console.error('Error creating kategori_sdgs:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create kategori_sdgs'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})