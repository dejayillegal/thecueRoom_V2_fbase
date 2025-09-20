import type { AppProps } from 'next/app';
import { StyleRegistry, createStyleRegistry } from 'styled-jsx';
import { useState } from 'react';
import '../app/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [registry] = useState(() => createStyleRegistry());

  return (
    <StyleRegistry registry={registry}>
      <Component {...pageProps} />
    </StyleRegistry>
  );
}
