// Server Component
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "thecueRoom",
  description: "Underground music dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
