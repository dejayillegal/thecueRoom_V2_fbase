import type { CSSProperties } from 'react';
import Link from 'next/link';

const surfaceStyle: CSSProperties = {
  backgroundColor: '#111111',
  borderRadius: '1.5rem',
  padding: '3rem',
  border: '1px solid rgba(209, 255, 61, 0.2)',
  boxShadow: '0 24px 72px rgba(135, 59, 191, 0.25)',
  maxWidth: '720px',
  width: '100%',
};

const buttonStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '999px',
  padding: '0.875rem 1.75rem',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0.02em',
  textDecoration: 'none',
  transition: 'transform 120ms ease, box-shadow 120ms ease',
};

const primaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: '#D1FF3D',
  color: '#0B0B0B',
  boxShadow: '0 16px 32px rgba(209, 255, 61, 0.25)',
};

const secondaryButtonStyle: CSSProperties = {
  ...buttonStyle,
  backgroundColor: 'transparent',
  color: '#D1FF3D',
  border: '1px solid rgba(209, 255, 61, 0.4)',
};

export default function HomePage() {
  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 1.5rem',
      }}
    >
      <section style={surfaceStyle}>
        <p
          style={{
            fontFamily: 'var(--font-source-code-pro)',
            color: '#D1FF3D',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}
        >
          TheCueRoom
        </p>
        <h1
          style={{
            fontSize: '3rem',
            lineHeight: 1.05,
            margin: 0,
            color: '#F5F5F5',
          }}
        >
          Command playlists, gigs, and memes from a single creative cockpit.
        </h1>
        <p
          style={{
            marginTop: '1.5rem',
            marginBottom: '2.5rem',
            fontSize: '1.15rem',
            maxWidth: '48ch',
            color: 'rgba(245, 245, 245, 0.75)',
          }}
        >
          Sync cues between web and mobile, trigger Supabase-powered magic links, and stay in the loop with real-time updates.
        </p>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <Link href="/login" style={primaryButtonStyle} aria-label="Open the login flow">
            Launch Login
          </Link>
          <Link href="/feed" style={secondaryButtonStyle} aria-label="Preview the live feed">
            Preview Feed
          </Link>
        </div>
      </section>
    </main>
  );
}
