import type { Config } from 'drizzle-kit';
import '@/lib/loadEnv'

export default {
  schema: './src/drizzle/migrations/schema.ts',
  // migration files will be generated in this folder
  out: './src/drizzle/migrations',
  driver: 'mysql2', // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306'),
    database: process.env.DB_DATABASE ?? '',
    user: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
  },
} satisfies Config;