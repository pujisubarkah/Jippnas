import { chatMessages } from '~/drizzle/schema/chat'
import { useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, username, instansi, message } = body

  if (!username || !message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username and message are required'
    })
  }

  const db = useDrizzle()

  try {
    const newMessage = await db
      .insert(chatMessages)
      .values({
        userId: userId || null, // Nullable untuk guest
        username,
        instansi: instansi || null, // Nullable
        message
      })
      .returning()

    return newMessage[0]
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to save message'
    })
  }
})