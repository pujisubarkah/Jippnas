import { db } from '~/drizzle/db'
import { kolaborasiInoland } from '~/drizzle/schema'
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
        .from(kolaborasiInoland)
        .where(eq(kolaborasiInoland.external_id, item.external_id))
        .limit(1)

      if (existing.length > 0) {
        // Update existing data
        await db
          .update(kolaborasiInoland)
          .set({
            judul_inovasi: item.judul_inovasi,
            tahun: item.tahun,
            inovator: item.inovator,
            unit_kerja: item.unit_kerja,
            deskripsi: item.deskripsi,
            id_kabkot: item.id_kabkot,
            id_sdgs: item.id_sdgs,
            sdgs_nama: item.sdgs_nama,
            agency_id_panrb: item.agency_id_panrb,
            instansi_nama: item.instansi_nama,
            provinsi_nama: item.provinsi_nama,
            kabkot_nama: item.kabkot_nama,
            raw_data: JSON.stringify(item.raw_data),
            updated_at: new Date()
          })
          .where(eq(kolaborasiInoland.external_id, item.external_id))

        results.push({ id: existing[0].id, status: 'updated' })
      } else {
        // Insert new data
        const inserted = await db
          .insert(kolaborasiInoland)
          .values({
            external_id: item.external_id,
            judul_inovasi: item.judul_inovasi,
            tahun: item.tahun,
            inovator: item.inovator,
            unit_kerja: item.unit_kerja,
            deskripsi: item.deskripsi,
            id_kabkot: item.id_kabkot,
            id_sdgs: item.id_sdgs,
            sdgs_nama: item.sdgs_nama,
            agency_id_panrb: item.agency_id_panrb,
            instansi_nama: item.instansi_nama,
            provinsi_nama: item.provinsi_nama,
            kabkot_nama: item.kabkot_nama,
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
    console.error('Error saving Inoland data:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save data to database'
    })
  }
})
