# Migration Usage

Generate new .sql schema file for a new migration. The output will be a new file in the `migrations` directory.
```bash
npx drizzle-kit generate:mysql
```

Start the migration process:
```bash
npx tsx src/drizzle/migrate.ts
```

Pull the latest schema from the database:
```bash
npx drizzle-kit pull:mysql
```