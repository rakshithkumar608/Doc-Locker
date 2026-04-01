// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/layouts/ThemeProvider';


const inter = Inter({ subsets: ['latin'], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'DocVault - Secure Document Locker',
  description: 'End-to-End Encrypted Personal Vault',
  icons: { icon: '/lock.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-200`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}