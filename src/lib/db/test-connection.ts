// Simple database connection test
import { db } from './index'

export async function testDatabaseConnection() {
  try {
    // Simple query to test connection
    await db.execute('SELECT 1 as test')
    console.log('✅ Database connection successful!')
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// You can call this function to test the connection
if (require.main === module) {
  testDatabaseConnection()
} 