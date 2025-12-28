import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, desc, and } from 'drizzle-orm'
import postgres from 'postgres'
import { forumThreads, forumCategories, forumUsers } from '~/drizzle/schema/forum'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const query = getQuery(event)

  if (method === 'GET') {
    // Get all forum threads with optional filtering
    try {
      let whereCondition = undefined

      // Filter by category
      if (query.categoryId) {
        whereCondition = eq(forumThreads.categoryId, parseInt(query.categoryId as string))
      }

      // Filter by author
      if (query.authorId) {
        const authorCondition = eq(forumThreads.authorId, parseInt(query.authorId as string))
        whereCondition = whereCondition ? and(whereCondition, authorCondition) : authorCondition
      }

      // Filter by sticky threads
      if (query.sticky === 'true') {
        const stickyCondition = eq(forumThreads.isSticky, true)
        whereCondition = whereCondition ? and(whereCondition, stickyCondition) : stickyCondition
      }

      const threads = await db
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
            color: forumCategories.color
          },
          author: {
            id: forumUsers.id,
            username: forumUsers.username,
            displayName: forumUsers.displayName,
            avatarUrl: forumUsers.avatarUrl
          }
        })
        .from(forumThreads)
        .leftJoin(forumCategories, eq(forumThreads.categoryId, forumCategories.id))
        .leftJoin(forumUsers, eq(forumThreads.authorId, forumUsers.id))
        .where(whereCondition)
        .orderBy(desc(forumThreads.isSticky), desc(forumThreads.lastReplyAt))

      return { success: true, data: threads }
    } catch (error) {
      console.error('Error fetching forum threads:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch forum threads'
      })
    }
  }

  if (method === 'POST') {
    // Create new forum thread
    try {
      const body = await readBody(event)
      const { title, content, categoryId, authorId } = body

      if (!title || !content || !categoryId || !authorId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title, content, category ID, and author ID are required'
        })
      }

      // Generate slug from title
      const slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const newThread = await db.insert(forumThreads).values({
        title,
        content,
        categoryId,
        authorId,
        slug,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastReplyAt: new Date()
      }).returning()

      return { success: true, data: newThread[0] }
    } catch (error) {
      console.error('Error creating forum thread:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create forum thread'
      })
    }
  }
})