// Server Component
import { use } from "react";

type SearchParams = { monospaceUid?: string };

// ✅ Next 15+ “unwrap with React.use()” pattern
export default function Home({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = use(searchParams); // do NOT enumerate the promise itself
  const uid = sp?.monospaceUid;

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>thecueRoom</h1>
      <p>Welcome{uid ? `, session: ${uid}` : ""}.</p>
      <p>
        Go to <a href="/dashboard">Dashboard</a>
      </p>
    </main>
  );
}
