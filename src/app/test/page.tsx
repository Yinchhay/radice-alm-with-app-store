import { db } from "@/drizzle/db";

export default async function TestPage() {
  const user = await db.query.userTable.findFirst({
    where: (userTable, {eq, and, or}) => or(eq(userTable.id, "1"), eq(userTable.id, "2")),
  })
  
  return (
    <div>
      <h1>User name: {user?.username}</h1>
      <h1>Test Page</h1>
      <p>
        This is a test page. You can edit this page by opening{" "}
        <code>src/app/test/page.tsx</code>.
      </p>
    </div>
  );
}