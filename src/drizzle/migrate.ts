import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db } from './db';
import mysqlPool from './connection';

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: 'src/drizzle/migrations' });
// Don't forget to close the poolConnection, otherwise the script will hang
await mysqlPool.end();