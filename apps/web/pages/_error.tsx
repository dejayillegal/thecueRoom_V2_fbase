import type { NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

function ErrorPage({ statusCode }: ErrorProps) {
  const message = statusCode ? `Server error ${statusCode}` : 'An unexpected error occurred';

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
          border: '1px solid rgba(135, 59, 191, 0.35)',
        }}
      >
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{message}</h1>
        <p style={{ color: 'rgba(245, 245, 245, 0.7)' }}>Return to the home page to keep the cues flowing.</p>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode;
  return { statusCode };
};

export default ErrorPage;
