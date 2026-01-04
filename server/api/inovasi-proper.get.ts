export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = query.page || 1
  const perPage = query.perPage || 100
  
  try {
    const response = await $fetch(`https://properexpo.lan.go.id/app/api/tx-proper?perPage=${perPage}&page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })

    return response
  } catch (error) {
    console.error('Error fetching from Proper Expo API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch data from Proper Expo API'
    })
  }
})
