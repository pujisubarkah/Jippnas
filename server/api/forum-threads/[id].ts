import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { forumThreads, forumCategories, forumUsers } from '~/drizzle/schema/forum'

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
    // Get forum thread by ID with full details
    try {
      const thread = await db
        .select({
          id: forumThreads.id,
          title: forumThreads.title,
          content: forumThreads.content,
          slug: forumThreads.slug,
          viewCount: forumThreads.viewCount,
          replyCount: forumThreads.replyCount,
          voteCount: forumThreads.voteCount,
          likeCount: forumThreads.likeCount,
          dislikeCount: forumThreads.dislikeCount,
          isSticky: forumThreads.isSticky,
          isLocked: forumThreads.isLocked,
          isFeatured: forumThreads.isFeatured,
          lastReplyAt: forumThreads.lastReplyAt,
          createdAt: forumThreads.createdAt,
          updatedAt: forumThreads.updatedAt,
          category: {
            id: forumCategories.id,
            name: forumCategories.name,
            description: forumCategories.description,
            color: forumCategories.color
          },
          author: {
            id: forumUsers.id,
            username: forumUsers.username,
            displayName: forumUsers.displayName,
            avatarUrl: forumUsers.avatarUrl,
            reputation: forumUsers.reputation,
            joinDate: forumUsers.joinDate
          }
        })
        .from(forumThreads)
        .leftJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
        .leftJoin(forumUsers, eq(forumThreads.authorId, forumUsers.id))
        .where(eq(forumThreads.id, id))
        .limit(1)

      if (thread.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum thread not found'
        })
      }

      return { success: true, data: thread[0] }
    } catch (error) {
      console.error('Error fetching forum thread:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum thread'
      })
    }
  }

  if (method === 'PUT') {
    // Update forum thread by ID
    try {
      const body = await readBody(event)
      const { title, content, categoryId, isSticky, isLocked, isFeatured } = body

      if (!title || !content || !categoryId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title, content, and category ID are required'
        })
      }

      const updatedThread = await db
        .update(forumThreads)
        .set({
          title,
          content,
          categoryId,
          isSticky,
          isLocked,
          isFeatured,
          updatedAt: new Date()
        })
        .where(eq(forumThreads.id, id))
        .returning()

      if (updatedThread.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum thread not found'
        })
      }

      return { success: true, data: updatedThread[0] }
    } catch (error) {
      console.error('Error updating forum thread:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update forum thread'
      })
    }
  }

  if (method === 'DELETE') {
    // Delete forum thread by ID
    try {
      const deletedThread = await db
        .delete(forumThreads)
        .where(eq(forumThreads.id, id))
        .returning()

      if (deletedThread.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Forum thread not found'
        })
      }

      return { success: true, message: 'Forum thread deleted successfully' }
    } catch (error) {
      console.error('Error deleting forum thread:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to delete forum thread'
      })
    }
  }
})