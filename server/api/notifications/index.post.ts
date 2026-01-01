import { drizzle } from 'drizzle-orm/postgres-js'
import { eq, desc, and } from 'drizzle-orm'
import postgres from 'postgres'
import { notifications } from '~/drizzle/schema/notifications'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const userId = event.context.auth?.user?.id // Assuming auth middleware

  if (method === 'GET') {
    // Get notifications for current user
    try {
      const userNotifications = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(desc(notifications.createdAt))
        .limit(50)

      return { success: true, data: userNotifications }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch notifications'
      })
    }
  }

  if (method === 'POST') {
    // Create new notification
    try {
      const body = await readBody(event)
      const { title, message, type, icon, userId: targetUserId } = body

      if (!title || !message || !targetUserId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title, message, and userId are required'
        })
      }

      const [newNotification] = await db.insert(notifications).values({
        userId: targetUserId,
        title,
        message,
        type: type || 'info',
        icon: icon || 'mdi-bell',
        read: false,
        createdAt: new Date()
      }).returning()

      return { success: true, data: newNotification }
    } catch (error) {
      console.error('Error creating notification:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create notification'
      })
    }
  }

  if (method === 'PUT') {
    // Mark notification as read
    try {
      const body = await readBody(event)
      const { notificationId, markAll } = body

      if (markAll) {
        // Mark all notifications as read for current user
        await db
          .update(notifications)
          .set({ read: true })
          .where(and(eq(notifications.userId, userId), eq(notifications.read, false)))
      } else if (notificationId) {
        // Mark specific notification as read
        await db
          .update(notifications)
          .set({ read: true })
          .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
      }

      return { success: true, message: 'Notifications marked as read' }
    } catch (error) {
      console.error('Error updating notifications:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update notifications'
      })
    }
  }
})