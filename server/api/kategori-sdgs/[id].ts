import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { kategoriSdgs } from '~/drizzle/schema/kategori-sdgs'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(getRouterParam(event, 'id')!)

  if (method === 'GET') {
    // Get kategori_sdgs by ID
    try {
      const kategoriItem = await db.select().from(kategoriSdgs).where(eq(kategoriSdgs.id, id))
      if (kategoriItem.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Kategori not found'
        })
      }
      return { success: true, data: kategoriItem[0] }
    } catch (error) {
      console.error('Error fetching kategori_sdgs:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch kategori_sdgs'
      })
    }
  }

  if (method === 'PUT') {
    // Update kategori_sdgs by ID
    try {
      const body = await readBody(event)
      const { nama, gambar, keterangan, tahun, jenis, status } = body

      const updatedKategori = await db.update(kategoriSdgs).set({
        nama,
        gambar,
        keterangan,
        tahun,
        jenis,
        status,
        updated_at: new Date()
      }).where(eq(kategoriSdgs.id, id)).returning()

      if (updatedKategori.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Kategori not found'
        })
      }

      return { success: true, data: updatedKategori[0] }
    } catch (error) {
      console.error('Error updating kategori_sdgs:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update kategori_sdgs'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete kategori_sdgs by ID
    try {
      const deletedKategori = await db.delete(kategoriSdgs).where(eq(kategoriSdgs.id, id)).returning()

      if (deletedKategori.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Kategori not found'
        })
      }

      return { success: true, message: 'Kategori deleted successfully' }
    } catch (error) {
      console.error('Error deleting kategori_sdgs:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete kategori_sdgs'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})