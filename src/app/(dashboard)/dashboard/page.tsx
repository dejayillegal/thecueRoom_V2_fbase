// Server Component
export const dynamic = "force-dynamic"; // optional, but avoids stale preview caching

export default function DashboardPage() {
  return (
    <section style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <ul>
        <li><a href="/news">News Feed</a></li>
        <li><a href="/settings">Settings</a></li>
      </ul>
    </section>
  );
}
