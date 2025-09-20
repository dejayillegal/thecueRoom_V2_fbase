import type { Metadata } from 'next';
import { Inter, Source_Code_Pro } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-source-code-pro', display: 'swap' });

export const metadata: Metadata = {
  title: 'TheCueRoom',
  description: 'A creative control room for cues, playlists, and gigs—synchronized across web and mobile.',
  metadataBase: new URL('https://thecueroom.local'),
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sourceCodePro.variable}`} suppressHydrationWarning>
      <body>
        {children}
      </body>
    </html>
  );
}
