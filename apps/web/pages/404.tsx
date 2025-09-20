export default function PageNotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B0B0B',
        color: '#F5F5F5',
        fontFamily: 'var(--font-inter), system-ui, sans-serif',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: '#111111',
          padding: '2.5rem',
          borderRadius: '1rem',
          border: '1px solid rgba(209, 255, 61, 0.25)',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 — cue not found</h1>
        <p style={{ color: 'rgba(245, 245, 245, 0.7)' }}>
          We couldn&apos;t locate that scene. Use the navigation controls to head back to safety.
        </p>
      </div>
    </div>
  );
}
