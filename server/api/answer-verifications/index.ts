import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import postgres from 'postgres'
import { answerVerifications } from '~/drizzle/schema/survey'

const client = postgres(process.env.DATABASE_URL!)
const db = drizzle(client)

export default defineEventHandler(async (event) => {
  const method = event.node.req.method

  if (method === 'GET') {
    // Get all answer verifications
    try {
      const verifications = await db.select().from(answerVerifications).orderBy(answerVerifications.verifiedAt)
      return { success: true, data: verifications }
    } catch (error) {
      console.error('Error fetching answer verifications:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch answer verifications'
      })
    }
  }

  if (method === 'POST') {
    // Create new answer verification
    try {
      const body = await readBody(event)
      const { answerId, verifiedOptionIds, verifiedOptionId, verificationStatus, verificationNote, verifiedBy } = body

      if (!answerId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Answer ID is required'
        })
      }

      const newVerification = await db.insert(answerVerifications).values({
        answerId,
        verifiedOptionIds,
        verifiedOptionId,
        verificationStatus: verificationStatus ?? 'pending',
        verificationNote,
        verifiedBy,
        verifiedAt: new Date()
      }).returning()

      return { success: true, data: newVerification[0] }
    } catch (error) {
      console.error('Error creating answer verification:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create answer verification'
      })
    }
  }
})