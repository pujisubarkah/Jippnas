import { chatMessages } from '~/drizzle/schema/chat'
import { useDrizzle } from '~/server/utils/drizzle'

export default defineEventHandler(async (event) => {
  const db = useDrizzle()

  try {
    const messages = await db
      .select()
      .from(chatMessages)
      .orderBy(chatMessages.createdAt)
      .limit(50) // Limit untuk performa

    return messages
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch messages'
    })
  }
})