export default function NotFound() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
        backgroundColor: '#0B0B0B',
        color: '#F5F5F5',
      }}
    >
      <div
        style={{
          backgroundColor: '#111111',
          borderRadius: '1rem',
          padding: '3rem',
          border: '1px solid rgba(209, 255, 61, 0.2)',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Page not found</h1>
        <p style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
          The cue you were looking for is offstage. Double-check the URL or head back to the landing page.
        </p>
      </div>
    </main>
  );
}
