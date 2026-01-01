import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { kategoriUmum } from '~/drizzle/schema/kategori_umum'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(getRouterParam(event, 'id')!)

  if (method === 'GET') {
    // Get kategori_umum by ID
    try {
      const kategoriItem = await db.select().from(kategoriUmum).where(eq(kategoriUmum.id, id))
      if (kategoriItem.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Kategori not found'
        })
      }
      return { success: true, data: kategoriItem[0] }
    } catch (error) {
      console.error('Error fetching kategori_umum:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch kategori_umum'
      })
    }
  }

  if (method === 'PUT') {
    // Update kategori_umum by ID
    try {
      const body = await readBody(event)
      const { id_jenis, nm_jenis, nama, keterangan, tahun, is_active, is_del } = body

      const updatedKategori = await db.update(kategoriUmum).set({
        id_jenis,
        nm_jenis,
        nama,
        keterangan,
        tahun,
        is_active,
        is_del,
        updated_at: new Date()
      }).where(eq(kategoriUmum.id, id)).returning()

      if (updatedKategori.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Kategori not found'
        })
      }

      return { success: true, data: updatedKategori[0] }
    } catch (error) {
      console.error('Error updating kategori_umum:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update kategori_umum'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete kategori_umum by ID
    try {
      const deletedKategori = await db.delete(kategoriUmum).where(eq(kategoriUmum.id, id)).returning()

      if (deletedKategori.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Kategori not found'
        })
      }

      return { success: true, message: 'Kategori deleted successfully' }
    } catch (error) {
      console.error('Error deleting kategori_umum:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete kategori_umum'
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  })
})