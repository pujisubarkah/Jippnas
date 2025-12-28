import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { forumReplies, forumUsers } from '~/drizzle/schema/forum'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const id = parseInt(event.context.params?.id as string)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  if (method === 'GET') {
    // Get forum reply by ID with full details
    try {
      const reply = await db
        .select({
          id: forumReplies.id,
          threadId: forumReplies.threadId,
          content: forumReplies.content,
          parentReplyId: forumReplies.parentReplyId,
          voteCount: forumReplies.voteCount,
          likeCount: forumReplies.likeCount,
          dislikeCount: forumReplies.dislikeCount,
          isEdited: forumReplies.isEdited,
          editedAt: forumReplies.editedAt,
          createdAt: forumReplies.createdAt,
          updatedAt: forumReplies.updatedAt,
          author: {
            id: forumUsers.id,
            username: forumUsers.username,
            displayName: forumUsers.displayName,
            avatarUrl: forumUsers.avatarUrl,
            reputation: forumUsers.reputation
          }
        })
        .from(forumReplies)
        .leftJoin(forumUsers, eq(forumReplies.authorId, forumUsers.id))
        .where(eq(forumReplies.id, id))
        .limit(1)

      if (reply.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum reply not found'
        })
      }

      return { success: true, data: reply[0] }
    } catch (error) {
      console.error('Error fetching forum reply:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum reply'
      })
    }
  }

  if (method === 'PUT') {
    // Update forum reply by ID
    try {
      const body = await readBody(event)
      const { content } = body

      if (!content) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Content is required'
        })
      }

      const updatedReply = await db
        .update(forumReplies)
        .set({
          content,
          isEdited: true,
          editedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(forumReplies.id, id))
        .returning()

      if (updatedReply.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum reply not found'
        })
      }

      return { success: true, data: updatedReply[0] }
    } catch (error) {
      console.error('Error updating forum reply:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update forum reply'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete forum reply by ID
    try {
      const deletedReply = await db
        .delete(forumReplies)
        .where(eq(forumReplies.id, id))
        .returning()

      if (deletedReply.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum reply not found'
        })
      }

      return { success: true, message: 'Forum reply deleted successfully' }
    } catch (error) {
      console.error('Error deleting forum reply:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete forum reply'
      })
    }
  }
})