export default defineEventHandler(async (event) => {
  try {
    const response = await $fetch('https://inoland.lan.go.id/api/inolands', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    })

    return response
  } catch (error) {
    console.error('Error fetching from Inoland API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch data from Inoland API'
    })
  }
})
