import { eq, and, desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { messages } from '~/drizzle/schema';

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  if (method === 'GET') {
    try {
      const userId = getQuery(event).userId as string;

      if (!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'User ID is required'
        });
      }

      const userMessages = await db
        .select()
        .from(messages)
        .where(eq(messages.recipientId, parseInt(userId)))
        .orderBy(desc(messages.createdAt));

      return {
        success: true,
        data: userMessages
      };
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch messages'
      });
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      const { senderId, recipientId, subject, content, type = 'message' } = body;

      if (!senderId || !recipientId || !subject || !content) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Missing required fields'
        });
      }

      const newMessage = await db
        .insert(messages)
        .values({
          senderId: parseInt(senderId),
          recipientId: parseInt(recipientId),
          subject,
          content,
          type,
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      return {
        success: true,
        data: newMessage[0]
      };
    } catch (error) {
      console.error('Error creating message:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create message'
      });
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const { id, isRead } = body;

      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Message ID is required'
        });
      }

      const updatedMessage = await db
        .update(messages)
        .set({
          isRead: isRead ?? true,
          updatedAt: new Date()
        })
        .where(eq(messages.id, parseInt(id)))
        .returning();

      if (updatedMessage.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Message not found'
        });
      }

      return {
        success: true,
        data: updatedMessage[0]
      };
    } catch (error) {
      console.error('Error updating message:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update message'
      });
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  });
});