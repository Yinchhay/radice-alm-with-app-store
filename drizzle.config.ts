import type { Config } from 'drizzle-kit';
import '@/lib/load_env'

export default {
  introspect: {
    casing: 'camel',
  },
  schema: './src/drizzle/schema.ts',
  /**
   * schema.ts will be introspected and migration files will be generated in this folder
   */
  out: './src/drizzle/migrations',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306'),
    database: process.env.DB_DATABASE ?? '',
    user: process.env.DB_USERNAME ?? '',
    password: process.env.DB_PASSWORD ?? '',
  },
} satisfies Config;