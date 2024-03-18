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

Migrate change of the schema `src/drizzle/schema.ts`:

-   Recommended to run this command after making changes to the schema in `src/drizzle/schema.ts`.

```bash
npm run db_migrate
```

Pull the latest schema from the database, the schema will be saved in `src/drizzle/migrations/schema.ts`. However, the schema being used is in `src/drizzle/schema.ts`.

So compare the two files to see the difference and copy changes to the schema being used. Technically not recommended to run this command, but it's there for reference:

-   The reason for separating the schema being used and the schema pulled from the database is to avoid overwriting the schema being used. The schema being used should be updated manually.

```bash
npm run db_pull
```

Push the latest schema to the database:

-   The schema being used is in `src/drizzle/schema.ts`.

```bash
npm run db_push
```

-   Read further about `migrate` and `push` to understand the difference between the two commands [Drizzle Faq](https://orm.drizzle.team/kit-docs/faq#should-i-use-generate-or-push).

## Change Requirements

Sometimes, changes happen as the project progresses. Here are what required to check upon making changes to the project:

-   Database schema: updating erd and relation between tables must also update the relation in `src/drizzle/schema.ts`. after change either run `npm run db_migrate` or `npm run db_push` to update the database schema.

## Testing

Ensure that everything is working as expected, like the database, etc. before running the tests.

Run the cypress e2e test on browser:
```bash
npm run cypress:open
```

Run the cypress e2e test on terminal:
```bash
npm run cypress:run
```

Run the cypress e2e with specific test file:
```bash
npx cypress run --spec cypress/e2e/file_name.spec.ts
```

## Learn More

To learn more about this project tech stack, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
-   [Lucia Auth](https://lucia-auth.com/) - learn about Lucia Auth features.
-   [Drizzle](https://orm.drizzle.team/docs/overview) - learn about Drizzle orm features.
-   [React](https://react.dev/reference/react) - learn about React features.
-   [Cypress](https://docs.cypress.io/guides/overview/why-cypress) - learn about Cypress features.
