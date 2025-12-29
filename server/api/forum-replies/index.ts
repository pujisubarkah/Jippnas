import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, desc, and } from 'drizzle-orm'
import postgres from 'postgres'
import { forumReplies, forumUsers } from '~/drizzle/schema/forum'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)

  if (method === 'GET') {
    // Get all forum replies with optional filtering
    try {
      let whereCondition = undefined

      // Filter by thread
      if (query.threadId) {
        whereCondition = eq(forumReplies.threadId, parseInt(query.threadId as string))
      }

      // Filter by author
      if (query.authorId) {
        const authorCondition = eq(forumReplies.authorId, parseInt(query.authorId as string))
        whereCondition = whereCondition ? and(whereCondition, authorCondition) : authorCondition
      }

      const replies = await db
        .select({
          id: forumReplies.id,
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
        .where(whereCondition)
        .orderBy(desc(forumReplies.createdAt))

      return { success: true, data: replies }
    } catch (error) {
      console.error('Error fetching forum replies:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum replies'
      })
    }
  }

  if (method === 'POST') {
    // Create new forum reply
    try {
      const body = await readBody(event)
      const { threadId, authorId, content, parentReplyId } = body

      if (!threadId || !authorId || !content) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Thread ID, author ID, and content are required'
        })
      }

      const newReply = await db.insert(forumReplies).values({
        threadId,
        authorId,
        content,
        parentReplyId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning()

      return { success: true, data: newReply[0] }
    } catch (error) {
      console.error('Error creating forum reply:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create forum reply'
      })
    }
  }
})