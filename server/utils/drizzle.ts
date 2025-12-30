import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

let db: any

export function useDrizzle() {
  if (!db) {
    const client = postgres(process.env.DATABASE_URL!)
    db = drizzle(client)
  }
  return db
}