import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tivaro | Professional Business Platform",
  description: "Next-generation business management and finance tracking.",
  manifest: "/manifest.json",
  icons: {
    icon: "/tivaro_logo_1024.svg",
  },
};

import { Toaster } from 'sonner';
import PWARegister from '@/components/PWARegister';
import SyncProvider from '@/components/SyncProvider';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased overflow-x-hidden`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <PWARegister />
        <SyncProvider>
          {children}
        </SyncProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

