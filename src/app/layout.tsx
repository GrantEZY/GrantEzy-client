import type { Metadata } from 'next';

import { Inter } from 'next/font/google';

import { AuthProvider } from '@/components/providers/AuthProvider';
import { Providers } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/ui/Toast';

import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GrantEzy',
  description: 'Application to manage grants and funding opportunities',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = sessionStorage.getItem('theme-mode') || 'light';
                  document.documentElement.className = theme;
                } catch (e) {
                  document.documentElement.className = 'light';
                }
              })();
            `,
          }}
        />
      </head>

      <body className={`${inter.variable} font-inter antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <Providers>{children}</Providers>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
