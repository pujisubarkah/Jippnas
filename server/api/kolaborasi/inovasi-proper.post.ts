import { db } from '~/drizzle/db'
import { kolaborasiInovasiProper } from '~/drizzle/schema'
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
      // Check if data already exists by external_id
      const existing = await db
        .select()
        .from(kolaborasiInovasiProper)
        .where(eq(kolaborasiInovasiProper.external_id, item.external_id))
        .limit(1)

      if (existing.length > 0) {
        // Update existing data
        await db
          .update(kolaborasiInovasiProper)
          .set({
            judul: item.judul,
            tahun: item.tahun,
            angkatan: item.angkatan,
            nama: item.nama,
            instansi_nama: item.instansi_nama,
            kategori_nama: item.kategori_nama,
            deskripsi_singkat: item.deskripsi_singkat,
            deskripsi_lengkap: item.deskripsi_lengkap,
            link_youtube: item.link_youtube,
            raw_data: JSON.stringify(item.raw_data),
            updated_at: new Date()
          })
          .where(eq(kolaborasiInovasiProper.external_id, item.external_id))

        results.push({ id: existing[0].id, status: 'updated' })
      } else {
        // Insert new data
        const inserted = await db
          .insert(kolaborasiInovasiProper)
          .values({
            external_id: item.external_id,
            judul: item.judul,
            tahun: item.tahun,
            angkatan: item.angkatan,
            nama: item.nama,
            instansi_nama: item.instansi_nama,
            kategori_nama: item.kategori_nama,
            deskripsi_singkat: item.deskripsi_singkat,
            deskripsi_lengkap: item.deskripsi_lengkap,
            link_youtube: item.link_youtube,
            raw_data: JSON.stringify(item.raw_data)
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
    console.error('Error saving Inovasi Proper data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save data to database'
    })
  }
})
