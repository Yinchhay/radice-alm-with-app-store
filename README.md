## Getting Started

Install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```


Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Database commands

Migrate change of the schema `src/drizzle/migrations/`:
   - The schema being used is in `src/drizzle/schema.ts`.
```bash
npm run db_migrate
```

Pull the latest schema from the database, the schema will be saved in `src/drizzle/migrations/schema.ts`. However, the schema being used is in `src/drizzle/schema.ts`. So compare the two files to see the difference and copy changes to the schema being used. Technically not recommended to run this command, but it's there for reference:
   - The reason for separating the schema being used and the schema pulled from the database is to avoid overwriting the schema being used. The schema being used should be updated manually.
```bash
npm run db_pull
```

Push the latest schema to the database:
   - The schema being used is in `src/drizzle/schema.ts`.
```bash
npm run db_push
```

## Learn More

To learn more about this project tech stack, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Lucia Auth](https://lucia-auth.com/) - learn about Lucia Auth features.
- [Drizzle](https://orm.drizzle.team/docs/overview) - learn about Drizzle orm features.
- [React](https://react.dev/reference/react) - learn about React features.
