

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const offset = Number(query.offset) || 0
    const response = await $fetch<{ inovasi: any[] }>(
      `https://api.indeks.inovasi.litbang.kemendagri.go.id/tuxe/new-release?offset=${offset}`
    )

    if (!response || !Array.isArray(response.inovasi)) {
      throw createError({
        statusCode: 502,
        statusMessage: 'Invalid response from Tuxedovation API'
      })
    }

    // Format data sesuai kebutuhan frontend
    const formattedData = response.inovasi.map((item: any) => ({
      id: item.id,
      title: item.nama,
      image: item.indikator_video?.thumbnail_url || '/placeholder-image.jpg',
      pemda: item.pemda,
      date: item.waktu,
    }))

    return {
      inovasi: formattedData
    }
  } catch (error) {
    console.error('Error fetching from Tuxedovation API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch data from Tuxedovation API'
    })
  }
})