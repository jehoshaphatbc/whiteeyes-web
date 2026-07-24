import postgres from 'postgres'

let sqlClient: ReturnType<typeof postgres> | null = null

export function getDb() {
  if (sqlClient) return sqlClient

  const config = useRuntimeConfig()
  const dbUrl = config.databaseUrl || process.env.DATABASE_URL || process.env.POSTGRES_URL

  if (!dbUrl) {
    console.warn('⚠️ No DATABASE_URL set — running with mock memory store until DATABASE_URL is configured.')
    return null
  }

  try {
    sqlClient = postgres(dbUrl, {
      ssl: dbUrl.includes('neon.tech') || dbUrl.includes('sslmode=require') ? 'require' : false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    })
    return sqlClient
  } catch (err) {
    console.error('Failed to initialize postgres client:', err)
    return null
  }
}
