import type { Metadata } from 'next';
import '@/styles/globals.css';

const metadata: Metadata = {
  title: 'ARVEX Cloud - VPS Hosting Platform',
  description: 'Production-grade VPS hosting platform with real-time monitoring and management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
