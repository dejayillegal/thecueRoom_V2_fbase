'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('App Router error boundary', error);
  }, [error]);

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
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: '32rem',
          backgroundColor: '#111111',
          border: '1px solid rgba(135, 59, 191, 0.35)',
          borderRadius: '1rem',
          padding: '3rem',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Something glitched</h1>
        <p style={{ color: 'rgba(245, 245, 245, 0.75)', marginBottom: '2rem' }}>
          A hiccup in the signal disrupted this page. Try refreshing or head back to the landing screen.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            backgroundColor: '#D1FF3D',
            color: '#0B0B0B',
            border: 'none',
            borderRadius: '999px',
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Retry
        </button>
      </div>
    </main>
  );
}
